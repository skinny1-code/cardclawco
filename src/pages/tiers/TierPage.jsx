import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SignInButton, useAuth } from '@clerk/clerk-react'
import { useApi } from '../../hooks/useApi.js'
import { useUser } from '../../hooks/useUser.js'
import { Spinner } from '../../components/UI.jsx'

const OTHER_TIERS = [
  { name:'CoreClaw',    price:'$25',  icon:'⚙️', path:'/coreclaw',    color:'#60A5FA' },
  { name:'PremierClaw', price:'$50',  icon:'⭐', path:'/premierclaw', color:'#34D399' },
  { name:'UltraClaw',   price:'$100', icon:'💎', path:'/ultraclaw',   color:'#A78BFA' },
  { name:'QuantumClaw', price:'$500', icon:'⚡', path:'/quantumclaw', color:'#C9A84C' },
]

export default function TierPage({ config }) {
  const navigate = useNavigate()
  const { isSignedIn } = useAuth()
  const { apiFetch } = useApi()
  const { user } = useUser()
  const [buying, setBuying] = useState(false)

  const isNewUser = user && !user.is_first_pull_done
  const showDiscount = isNewUser && config.packId === 'coreclaw'

  const buy = async () => {
    if (!isSignedIn) return
    setBuying(true)
    try {
      const { url } = await apiFetch('/api/create-checkout-session', { method:'POST', body:{ packId: config.packId } })
      if (url) window.location.href = url
    } catch { setBuying(false) }
  }

  const { name, price, credits, color, glow, tagline, badge, icon, packId, cards, rarity, description } = config

  return (
    <div style={{ minHeight:'100vh', background:`linear-gradient(160deg,#080c12 0%,${config.bgTint} 50%,#060a10 100%)`, color:'#F0EDE6', fontFamily:"'Lato',sans-serif" }}>
      <style>{'@import url(\'https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,400;0,600;1,400&family=DM+Mono:wght@400;500&family=Lato:wght@300;400;700&display=swap\'); @keyframes goldGlow{0%,100%{box-shadow:0 0 0 0 transparent}50%{box-shadow:0 0 30px 4px ' + glow + '}}'}</style>

      {/* Hero */}
      <div style={{ position:'relative', overflow:'hidden', borderBottom:`1px solid ${color}22` }}>
        <div style={{ position:'absolute',inset:0,background:`radial-gradient(ellipse at 50% 0%,${glow} 0%,transparent 65%)`,pointerEvents:'none' }}/>

        <div style={{ maxWidth:500, margin:'0 auto', padding:'40px 24px 36px', position:'relative', zIndex:1 }}>
          {/* Nav */}
          <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32 }}>
            <button onClick={() => navigate('/')} style={{ background:'none',border:'none',color:'rgba(240,237,230,0.3)',fontSize:11,letterSpacing:2,cursor:'pointer',padding:0 }}>← BACK</button>
            {isSignedIn && user && (
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:color,background:`${color}12`,border:`1px solid ${color}25`,borderRadius:6,padding:'3px 10px' }}>
                {user.credits} credits
              </div>
            )}
          </div>

          {/* Badge */}
          <div style={{ textAlign:'center', marginBottom:20 }}>
            <div style={{ display:'inline-flex',alignItems:'center',gap:8,background:`${color}15`,border:`1px solid ${color}30`,borderRadius:20,padding:'5px 16px',marginBottom:20 }}>
              <div style={{ width:8,height:8,borderRadius:'50%',background:color,boxShadow:`0 0 8px ${color}` }}/>
              <span style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color }}>{badge}</span>
            </div>

            <div style={{ fontSize:48, marginBottom:8 }}>{icon}</div>
            <h1 style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:56,fontWeight:600,color:'#F0EDE6',lineHeight:1,margin:0,marginBottom:8 }}>{name}</h1>
            <p style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:18,color:'rgba(240,237,230,0.4)',fontStyle:'italic',margin:0,marginBottom:8 }}>{tagline}</p>
            <p style={{ fontFamily:"'Lato',sans-serif",fontSize:12,color:'rgba(240,237,230,0.35)',maxWidth:360,margin:'0 auto',lineHeight:1.6 }}>{description}</p>
          </div>

          {/* Price box */}
          <div style={{ background:`${color}10`,border:`2px solid ${color}40`,borderRadius:18,padding:'24px 32px',marginBottom:20,textAlign:'center',boxShadow:`0 0 50px ${glow}`,animation:'goldGlow 3s ease-in-out infinite',maxWidth:320,margin:'0 auto 20px' }}>
            {showDiscount && (
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:2,color:'#34D399',marginBottom:8 }}>🎁 FIRST PULL WELCOME OFFER</div>
            )}
            <div style={{ display:'flex',alignItems:'baseline',justifyContent:'center',gap:10,marginBottom:6 }}>
              {showDiscount && <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:26,color:'rgba(240,237,230,0.3)',textDecoration:'line-through' }}>$25</span>}
              <span style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:64,fontWeight:600,color:showDiscount?'#34D399':color,lineHeight:1 }}>{showDiscount?'$15':price}</span>
            </div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:10,color:'rgba(240,237,230,0.4)',letterSpacing:1 }}>{credits} CREDITS · $1 PER PULL</div>
            <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:color,marginTop:6,letterSpacing:1 }}>{rarity}</div>
          </div>

          {/* CTA */}
          <div style={{ maxWidth:320, margin:'0 auto' }}>
            {isSignedIn ? (
              <button onClick={buy} disabled={buying} style={{ width:'100%',padding:'18px',background:`linear-gradient(135deg,${color}30,${color}10)`,border:`2px solid ${color}`,borderRadius:14,color,fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,letterSpacing:2,cursor:buying?'not-allowed':'pointer',display:'flex',alignItems:'center',justifyContent:'center',gap:10,boxShadow:`0 0 24px ${glow}` }}>
                {buying ? <><Spinner size={18} color={color}/> Processing…</> : `PULL ${name} · ${showDiscount?'$15':price}`}
              </button>
            ) : (
              <SignInButton mode="modal">
                <button style={{ width:'100%',padding:'18px',background:`linear-gradient(135deg,${color}30,${color}10)`,border:`2px solid ${color}`,borderRadius:14,color,fontFamily:"'Cormorant Garamond',serif",fontSize:22,fontWeight:600,letterSpacing:2,cursor:'pointer',boxShadow:`0 0 24px ${glow}` }}>
                  SIGN IN TO PULL
                </button>
              </SignInButton>
            )}
            <div style={{ textAlign:'center',marginTop:12,fontFamily:"'Lato',sans-serif",fontSize:11,color:'rgba(240,237,230,0.25)' }}>
              ↔ Swap any card for 65% FMV back as credits — instantly
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth:500, margin:'0 auto', padding:'32px 24px 60px' }}>

        {/* Cards in pool */}
        <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:3,color:'rgba(240,237,230,0.3)',marginBottom:16,textAlign:'center' }}>CARDS IN THIS POOL</div>
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:10, marginBottom:32 }}>
          {cards.map((c,i) => (
            <div key={i} style={{ background:`${color}06`,border:`1px solid ${color}15`,borderRadius:12,padding:'12px',display:'flex',alignItems:'center',gap:10 }}>
              <div style={{ width:38,height:48,borderRadius:6,overflow:'hidden',flexShrink:0,background:'rgba(0,0,0,0.3)',border:`1px solid ${color}20` }}>
                <img src={c.img} style={{ width:'100%',height:'100%',objectFit:'cover' }} alt="" onError={e=>{e.target.style.display='none'}}/>
              </div>
              <div style={{ minWidth:0 }}>
                <div style={{ fontFamily:"'Lato',sans-serif",fontSize:10,color:'#F0EDE6',fontWeight:700,marginBottom:2,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap' }}>{c.name}</div>
                <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,color:'rgba(240,237,230,0.3)',marginBottom:1 }}>{c.grade}</div>
                <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color }}>${c.fmv.toLocaleString()}</div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div style={{ display:'grid',gridTemplateColumns:'1fr 1fr 1fr',gap:10,marginBottom:32 }}>
          {[['Pool Size',`${cards.length} cards`,'🃏'],['FMV Range',`$${Math.min(...cards.map(c=>c.fmv))}–$${Math.max(...cards.map(c=>c.fmv)).toLocaleString()}`,'💰'],['Swap Back','65% FMV','↔']].map(([l,v,icon])=>(
            <div key={l} style={{ background:'rgba(255,255,255,0.02)',border:'1px solid rgba(255,255,255,0.06)',borderRadius:10,padding:'14px 12px',textAlign:'center' }}>
              <div style={{ fontSize:20,marginBottom:6 }}>{icon}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:8,letterSpacing:1.5,color:'rgba(240,237,230,0.25)',marginBottom:4 }}>{l}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:15,fontWeight:600,color:'#F0EDE6' }}>{v}</div>
            </div>
          ))}
        </div>

        {/* Other tiers nav */}
        <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,letterSpacing:3,color:'rgba(240,237,230,0.3)',marginBottom:14,textAlign:'center' }}>EXPLORE OTHER TIERS</div>
        <div style={{ display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:8 }}>
          {OTHER_TIERS.filter(t => t.path !== `/${packId}`).map(t => (
            <button key={t.name} onClick={() => navigate(t.path)} style={{ background:`${t.color}10`,border:`1px solid ${t.color}25`,borderRadius:10,padding:'12px 6px',cursor:'pointer',textAlign:'center',transition:'all 0.2s' }}>
              <div style={{ fontSize:20,marginBottom:4 }}>{t.icon}</div>
              <div style={{ fontFamily:"'Cormorant Garamond',serif",fontSize:12,fontWeight:600,color:'#F0EDE6',marginBottom:2 }}>{t.name}</div>
              <div style={{ fontFamily:"'DM Mono',monospace",fontSize:9,color:t.color }}>{t.price}</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
