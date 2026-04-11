import { withAuth } from '../lib/auth.js'
import { db } from '../lib/db.js'

const TIER_PULL_COL = {
  CoreClaw:    'coreclaw_pulls',
  PremierClaw: 'premierclaw_pulls',
  UltraClaw:   'ultraclaw_pulls',
  QuantumClaw: 'quantumclaw_pulls',
}
const TIER_CREDITS = { CoreClaw:25, PremierClaw:50, UltraClaw:100, QuantumClaw:500 }

export default withAuth(async (req, res) => {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' })

  // Only available in test mode
  if (process.env.TEST_MODE !== 'true') {
    return res.status(403).json({ error: 'Not available in production mode' })
  }

  const { userId } = req.auth
  const { tier = 'CoreClaw' } = req.body || {}

  if (!TIER_PULL_COL[tier]) {
    return res.status(400).json({ error: 'Invalid tier', valid: Object.keys(TIER_PULL_COL) })
  }

  const { data: user } = await db
    .from('users')
    .select('id, credits, ' + TIER_PULL_COL[tier])
    .eq('clerk_id', userId).single()

  if (!user) return res.status(404).json({ error: 'User not found' })

  const pullCol = TIER_PULL_COL[tier]
  const tierCredits = TIER_CREDITS[tier]

  const updates = {
    [pullCol]: (user[pullCol] || 0) + 1,
    credits: (user.credits || 0) + tierCredits,
    updated_at: new Date().toISOString(),
  }

  await db.from('users').update(updates).eq('clerk_id', userId)

  return res.status(200).json({
    success: true,
    tier,
    message: `TEST MODE: 1 ${tier} pull granted free`,
  })
})
