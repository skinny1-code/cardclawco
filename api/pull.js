import { withAuth } from '../lib/auth.js'
import { db, rpc } from '../lib/db.js'
import { checkPullRateLimit, cacheDel, cacheGet, cacheSet, CACHE_KEYS } from '../lib/redis.js'

const TIER_COST = { CoreClaw:25, PremierClaw:50, UltraClaw:100, QuantumClaw:500 }

function pickCardForTier(cards, tier) {
  const pool = cards.filter(c => c.claw_tier === tier && c.remaining > 0)
  if (!pool.length) return null
  // Weighted by rarity
  const roll = Math.random() * 100
  const legendary = pool.filter(c => c.rarity === 'Legendary')
  const ultraRare  = pool.filter(c => c.rarity === 'Ultra Rare')
  const rare       = pool.filter(c => c.rarity === 'Rare')
  let bucket = pool
  if (roll < 5  && legendary.length)  bucket = legendary
  else if (roll < 20 && ultraRare.length) bucket = ultraRare
  else if (roll < 50 && rare.length)  bucket = rare
  return bucket[Math.floor(Math.random() * bucket.length)]
}

export default withAuth(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })
  const { userId } = req.auth
  const { tier } = req.body || {}

  if (!tier || !TIER_COST[tier]) {
    return res.status(400).json({ error: 'tier required', valid: Object.keys(TIER_COST) })
  }

  const cost = TIER_COST[tier]

  // Rate limit
  const { success } = await checkPullRateLimit(userId)
  if (!success) return res.status(429).json({ error: 'Too many pulls — slow down' })

  // Check user has enough credits for this tier
  const { data: user } = await db.from('users').select('id,credits,is_first_pull_done').eq('clerk_id', userId).single()
  if (!user) return res.status(404).json({ error: 'User not found' })
  if (user.credits < cost) {
    return res.status(400).json({
      error: `Insufficient credits for ${tier}`,
      required: cost,
      have: user.credits,
      tier,
      buyUrl: `/${tier.toLowerCase()}`,
    })
  }

  // Get pool
  let cards = await cacheGet(CACHE_KEYS.POOL)
  if (!cards?.length) {
    const { data } = await db.from('cards').select('*').eq('is_active', true).gt('remaining', 0)
    cards = data || []
  }

  const card = pickCardForTier(cards, tier)
  if (!card) return res.status(400).json({ error: `No cards available in ${tier} pool` })

  // Atomic pull
  let result
  try {
    result = await rpc('do_pull', { p_clerk_id: userId, p_card_id: card.id })
  } catch (err) {
    return res.status(err.status || 500).json({ error: err.message })
  }

  await cacheDel(CACHE_KEYS.POOL, CACHE_KEYS.USER(userId))

  // Log to feed
  await rpc('log_pull_feed', {
    p_card_name: card.name, p_rarity: card.rarity, p_fmv: card.fmv,
    p_emoji: card.image_url || '🃏', p_tier: tier, p_nft: result.nft_token_id,
  }).catch(() => {})

  return res.status(200).json({
    card,
    vault: { id: result.vault_id, card_id: card.id, nft_token_id: result.nft_token_id, burned: false, card },
    creditsRemaining: result.credits_remaining,
    tierCost: cost,
    isFirstPull: result.is_first_pull,
  })
})
