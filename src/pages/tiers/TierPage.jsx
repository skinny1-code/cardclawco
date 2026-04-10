import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignInButton, useAuth } from '@clerk/clerk-react'
import { useApi } from '../../hooks/useApi.js'
import { useUser } from '../../hooks/useUser.js'
import { RarityBadge, Toast } from '../../components/UI.jsx'
import { RARITY_CFG } from '../../lib/constants.js'

const PULL_KEY = {
  coreclaw: 'coreclaw_pulls', premierclaw: 'premierclaw_pulls',
  ultraclaw: 'ultraclaw_pulls', quantumclaw: 'quantumclaw_pulls'
}
const TIER_NAME = { coreclaw:'CoreClaw', premierclaw:'PremierClaw', ultraclaw:'UltraClaw', quantumclaw:'QuantumClaw' }

const OTHER_TIERS = [
  { id:'coreclaw',    name:'CoreClaw',    price:'$25',  icon:'⚙️', path:'/coreclaw',    color:'#60A5FA' },
  { id:'premierclaw', name:'PremierClaw', price:'$50',  icon:'⭐', path:'/premierclaw', color:'#34D399' },
  { id:'ultraclaw',   name:'UltraClaw',   price:'$100', icon:'💎', path:'/ultraclaw',   color:'#A78BFA' },
  { id:'quantumclaw', name:'QuantumClaw', price:'$500', icon:'⚡', path:'/quantumclaw', color:'#C9A84C' },
]

