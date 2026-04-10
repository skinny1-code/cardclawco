import TierPage from './TierPage.jsx'
const CONFIG = {
  packId:'premierclaw', name:'PremierClaw', price:'$50', credits:50,
  color:'#34D399', glow:'rgba(52,211,153,0.2)', bgTint:'#0a1812',
  badge:'MOST POPULAR · $50', icon:'⭐',
  tagline:'Ultra Rare pulls. Serious collector territory.',
  description:'50 pulls from a premium pool of Ultra Rare graded cards. PSA/BGS authenticated Sports, Pokémon, Anime & NFT cards ranging from $180–$720 FMV. Your vault starts looking impressive.',
  rarity:'ULTRA RARE · LEGENDARY',
  cards:[
    { name:'CryptoPunk #3498',       grade:'Auth.',  fmv:720, img:'https://ipfs.io/ipfs/QmcBq1TK6pnLc4NUR1MjYYVVaEZxcJWgKLH4VwkJKdvR6A' },
    { name:'Doodles NFT #8888',      grade:'Auth.',  fmv:560, img:'https://ipfs.io/ipfs/QmZcH4YvBVVRJtdn4RdbaqgspFU8gH6P9vomDpBVpAL3u4' },
    { name:'Patrick Mahomes Prizm',  grade:'BGS 9.5',fmv:380, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Anthony Edwards Prizm',  grade:'PSA 10', fmv:340, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Pikachu VMAX Rainbow',   grade:'PSA 10', fmv:280, img:'https://images.pokemontcg.io/swsh4/44_hires.png' },
    { name:'Mewtwo Base Set Holo',   grade:'PSA 9',  fmv:320, img:'https://images.pokemontcg.io/base1/10_hires.png' },
    { name:'Gengar Fossil Holo',     grade:'PSA 9',  fmv:390, img:'https://images.pokemontcg.io/fossil/5_hires.png' },
    { name:'Ronald Acuña Bowman',    grade:'PSA 10', fmv:290, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
  ],
}
export default function PremierClawPage() { return <TierPage config={CONFIG}/> }
