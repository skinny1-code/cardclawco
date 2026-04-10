import TierPage from './TierPage.jsx'
const CONFIG = {
  packId:'coreclaw', name:'CoreClaw', price:'$25', credits:25,
  color:'#60A5FA', glow:'rgba(96,165,250,0.2)', bgTint:'#0a1020',
  badge:'ENTRY LEVEL · $25', icon:'⚙️',
  tagline:'Your gateway to graded card collecting',
  description:'Pull from a pool of 12 graded cards across Sports, Pokémon, Anime & NFT. Every card is authenticated and verified. Don\'t love your pull? Swap it for 65% FMV back instantly.',
  rarity:'RARE · ULTRA RARE · LEGENDARY',
  cards:[
    { name:'Azuki NFT #1337',       grade:'Auth.',  fmv:380, img:'https://ipfs.io/ipfs/QmNSdgZnc7ZFdnZpF5FbKHVGYPdRH3mfNKPJiijqiLfNF8' },
    { name:'Jokic Optic Holo 2016', grade:'PSA 9',  fmv:180, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'F. Tatis Jr. Finest',   grade:'PSA 10', fmv:145, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Tyreek Hill Mosaic RC', grade:'PSA 10', fmv:130, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Trae Young Select RC',  grade:'PSA 10', fmv:110, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Naruto Gold Leaf',      grade:'BGS 9',  fmv:95,  img:'https://static.wikia.nocookie.net/naruto/images/d/dc/Naruto_newshot.png' },
    { name:'Tyreek Hill Mosaic RC', grade:'PSA 10', fmv:130, img:'https://www.baseball-reference.com/minors/img/baseball.png' },
    { name:'Ja Morant Select RC',   grade:'PSA 10', fmv:88,  img:'https://www.baseball-reference.com/minors/img/baseball.png' },
  ],
}
export default function CoreClawPage() { return <TierPage config={CONFIG}/> }