export default function TierPage({ config }) {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { apiFetch } = useApi()
  const { user, refresh } = useUser()
  const [buying, setBuying] = useState(false)
  const [pulling, setPulling] = useState(false)
  const [lastCard, setLastCard] = useState(null)
  const [toast, setToast] = useState(null)

  const showToast = (msg, type='default') => { setToast({msg,type}); setTimeout(()=>setToast(null),3500) }

  const pullKey = PULL_KEY[config.packId]
  const pullsAvailable = user ? (user[pullKey] || 0) : 0
  const isNewUser = user && !user.is_first_pull_done
  const showDiscount = isNewUser && config.packId === 'coreclaw'

  const buy = async () => {
    setBuying(true)
    try {
      const { url } = await apiFetch('/api/create-checkout-session', { method:'POST', body:{ packId: config.packId } })
      if (url) window.location.href = url
    } catch (err) { showToast(err.message, 'error'); setBuying(false) }
  }

  const pull = async () => {
    if (pullsAvailable < 1) return
    setPulling(true)
    setLastCard(null)
    try {
      const result = await apiFetch('/api/pull', { method:'POST', body:{ tier: TIER_NAME[config.packId] } })
      setLastCard({ ...result.card, nft_token_id: result.vault?.nft_token_id, vault_id: result.vault?.id })
      await refresh()
    } catch (err) { showToast(err.message, 'error') }
    finally { setPulling(false) }
  }

  const { name, price, color, glow, tagline, badge, icon, packId, cards, rarity, description, bgTint } = config

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(160deg,#080c12 0%,${bgTint} 50%,#060a10 100%)`, color:'#F0EDE6' }}>
      <style>{'@import url(\'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap\'); @keyframes revealDrop{from{opacity:0;transform:translateY(-20px) scale(0.92)}to{opacity:1;transform:translateY(0) scale(1)}} @keyframes goldGlow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 30px 6px ' + glow + '}}'}</style>

      {/* Reveal */}
      {lastCard && (
        <div style={{ position:'fixed',inset:0,background:'rgba(0,0,0,0.85)',backdropFilter:'blur(8px)',zIndex:300,display:'flex',alignItems:'center',justifyContent:'center',padding:20 }} onClick={() => setLastCard(null)}>
          <div style={{ background:`linear-gradient(135deg,${RARITY_CFG[lastCard.rarity]?.dimBg||'rgba(255,255,255,0.03)'},rgba(0,0,0,0.4))`,border:`2px solid ${RARITY_CFG[lastCard.rarity]?.border||color}`,borderRadius:20,padding:'28px 24px',maxWidth:340,width:'100%',textAlign:'center',animation:'revealDrop 0.5s cubic-bezier(0.34,1.56,0.64,1)',boxShadow:`0 0 60px ${glow}` }} onClick={e=>e.stopPropagation()}>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:3,color,marginBottom:12 }}>◆ {name.toUpperCase()} PULL ◆</div>
            <div style={{ width:80,height:100,margin:'0 auto 16px',borderRadius:10,overflow:'hidden',border:`2px solid ${color}40`,boxShadow:`0 0 30px ${glow}` }}>
              {lastCard.image_url ? <img src={lastCard.image_url} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt="" onError={e=>{e.target.style.display='none'}}/> : <div style={{ width:'100%',height:'100%',background:'rgba(0,0,0,0.5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:40 }}>🃏</div>}
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,color:'#F0EDE6',marginBottom:6 }}>{lastCard.name}</div>
            <div style={{ display:'flex',justifyContent:'center',gap:8,marginBottom:12 }}>
              <RarityBadge rarity={lastCard.rarity}/>
              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(240,237,230,0.4)' }}>{lastCard.grade}</span>
            </div>
            <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:36,fontWeight:600,color,marginBottom:4 }}>${(lastCard.fmv||0).toLocaleString()}</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'rgba(240,237,230,0.3)',marginBottom:6 }}>FAIR MARKET VALUE</div>
            {lastCard.total_pulls !== undefined && lastCard.total_pulls <= 3 && (
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:'#F59E0B',marginBottom:14 }}>
                🔥 {lastCard.total_pulls === 0 ? 'FIRST EVER PULL OF THIS CARD' : `ONLY PULLED ${lastCard.total_pulls} TIME${lastCard.total_pulls===1?'':'S'} EVER`}
              </div>
            )}
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(56,189,248,0.6)',marginBottom:16 }}>◈ NFT: {lastCard.nft_token_id}</div>
            <div style={{ display:'flex',gap:8 }}>
              {pullsAvailable > 0 && (
                <button onClick={()=>{setLastCard(null);pull()}} style={{ flex:1,padding:'11px',background:`${color}18`,border:`1px solid ${color}40`,borderRadius:9,color,fontFamily:"'Lato',sans-serif",fontSize:11,fontWeight:700,letterSpacing:1,cursor:'pointer' }}>
                  PULL AGAIN ({pullsAvailable} left)
                </button>
              )}
              <button onClick={()=>setLastCard(null)} style={{ flex:1,padding:'11px',background:'rgba(255,255,255,0.04)',border:'1px solid rgba(255,255,255,0.08)',borderRadius:9,color:'rgba(240,237,230,0.4)',fontFamily:"'Lato',sans-serif",fontSize:11,letterSpacing:1,cursor:'pointer' }}>
                {pullsAvailable > 0 ? 'CLOSE' : 'DONE'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hero */}
      <div style={{ position:'relative', overflow:'hidden', borderBottom:`1px solid ${color}18` }}>
        <div style={{ position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 0%,${glow} 0%,transparent 65%)`,pointerEvents:'none' }}/>
        <div style={{ maxWidth:500, margin:'0 auto', padding:'36px 24px 32px', position:'relative', zIndex:1 }}>

          {/* Nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
            <button onClick={() => navigate('/')} style={{ background:'none',border:'none',color:'rgba(240,237,230,0.3)',fontSize:11,letterSpacing:2,cursor:'pointer',padding:0,fontFamily:"'Lato',sans-serif" }}>← BACK</button>
            {isSignedIn && pullsAvailable > 0 && (
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color,background:`${color}12`,border:`1px solid ${color}25`,borderRadius:8,padding:'4px 12px' }}>
                {pullsAvailable} PULL{pullsAvailable===1?'':'S'} READY
              </div>
            )}
          </div>

          {/* Title */}
          <div style={{ textAlign:'center', marginBottom:24 }}>
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:`${color}12`,border:`1px solid ${color}25`,borderRadius:20,padding:'5px 16px',marginBottom:16 }}>
              <div style={{ width:7,height:7,borderRadius:'50%',background:color,boxShadow:`0 0 8px ${color}` }}/>
              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color }}>{badge}</span>
            </div>
            <div style={{ fontSize:44, marginBottom:8 }}>{icon}</div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:52,fontWeight:600,color:'#F0EDE6',lineHeight:1,margin:'0 0 8px' }}>{name}</h1>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:17,color:'rgba(240,237,230,0.4)',fontStyle:'italic',margin:'0 0 10px' }}>{tagline}</p>
            <p style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:'rgba(240,237,230,0.35)',maxWidth:380,margin:'0 auto',lineHeight:1.6 }}>{description}</p>
          </div>

          {/* Price + CTA */}
          <div style={{ maxWidth:340, margin:'0 auto' }}>
            {/* Price box */}
            <div style={{ background:`${color}08`,border:`2px solid ${color}35`,borderRadius:16,padding:'20px',marginBottom:16,textAlign:'center',animation:'goldGlow 3s ease-in-out infinite' }}>
              {showDiscount && <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color:'#34D399',marginBottom:8 }}>🎁 WELCOME OFFER — FIRST PULL</div>}
              <div style={{ display:'flex',alignItems:'baseline',justifyContent:'center',gap:10,marginBottom:4 }}>
                {showDiscount && <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:22,color:'rgba(240,237,230,0.3)',textDecoration:'line-through' }}>$25</span>}
                <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:600,color:showDiscount?'#34D399':color,lineHeight:1 }}>{showDiscount?'$15':price}</span>
              </div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:11,color:'rgba(240,237,230,0.5)',letterSpacing:1 }}>1 PULL · {rarity}</div>
            </div>

            {/* If user has pulls ready — show PULL NOW */}
            {isSignedIn && pullsAvailable > 0 && (
              <button onClick={pull} disabled={pulling} style={{ width:'100%',padding:'18px',background:`linear-gradient(135deg,${color}35,${color}15)`,border:`2px solid ${color}`,borderRadius:14,color,fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,letterSpacing:2,cursor:pulling?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:`0 0 30px ${glow}`,marginBottom:10 }}>
                {pulling ? <>⏳ Pulling…</> : <>🎰 PULL NOW · {pullsAvailable} LEFT</>}
              </button>
            )}

            {/* Buy button */}
            {isSignedIn ? (
              <button onClick={buy} disabled={buying} style={{ width:'100%',padding:'16px',background:pullsAvailable>0?'rgba(255,255,255,0.04)':`linear-gradient(135deg,${color}25,${color}08)`,border:`1px solid ${pullsAvailable>0?'rgba(255,255,255,0.1)':color+'60'}`,borderRadius:12,color:pullsAvailable>0?'rgba(240,237,230,0.4)':color,fontFamily:"'Cormorant Garamond',serif",fontSize:18,fontWeight:600,letterSpacing:2,cursor:buying?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:8 }}>
                {buying ? '⏳ Processing…' : `BUY ANOTHER PULL · ${showDiscount?'$15':price}`}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button style={{ width:'100%',padding:'18px',background:`linear-gradient(135deg,${color}30,${color}10)`,border:`2px solid ${color}`,borderRadius:14,color,fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,letterSpacing:2,cursor:'pointer',boxShadow:`0 0 24px ${glow}` }}>
                  SIGN IN · {showDiscount?'$15':price} PER PULL
                </button>
              </SignInButton>
            )}

            <div style={{ textAlign:'center',marginTop:10,fontFamily:"'Lato',sans-serif",fontSize:11,color:'rgba(240,237,230,0.25)' }}>
              ↔ Don't love your pull? Swap for 65% FMV back instantly
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:500, margin:'0 auto', padding:'28px 24px 60px' }}>

        {/* Cards in pool */}
        <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:3,color:'rgba(240,237,230,0.3)',marginBottom:14,textAlign:'center' }}>CARDS IN THIS POOL</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:28 }}>
          {cards.map((c,i) => (
            <div key={i} style={{ background:`${color}05`,border:`1px solid ${color}12`,borderRadius:12,padding:'12px',display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:38,height:48,borderRadius:6,overflow:'hidden',flexShrink:0,background:'rgba(0,0,0,0.4)',border:`1px solid ${color}18` }}>
                <img src={c.img} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt="" onError={e=>{e.target.style.display='none'}}/>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:'#F0EDE6',fontWeight:700,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(240,237,230,0.3)',marginBottom:2 }}>{c.grade}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color }}>${c.fmv.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats row */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:28 }}>
          {[['Per Pull',price,'💳'],['FMV Range',`$${Math.min(...cards.map(c=>c.fmv))}–$${Math.max(...cards.map(c=>c.fmv)).toLocaleString()}`,'💰'],['Swap Back','65% FMV','↔']].map(([l,v,ic])=>(
            <div key={l} style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.05)',borderRadius:10,padding:'14px 10px',textAlign:'center' }}>
              <div style={{ fontSize:18,marginBottom:6 }}>{ic}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:7,letterSpacing:1.5,color:'rgba(240,237,230,0.25)',marginBottom:4 }}>{l}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:'#F0EDE6' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Other tiers */}
        <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:3,color:'rgba(240,237,230,0.3)',marginBottom:12,textAlign:'center' }}>OTHER MACHINES</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8 }}>
          {OTHER_TIERS.filter(t=>t.id!==packId).map(t=>(
            <button key={t.id} onClick={()=>navigate(t.path)} style={{ background:`${t.color}10`,border:`1px solid ${t.color}22`,borderRadius:10,padding:'12px 6px',cursor:'pointer',textAlign:'center' }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{t.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontWeight:600,color:'#F0EDE6',marginBottom:2 }}>{t.name}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:t.color }}>{t.price}</div>
            </button>
          ))}
        </div>
      </div>

      <Toast toast={toast}/>
    </div>
  )
}
