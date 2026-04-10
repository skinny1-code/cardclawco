import TierPage from './TierPage.jsx'
const CONFIG = {
  packId:'ultraclaw', name:'UltraClaw', price:'$100', credits:100,
  color:'#A78BFA', glow:'rgba(167,139,250,0.25)', bgTint:'#0e0a1a',
  badge:'SERIOUS COLLECTOR · $100', icon:'💎',
  tagline:'Legendary pulls. Investment-grade cards.',
  description:'100 pulls from an exclusive pool of Legendary graded cards valued at $420–$950 FMV. Charizard VMAX Alt Art, PSA 10 Shohei Ohtani, Gojo Satoru auto, and more. Cards worth holding.',
  rarity:'LEGENDARY · PSA 9–10',
  cards:[
    { name:'Charizard VMAX Alt Art', grade:'PSA 9',  fmv:950, img:'https://images.pokemontcg.io/swsh3/20_hires.png' },
    { name:'Charizard Base Set',     grade:'PSA 9',  fmv:850, img:'https://images.pokemontcg.io/base1/4_hires.png' },
    { name:'Victor Wembanyama RC',   grade:'PSA 10', fmv:660, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Gojo Satoru Auto',       grade:'PSA 10', fmv:620, img:'https://static.wikia.nocookie.net/jujutsu-kaisen/images/5/5a/Satoru_Gojo_mugshot.png' },
    { name:'Luffy Gear 5 /10',       grade:'BGS 10', fmv:490, img:'https://static.wikia.nocookie.net/onepiece/images/4/4f/Monkey_D._Luffy_Anime_Post_Timeskip_Infobox.png' },
    { name:'Shohei Ohtani RC 2023',  grade:'PSA 10', fmv:420, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
  ],
}
export default function UltraClawPage() { return <TierPage config={CONFIG}/> }
