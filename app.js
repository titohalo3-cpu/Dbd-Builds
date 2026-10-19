(function(){
const KILLERS=["The Trapper","The Wraith","The Hillbilly","The Nurse","The Shape","The Hag","The Doctor","The Huntress","The Cannibal","The Nightmare","The Pig","The Clown","The Spirit","The Legion","The Plague","The Ghost Face","The Demogorgon","The Oni","The Deathslinger","The Executioner","The Blight","The Twins","The Trickster","The Nemesis","The Cenobite","The Artist","The Onryō","The Dredge","The Mastermind","The Knight","The Skull Merchant","The Singularity","The Xenomorph","The Good Guy","The Unknown","The Lich - Vecna","Dracula","The Houndmaster","The Ghoul","The Animatronic","The Krasue","The First","The Slasher","The Judgment"];
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const BASE=KILLERS.map((n,i)=>({id:"k-"+slug(n),name:n,rel:i+1}));

const DEFAULT_IMGS={"k-the-mastermind": "killers/the-mastermind.webp","k-the-unknown": "killers/the-unknown.webp","k-the-onryo": "killers/the-onryo.webp","k-the-dredge": "killers/the-dredge.webp","k-the-knight": "killers/the-knight.webp","k-the-skull-merchant": "killers/the-skull-merchant.webp","k-the-singularity": "killers/the-singularity.webp","k-the-krasue": "killers/the-krasue.webp","k-the-demogorgon": "killers/the-demogorgon.webp","k-the-first": "killers/the-first.webp","k-the-slasher": "killers/the-slasher.webp","k-the-judgment": "killers/the-judgment.webp","k-dracula": "killers/dracula.webp","k-the-ghoul": "killers/the-ghoul.webp","k-the-houndmaster": "killers/the-houndmaster.webp","k-the-animatronic": "killers/the-animatronic.webp","k-the-xenomorph": "killers/the-xenomorph.webp","k-the-lich-vecna": "killers/the-lich-vecna.webp","k-the-good-guy": "killers/the-good-guy.webp","k-the-hag": "killers/the-hag.webp","k-the-cannibal": "killers/the-cannibal.webp","k-the-nightmare": "killers/the-nightmare.webp","k-the-blight": "killers/the-blight.webp","k-the-clown": "killers/the-clown.webp","k-the-deathslinger": "killers/the-deathslinger.webp","k-the-doctor": "killers/the-doctor.webp","k-the-ghost-face": "killers/the-ghost-face.webp","k-the-hillbilly": "killers/the-hillbilly.webp","k-the-huntress": "killers/the-huntress.webp","k-the-legion": "killers/the-legion.webp","k-the-nemesis": "killers/the-nemesis.webp","k-the-nurse": "killers/the-nurse.webp","k-the-oni": "killers/the-oni.webp","k-the-pig": "killers/the-pig.webp","k-the-plague": "killers/the-plague.webp","k-the-executioner": "killers/the-executioner.webp","k-the-spirit": "killers/the-spirit.webp","k-the-artist": "killers/the-artist.webp","k-the-twins": "killers/the-twins.webp","k-the-trapper": "killers/the-trapper.webp","k-the-trickster": "killers/the-trickster.webp","k-the-wraith": "killers/the-wraith.webp","k-the-shape": "killers/the-shape.webp","k-the-cenobite": "killers/the-cenobite.webp"};
let sortMode="new";try{const s=localStorage.getItem("dbd-sort");if(s=="new"||s=="old"||s=="az")sortMode=s;}catch(e){}
const state={q:"",builds:{},localBuilds:{},imgs:{},perkIcons:{},custom:[],localCustom:[],open:null,editing:null,mode:"loading",session:null,nick:"",filterMine:false};
let sb=null;
function myId(){return state.session&&state.session.user?state.session.user.id:null;}
const $=id=>document.getElementById(id);
const norm=s=>(s||"").normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase();
const sortKey=n=>n.replace(/^The\s+/i,"");
const uidGen=()=>Date.now().toString(36)+Math.random().toString(36).slice(2,7);
const PERK_ROWS=[
["","Bitter Murmur","Murmullo Amargo"],["","Deerstalker","Acechador de Ciervos"],["","Distressing","Angustiante"],
["","Hex: No One Escapes Death","Maleficio: Nadie Escapa de la Muerte"],["","Hex: Thrill of the Hunt","Maleficio: Emoción de la Caza"],
["","Insidious","Insidioso"],["","Iron Grasp","Agarre de Hierro"],["","Monstrous Shrine","Santuario Monstruoso"],
["","Sloppy Butcher","Carnicero Chapucero"],["","Spies from the Shadows","Espías de las Sombras"],["","Unrelenting","Implacable"],["","Whispers","Susurros"],
["The Trapper","Unnerving Presence","Presencia Inquietante"],["The Trapper","Brutal Strength","Fuerza Bruta"],["The Trapper","Agitation","Agitación"],
["The Wraith","Predator","Depredador"],["The Wraith","Bloodhound","Sabueso de Sangre"],["The Wraith","Shadowborn","Nacido de las Sombras"],
["The Hillbilly","Enduring","Resistencia"],["The Hillbilly","Lightborn","Nacido de la Luz"],["The Hillbilly","Tinkerer","Manitas"],
["The Nurse","Stridor","Estridor"],["The Nurse","Thanatophobia","Tanatofobia"],["The Nurse","A Nurse's Calling","Vocación de Enfermera"],
["The Shape","Save the Best for Last","Lo Mejor para el Final"],["The Shape","Play with Your Food","Juega con tu Comida"],["The Shape","Dying Light","Luz Moribunda"],
["The Hag","Hex: The Third Seal","Maleficio: El Tercer Sello"],["The Hag","Hex: Ruin","Maleficio: Ruina"],["The Hag","Hex: Devour Hope","Maleficio: Devorar la Esperanza"],
["The Doctor","Overwhelming Presence","Presencia Abrumadora"],["The Doctor","Monitor & Abuse","Vigilar y Maltratar"],["The Doctor","Overcharge","Sobrecarga"],
["The Huntress","Beast of Prey","Bestia Depredadora"],["The Huntress","Hex: Huntress Lullaby","Maleficio: Nana de la Cazadora"],["The Huntress","Territorial Imperative","Imperativo Territorial"],
["The Cannibal","Knock Out","Noqueo"],["The Cannibal","Barbecue & Chilli","Barbacoa y Chile"],["The Cannibal","Franklin's Demise","La Perdición de Franklin"],
["The Nightmare","Fire Up","Encendido"],["The Nightmare","Remember Me","Recuérdame"],["The Nightmare","Blood Warden","Guardián de Sangre"],
["The Pig","Hangman's Trick","El Truco del Verdugo"],["The Pig","Surveillance","Vigilancia"],["The Pig","Make Your Choice","Toma una Decisión"],
["The Clown","Bamboozle","Embaucar"],["The Clown","Coulrophobia","Coulrofobia"],["The Clown","Pop Goes the Weasel","Pop Va la Comadreja"],
["The Spirit","Spirit Fury","Furia del Espíritu"],["The Spirit","Hex: Haunted Ground","Maleficio: Tierra Encantada"],["The Spirit","Rancor","Rencor"],
["The Legion","Discordance","Discordancia"],["The Legion","Iron Maiden","Doncella de Hierro"],["The Legion","Mad Grit","Coraje Demente"],
["The Plague","Corrupt Intervention","Intervención Corrupta"],["The Plague","Infectious Fright","Miedo Contagioso"],["The Plague","Dark Devotion","Devoción Oscura"],
["The Ghost Face","I'm All Ears","Soy Todo Oídos"],["The Ghost Face","Thrilling Tremors","Temblores Emocionantes"],["The Ghost Face","Furtive Chase","Persecución Furtiva"],
["The Demogorgon","Cruel Limits","Límites Crueles"],["The Demogorgon","Mindbreaker","Rompementes"],["The Demogorgon","Surge","Sobretensión"],
["The Oni","Zanshin Tactics","Tácticas Zanshin"],["The Oni","Blood Echo","Eco de Sangre"],["The Oni","Nemesis","Némesis"],
["The Deathslinger","Dead Man's Switch","Interruptor del Hombre Muerto"],["The Deathslinger","Gearhead","Fanático de la Mecánica"],["The Deathslinger","Hex: Retribution","Maleficio: Retribución"],
["The Executioner","Forced Penance","Penitencia Forzada"],["The Executioner","Trail of Torment","Rastro de Tormento"],["The Executioner","Deathbound","Atado a la Muerte"],
["The Blight","Dragon's Grip","Garra del Dragón"],["The Blight","Hex: Blood Favour","Maleficio: Favor de Sangre"],["The Blight","Hex: Undying","Maleficio: Inmortal"],
["The Twins","Hoarder","Acaparador"],["The Twins","Oppression","Opresión"],["The Twins","Coup de Grâce","Golpe de Gracia"],
["The Trickster","Starstruck","Deslumbrado"],["The Trickster","Hex: Crowd Control","Maleficio: Control de Masas"],["The Trickster","No Way Out","Sin Salida"],
["The Nemesis","Lethal Pursuer","Perseguidor Letal"],["The Nemesis","Hysteria","Histeria"],["The Nemesis","Eruption","Erupción"],
["The Cenobite","Deadlock","Punto Muerto"],["The Cenobite","Hex: Plaything","Maleficio: Juguete"],["The Cenobite","Scourge Hook: Gift of Pain","Gancho de Flagelo: Regalo de Dolor"],
["The Artist","Grim Embrace","Abrazo Sombrío"],["The Artist","Hex: Pentimento","Maleficio: Pentimento"],["The Artist","Scourge Hook: Pain Resonance","Gancho de Flagelo: Resonancia de Dolor"],
["The Onryō","Call of Brine","Llamada de la Salmuera"],["The Onryō","Merciless Storm","Tormenta Despiadada"],["The Onryō","Scourge Hook: Floods of Rage","Gancho de Flagelo: Inundación de Ira"],
["The Dredge","Dissolution","Disolución"],["The Dredge","Darkness Revealed","Oscuridad Revelada"],["The Dredge","Septic Touch","Toque Séptico"],
["The Mastermind","Awakened Awareness","Conciencia Despierta"],["The Mastermind","Superior Anatomy","Anatomía Superior"],["The Mastermind","Terminus","Terminus"],
["The Knight","Nowhere to Hide","Ningún Sitio Donde Esconderse"],["The Knight","Hex: Face the Darkness","Maleficio: Enfréntate a la Oscuridad"],["The Knight","Hubris","Arrogancia"],
["The Skull Merchant","Leverage","Ventaja"],["The Skull Merchant","Game Afoot","Comienza el Juego"],["The Skull Merchant","THWACK!","¡ZAS!"],
["The Singularity","Genetic Limits","Límites Genéticos"],["The Singularity","Forced Hesitation","Vacilación Forzada"],["The Singularity","Machine Learning","Aprendizaje Automático"],
["The Xenomorph","Ultimate Weapon","Arma Definitiva"],["The Xenomorph","Rapid Brutality","Brutalidad Rápida"],["The Xenomorph","Alien Instinct","Instinto Alienígena"],
["The Good Guy","Hex: Two Can Play","Maleficio: Esto Es Cosa de Dos"],["The Good Guy","Batteries Included","Pilas Incluidas"],["The Good Guy","Friends 'til the End","Amigos Hasta el Final"],
["The Unknown","Unbound","Desatado"],["The Unknown","Undone","Deshecho"],["The Unknown","Unforeseen","Imprevisto"],
["The Lich - Vecna","Languid Touch","Toque Lánguido"],["The Lich - Vecna","Weave Attunement","Sintonía del Tejido"],["The Lich - Vecna","Dark Arrogance","Arrogancia Oscura"],
["Dracula","Hex: Wretched Fate","Maleficio: Destino Miserable"],["Dracula","Dominance","Dominio"],["Dracula","Human Greed","Codicia Humana"],
["The Houndmaster","All-Shaking Thunder","Trueno Estremecedor"],["The Houndmaster","Scourge Hook: Jagged Compass","Gancho de Flagelo: Brújula Dentada"],["The Houndmaster","No Quarter","Sin Cuartel"],
["The Ghoul","Forever Entwined","Entrelazados para Siempre"],["The Ghoul","None Are Free","Nadie Es Libre"],["The Ghoul","Hex: Nothing but Misery","Maleficio: Nada más que Miseria"],
["The Animatronic","Help Wanted","Ahora Contratando"],["The Animatronic","Phantom Fear","Miedo Fantasma"],["The Animatronic","Haywire","Descontrol"],
["The Krasue","Wandering Eye","Wandering Eye"],["The Krasue","Hex: Overture of Doom","Hex: Overture of Doom"],["The Krasue","Ravenous","Ravenous"],
["The First","Hex: Hive Mind","Hex: Hive Mind"],["The First","Secret Project","Secret Project"],["The First","Turn Back the Clock","Turn Back the Clock"],
["The Slasher","Rampage","Rampage"],["The Slasher","Scared to Death","Scared to Death"],["The Slasher","Silent Shadow","Silent Shadow"],
["The Judgment","Lay Waste","Lay Waste"],["The Judgment","Celestial Witness","Celestial Witness"],["The Judgment","Hex: Under Your Thumb","Hex: Under Your Thumb"]
];
const DEFAULT_PERK_ICONS={"Dead Man's Switch": "perks/dead-man-s-switch.webp","Hex: Huntress Lullaby": "perks/hex-huntress-lullaby.webp","Genetic Limits": "perks/genetic-limits.webp","Barbecue & Chilli": "perks/barbecue-chilli.webp","Hex: Hive Mind": "perks/hex-hive-mind.webp","Machine Learning": "perks/machine-learning.webp","Hubris": "perks/hubris.webp","Secret Project": "perks/secret-project.webp","Forced Hesitation": "perks/forced-hesitation.webp","Dissolution": "perks/dissolution.webp","Septic Touch": "perks/septic-touch.webp","Alien Instinct": "perks/alien-instinct.webp","Ultimate Weapon": "perks/ultimate-weapon.webp","Rapid Brutality": "perks/rapid-brutality.webp","Wandering Eye": "perks/wandering-eye.webp","Haywire": "perks/haywire.webp","Rampage": "perks/rampage.webp","Dominance": "perks/dominance.webp","Lay Waste": "perks/lay-waste.webp","Turn Back the Clock": "perks/turn-back-the-clock.webp","Scourge Hook: Pain Resonance": "perks/scourge-hook-pain-resonance.webp","Darkness Revealed": "perks/darkness-revealed.webp","Hex: Face the Darkness": "perks/hex-face-the-darkness.webp","Help Wanted": "perks/help-wanted.webp","Phantom Fear": "perks/phantom-fear.webp","Game Afoot": "perks/game-afoot.webp","Terminus": "perks/terminus.webp","Hex: Two Can Play": "perks/hex-two-can-play.webp","Unbound": "perks/unbound.webp","Undone": "perks/undone.webp","Unforeseen": "perks/unforeseen.webp","Batteries Included": "perks/batteries-included.webp","Friends 'til the End": "perks/friends-til-the-end.webp","Nowhere to Hide": "perks/nowhere-to-hide.webp","Leverage": "perks/leverage.webp","THWACK!": "perks/thwack.webp","No Quarter": "perks/no-quarter.webp","Hex: Overture of Doom": "perks/hex-overture-of-doom.webp","Ravenous": "perks/ravenous.webp","Hex: Wretched Fate": "perks/hex-wretched-fate.webp","Celestial Witness": "perks/celestial-witness.webp","Hex: Under Your Thumb": "perks/hex-under-your-thumb.webp","Scared to Death": "perks/scared-to-death.webp","Silent Shadow": "perks/silent-shadow.webp","Languid Touch": "perks/languid-touch.webp","Dark Arrogance": "perks/dark-arrogance.webp","Superior Anatomy": "perks/superior-anatomy.webp","Weave Attunement": "perks/weave-attunement.webp","All-Shaking Thunder": "perks/all-shaking-thunder.webp","Awakened Awareness": "perks/awakened-awareness.webp","None Are Free": "perks/none-are-free.webp","Forever Entwined": "perks/forever-entwined.webp","Scourge Hook: Jagged Compass": "perks/scourge-hook-jagged-compass.webp","Hex: Nothing but Misery": "perks/hex-nothing-but-misery.webp","Cruel Limits": "perks/cruel-limits.webp","Mindbreaker": "perks/mindbreaker.webp","Surge": "perks/surge.webp","Hex: Blood Favour": "perks/hex-blood-favour.webp","Pop Goes the Weasel": "perks/pop-goes-the-weasel.webp","Monitor & Abuse": "perks/monitor-abuse.webp","Overcharge": "perks/overcharge.webp","Deathbound": "perks/deathbound.webp","Furtive Chase": "perks/furtive-chase.webp","Beast of Prey": "perks/beast-of-prey.webp","Eruption": "perks/eruption.webp","Hysteria": "perks/hysteria.webp","Lethal Pursuer": "perks/lethal-pursuer.webp","Blood Warden": "perks/blood-warden.webp","Fire Up": "perks/fire-up.webp","A Nurse's Calling": "perks/a-nurse-s-calling.webp","Surveillance": "perks/surveillance.webp","Infectious Fright": "perks/infectious-fright.webp","Hex: Haunted Ground": "perks/hex-haunted-ground.webp","Grim Embrace": "perks/grim-embrace.webp","Hex: Pentimento": "perks/hex-pentimento.webp","Agitation": "perks/agitation.webp","Brutal Strength": "perks/brutal-strength.webp","Oppression": "perks/oppression.webp","Dragon's Grip": "perks/dragon-s-grip.webp","Hex: Undying": "perks/hex-undying.webp","Call of Brine": "perks/call-of-brine.webp","Bamboozle": "perks/bamboozle.webp","Coulrophobia": "perks/coulrophobia.webp","Gearhead": "perks/gearhead.webp","Hex: Retribution": "perks/hex-retribution.webp","Overwhelming Presence": "perks/overwhelming-presence.webp","Forced Penance": "perks/forced-penance.webp","Trail of Torment": "perks/trail-of-torment.webp","I'm All Ears": "perks/i-m-all-ears.webp","Thrilling Tremors": "perks/thrilling-tremors.webp","Hex: Ruin": "perks/hex-ruin.webp","Hex: The Third Seal": "perks/hex-the-third-seal.webp","Hex: Devour Hope": "perks/hex-devour-hope.webp","Enduring": "perks/enduring.webp","Lightborn": "perks/lightborn.webp","Tinkerer": "perks/tinkerer.webp","Territorial Imperative": "perks/territorial-imperative.webp","Franklin's Demise": "perks/franklin-s-demise.webp","Knock Out": "perks/knock-out.webp","Discordance": "perks/discordance.webp","Iron Maiden": "perks/iron-maiden.webp","Mad Grit": "perks/mad-grit.webp","Merciless Storm": "perks/merciless-storm.webp","Remember Me": "perks/remember-me.webp","Stridor": "perks/stridor.webp","Thanatophobia": "perks/thanatophobia.webp","Blood Echo": "perks/blood-echo.webp","Nemesis": "perks/nemesis.webp","Zanshin Tactics": "perks/zanshin-tactics.webp","Hangman's Trick": "perks/hangman-s-trick.webp","Make Your Choice": "perks/make-your-choice.webp","Corrupt Intervention": "perks/corrupt-intervention.webp","Dark Devotion": "perks/dark-devotion.webp","Scourge Hook: Floods of Rage": "perks/scourge-hook-floods-of-rage.webp","Rancor": "perks/rancor.webp","Spirit Fury": "perks/spirit-fury.webp","Unnerving Presence": "perks/unnerving-presence.webp","Hex: Crowd Control": "perks/hex-crowd-control.webp","No Way Out": "perks/no-way-out.webp","Starstruck": "perks/starstruck.webp","Coup de Grâce": "perks/coup-de-grace.webp","Hoarder": "perks/hoarder.webp","Bloodhound": "perks/bloodhound.webp","Predator": "perks/predator.webp","Shadowborn": "perks/shadowborn.webp","Insidious": "perks/insidious.webp","Monstrous Shrine": "perks/monstrous-shrine.webp","Sloppy Butcher": "perks/sloppy-butcher.webp","Spies from the Shadows": "perks/spies-from-the-shadows.webp","Whispers": "perks/whispers.webp","Human Greed": "perks/human-greed.webp","Dying Light": "perks/dying-light.webp","Iron Grasp": "perks/iron-grasp.webp","Unrelenting": "perks/unrelenting.webp","Distressing": "perks/distressing.webp","Save the Best for Last": "perks/save-the-best-for-last.webp","Play with Your Food": "perks/play-with-your-food.webp","Deadlock": "perks/deadlock.webp","Hex: Plaything": "perks/hex-plaything.webp","Scourge Hook: Gift of Pain": "perks/scourge-hook-gift-of-pain.webp","Bitter Murmur": "perks/bitter-murmur.webp","Hex: No One Escapes Death": "perks/hex-no-one-escapes-death.webp","Hex: Thrill of the Hunt": "perks/hex-thrill-of-the-hunt.webp","Deerstalker": "perks/deerstalker.webp"};
const PERKS=PERK_ROWS.map(([owner,en,es])=>({owner,en,es,ne:norm(en),ns:norm(es),type:/^hex:/i.test(en)?"hex":/^scourge hook:/i.test(en)?"scourge":""}));
const PERK_BY=new Map();PERKS.forEach(p=>{PERK_BY.set(p.ne,p);PERK_BY.set(p.ns,p);});
let lang="es";try{const l=localStorage.getItem("dbd-lang");if(l==="es"||l==="en")lang=l;}catch(e){}
function findPerk(s){return s?PERK_BY.get(norm(String(s).trim()))||null:null;}
function perkLabel(s){const p=findPerk(s);return p?(lang==="es"?p.es:p.en):(s||"");}
function perkOther(s){const p=findPerk(s);if(!p||p.en===p.es)return "";return lang==="es"?p.en:p.es;}
function perkKey(s){const p=findPerk(s);return p?p.en:(s||"").trim();}
function perkType(s){const p=findPerk(s);if(p)return p.type;return /^(hex|maleficio):/i.test(s||"")?"hex":/^(scourge hook|gancho de flagelo):/i.test(s||"")?"scourge":"";}
function perkIconSrc(s){const k=perkKey(s),v=state.perkIcons[k];if(!v)return DEFAULT_PERK_ICONS[k]||null;return v.length===32&&!/[:\/]/.test(v)?"/_blob/"+v:v;}
function customPerks(){
  const set=new Map();
  Object.values(state.builds).forEach(a=>a.forEach(b=>(b.perks||[]).forEach(p=>{if(p&&!findPerk(p))set.set(norm(p),p);})));
  return [...set.values()];
}
function perkIcon(s,cls){
  const w=el("span","pic"+(cls?" "+cls:""));const t=perkType(s);if(t)w.classList.add(t);
  const src=s?perkIconSrc(s):null;
  if(src){const im=document.createElement("img");im.alt="";im.src=src;w.appendChild(im);w.classList.add("has-img");}
  else{const d=el("span","d");d.appendChild(el("span",null,s?initials(perkLabel(s)):""));w.appendChild(d);}
  return w;
}

const LS="dbd-builds-v1";
let col=null,assets=null;
const queues={};
function lsLoad(){try{const r=localStorage.getItem(LS);if(r){const d=JSON.parse(r);state.builds=d.builds||{};state.custom=(d.custom||[]).filter(c=>!c.role||c.role==="killer");state.imgs=d.imgs||{};state.perkIcons=d.perkIcons||{};}}catch(e){}}
function lsSave(){try{localStorage.setItem(LS,JSON.stringify({builds:sb?state.localBuilds:state.builds,custom:sb?state.localCustom:state.custom,imgs:state.imgs,perkIcons:state.perkIcons}));}catch(e){toast("No hay espacio suficiente en este navegador.");}}
function enqueue(docId,fn){
  const prev=queues[docId]||Promise.resolve();
  queues[docId]=prev.then(fn).catch(err=>{
    const c=err&&err.code;
    toast(c==="quota_exceeded"?"Has llenado el espacio disponible. Borra algo y vuelve a probar.":"No se pudo guardar el cambio. Inténtalo de nuevo.");
  });
}
function saveChar(cid){
  if(!col){lsSave();return;}
  const list=state.builds[cid]||[];const img=state.imgs[cid];
  const ref=col.doc("c_"+cid);
  const body={builds:list};
  if(img&&img.id)body.imgId=img.id;
  if(img&&img.data)body.imgData=img.data;
  enqueue("c_"+cid,()=>(list.length||img)?ref.set(body):ref.delete());
}
function saveRoster(){
  if(!col){lsSave();return;}
  const ref=col.doc("roster");
  enqueue("roster",()=>ref.set({custom:state.custom}));
}
async function initClaude(){
  try{
    if(window.claude&&typeof window.claude.use==="function"){
      const [db,user,as]=await Promise.all([window.claude.use("db"),window.claude.use("user"),window.claude.use("assets")]);
      assets=as||null;
      const id=user?await user.id():null;
      if(db&&id){
        col=db.collection("data/users/"+id);
        col.onSnapshot(snap=>{
          const builds={},imgs={};let custom=[],perkIcons={};
          snap.docs.forEach(d=>{
            const data=d.data()||{};
            if(d.id==="perkicons")perkIcons=(data.map&&typeof data.map==="object")?data.map:{};
            else if(d.id==="roster")custom=(Array.isArray(data.custom)?data.custom:[]).filter(c=>!c.role||c.role==="killer");
            else if(d.id.indexOf("c_")===0){
              const cid=d.id.slice(2);
              builds[cid]=Array.isArray(data.builds)?data.builds:[];
              if(data.imgId)imgs[cid]={id:data.imgId};
              else if(data.imgData)imgs[cid]={data:data.imgData};
            }
          });
          state.builds=builds;state.imgs=imgs;state.perkIcons=perkIcons;state.custom=custom;state.mode="cloud";
          render();renderPanel();
        },()=>{col=null;state.mode="local";lsLoad();render();renderPanel();});
        return;
      }
    }
  }catch(e){}
  state.mode="local";lsLoad();render();
}

function allChars(){if(sb){const ids=new Set(state.custom.map(c=>c.id));return [...BASE,...state.custom,...(state.localCustom||[]).filter(c=>!ids.has(c.id)).map(c=>({...c,role:"killer",custom:true,localOnly:true}))];}return [...BASE,...state.custom];}
function charById(id){return allChars().find(c=>c.id===id);}
function buildsOf(id){return state.builds[id]||[];}
function imgSrc(id){const i=state.imgs[id];if(i)return i.id?"/_blob/"+i.id:(i.data||DEFAULT_IMGS[id]||null);const k=sb&&state.custom.find(c=>c.id===id&&c.img);if(k)return k.img;return DEFAULT_IMGS[id]||null;}
function matches(c,q){
  if(!q)return true;
  if(norm(c.name).includes(q))return true;
  return buildsOf(c.id).some(b=>norm(b.name).includes(q)||(b.perks||[]).some(p=>{const f=findPerk(p);return norm(p).includes(q)||(f&&(f.ne.includes(q)||f.ns.includes(q)));}));
}
function initials(p){
  let s=(p||"").trim();
  if(s.includes(":"))s=s.split(":").pop().trim();
  const w=s.replace(/[&!'¡]/g," ").split(/[\s\-]+/).filter(x=>x&&!/^(of|the|a|an|de|la|el|y|and)$/i.test(x));
  return (w.slice(0,2).map(x=>x[0]).join("")||"?").toUpperCase();
}
function el(tag,cls,text){const e=document.createElement(tag);if(cls)e.className=cls;if(text!=null)e.textContent=text;return e;}
const SVGNS="http://www.w3.org/2000/svg";
let toastT;
function toast(msg,ms){const t=$("toast");t.textContent=msg;t.hidden=false;clearTimeout(toastT);toastT=setTimeout(()=>t.hidden=true,ms||2800);}

let prevIds=null,animateNext=false,lastOnly=null;
function render(){
  const q=norm(state.q.trim());
  const animate=animateNext;animateNext=false;
  const prev=prevIds?new Set(prevIds):null;let entered=0;
  const list=allChars().filter(c=>matches(c,q)).sort((a,b)=>sortMode==="az"?sortKey(a.name).localeCompare(sortKey(b.name),"es"):sortMode==="new"?relOf(b)-relOf(a):relOf(a)-relOf(b));
  const g=$("grid");g.textContent="";
  list.forEach(c=>{
    const n=buildsOf(c.id).length,src=imgSrc(c.id);
    const b=el("button","tile"+(n?" has":"")+(src?" img":""));b.type="button";b.dataset.id=c.id;
    if(src){const bg=el("span","bgimg");bg.style.backgroundImage='url("'+src.replace(/"/g,"%22")+'")';b.appendChild(bg);}
    if(sortMode!=="az")b.appendChild(el("span","rel","Nº "+relOf(c)));
    const nm=el("span","tname");
    if(q&&norm(c.name).includes(q)){nm.appendChild(highlight(c.name,q));b.classList.add("found");}else nm.textContent=c.name;
    b.appendChild(nm);
    if(animate&&prev&&!prev.has(c.id)){b.classList.add("enter");b.style.animationDelay=Math.min(entered,12)*22+"ms";entered++;}
    b.appendChild(el("span","tcount",n?(n===1?"1 build":n+" builds"):"Sin builds"));
    g.appendChild(b);
  });
  const only=q&&list.length===1?list[0].id:null;
  if(only&&only!==lastOnly){const t=g.querySelector(".tile");if(t){t.style.animationDelay="";t.classList.add("only");}}
  lastOnly=only;prevIds=list.map(c=>c.id);
  if(!q){
    const a=el("button","tile add");a.type="button";a.id="addTile";
    a.appendChild(el("span","tname","+ Añadir asesino"));
    a.appendChild(el("span","tcount","Para los que salgan nuevos"));
    g.appendChild(a);
  }else if(!list.length){
    g.appendChild(el("p","empty","Nada coincide con esa búsqueda. Prueba con otro nombre o perk."));
  }
  const total=Object.values(state.builds).reduce((n,a)=>n+a.length,0);
  $("sub").textContent=total?(total===1?"1 build guardada. ":total+" builds guardadas. ")+"Elige un asesino para verlas.":"Elige un asesino para ver o guardar sus builds.";
  const tip=" Para poner imágenes, arrastra una sobre un asesino o usa Importar imágenes con archivos nombrados como el asesino (por ejemplo, trapper.png o the-nurse.jpg).";
  $("foot").textContent=sb?"Las builds son de la comunidad: cualquiera puede verlas. Para publicar las tuyas, entra con tu email."+tip:state.mode==="cloud"?"Tus builds se guardan en tu cuenta y solo las ves tú."+tip:state.mode==="local"?"Tus builds se guardan en este navegador."+tip:"Cargando tus builds…";
  $("bulkBtn").hidden=!canUpload();
  refreshPerkList();
}
function refreshPerkList(){}

let lastFocus=null,lastHeroSrc=null;
let closeT=null;
function finishClose(){
  clearTimeout(closeT);closeT=null;
  $("scrim").hidden=true;$("panel").hidden=true;
  $("scrim").classList.remove("closing");$("panel").classList.remove("closing");
}
function openPanel(id){
  if(closeT){finishClose();void $("panel").offsetWidth;}
  state.open=id;state.editing=null;lastFocus=document.activeElement;lastHeroSrc=undefined;
  $("bform").hidden=true;$("newBuild").hidden=false;
  $("scrim").hidden=false;$("panel").hidden=false;
  $("panel").querySelector(".pscroll").scrollTop=0;
  renderPanel();$("pClose").focus();
}
function closePanel(){
  if(!state.open&&$("panel").hidden)return;
  state.open=null;state.editing=null;closeCombo();
  if(matchMedia("(prefers-reduced-motion: reduce)").matches)finishClose();
  else{$("scrim").classList.add("closing");$("panel").classList.add("closing");clearTimeout(closeT);closeT=setTimeout(finishClose,220);}
  if(lastFocus&&lastFocus.focus)lastFocus.focus();
}
function canUpload(){return state.mode!=="loading"&&(state.mode==="local"||!!col||!!sb);}
function renderHero(c){
  const hero=$("hero"),src=imgSrc(c.id);
  if(src!==lastHeroSrc){
    const old=hero.querySelector("img");if(old)old.remove();
    if(src){const im=document.createElement("img");im.alt="";im.src=src;hero.insertBefore(im,hero.firstChild);}
    lastHeroSrc=src;
  }
  hero.classList.toggle("noimg",!src);
  $("imgActions").hidden=!canUpload()||!ownsKiller(c);
  $("imgPick").textContent=src?"Cambiar imagen":"Subir imagen";
  $("imgRemove").hidden=!(state.imgs[c.id]||(sb&&c.shared&&ownsKiller(c)&&c.imgPath));
  $("imgRemove").textContent=DEFAULT_IMGS[c.id]?"Volver a la original":"Quitar imagen";
}
function renderPanel(){
  if(!state.open)return;
  const c=charById(state.open);if(!c){closePanel();return;}
  $("pTitle").textContent=c.name;
  renderHero(c);
  $("removeChar").hidden=!c.custom||!ownsKiller(c);
  const q=norm(state.q.trim());
  const box=$("blist");box.textContent="";
  const all=buildsOf(c.id),uid=myId();
  const list=sb&&state.filterMine&&uid?all.filter(b=>b.userId===uid):all;
  $("randBuild").hidden=!all.length;$("mineWrap").hidden=!(sb&&uid&&all.length);
  if(!all.length){box.appendChild(el("p","noBuilds","Todavía no hay builds para "+c.name+". Crea la primera con Nueva build."));return;}
  if(!list.length){box.appendChild(el("p","noBuilds","Aún no has publicado builds para "+c.name+"."));return;}
  list.forEach(b=>{
    const art=el("article","build");art.dataset.bid=b.id;
    const lo=el("div","loadout");const dm=el("div","diamond");
    const perks=(b.perks||[]).slice(0,4);while(perks.length<4)perks.push("");
    perks.forEach(p=>{const t=p?perkType(p):"";const s=el("div","slot "+(p?"filled":"vacant")+(t?" "+t:""));s.title=p?perkLabel(p):"Vacío";const src=p?perkIconSrc(p):null;if(src){const im=document.createElement("img");im.alt="";im.src=src;s.appendChild(im);s.classList.add("has-img");}else s.appendChild(el("span",null,p?initials(perkLabel(p)):""));dm.appendChild(s);});
    lo.appendChild(dm);lo.setAttribute("aria-hidden","true");
    const body=el("div");
    body.appendChild(el("h3",null,b.name));
    const own=!sb||(uid&&b.userId===uid);
    if(sb&&b.author)body.appendChild(el("p","bauthor",b.author+(own?" (tú)":"")));
    const ol=el("ol","perks");
    const filled=perks.filter(Boolean);
    if(!filled.length)ol.appendChild(el("li","none","Sin perks"));
    filled.forEach(p=>{const hit=q&&(norm(p).includes(q)||norm(perkLabel(p)).includes(q)||norm(perkOther(p)).includes(q));const li=el("li",hit?"hit":null);li.appendChild(perkIcon(p,"mini"));li.appendChild(el("span",null,perkLabel(p)));const f=findPerk(p);if(f)li.appendChild(el("span","pown",f.owner||"General"));ol.appendChild(li);});
    body.appendChild(ol);
    if(b.notes)body.appendChild(el("p","notes",b.notes));
    const act=el("div","bact");
    const ed=el("button","btn small","Editar");ed.type="button";ed.dataset.act="edit";ed.dataset.bid=b.id;
    const del=el("button","btn small ghost","Borrar");del.type="button";del.dataset.act="del";del.dataset.bid=b.id;
    const cp=el("button","btn small","Copiar");cp.type="button";cp.dataset.act="copy";cp.dataset.bid=b.id;
    if(own)act.append(ed,cp,del);else act.append(cp);body.appendChild(act);
    art.append(lo,body);box.appendChild(art);
  });
}
function showForm(build){
  state.editing=build?build.id:"new";
  $("fName").value=build?build.name:"";
  for(let i=0;i<4;i++)setSlot(i,build&&build.perks?(build.perks[i]||""):"");closeCombo();
  $("fNotes").value=build?(build.notes||""):"";
  $("fSave").textContent=build?"Guardar cambios":"Guardar build";
  $("bform").hidden=false;$("newBuild").hidden=true;
  $("fName").focus();
}
function hideForm(){closeCombo();state.editing=null;$("bform").hidden=true;$("newBuild").hidden=false;}

function resizeImage(file,max,q){
  return new Promise((res,rej)=>{
    const url=URL.createObjectURL(file);const im=new Image();
    im.onload=()=>{
      const r=Math.min(1,max/Math.max(im.width,im.height));
      const cv=document.createElement("canvas");cv.width=Math.round(im.width*r);cv.height=Math.round(im.height*r);
      cv.getContext("2d").drawImage(im,0,0,cv.width,cv.height);URL.revokeObjectURL(url);
      cv.toBlob(b=>b?res({blob:b,canvas:cv}):rej(new Error("blob")),"image/jpeg",q);
    };
    im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("load"));};
    im.src=url;
  });
}
$("imgPick").onclick=()=>$("imgFile").click();
async function setImage(cid,file){
  if(!file||!/^image\/(png|jpeg|webp)$/.test(file.type))throw {code:"bad_type"};
  const ck=sb&&state.custom.find(c=>c.id===cid&&c.shared);
  if(ck){if(!ownsKiller(ck))throw {code:"not_owner"};await uploadKillerImage(ck,file);return;}
  const prev=state.imgs[cid];
  if(assets){
    const {blob}=await resizeImage(file,1200,.86);
    const r=await assets.upload(blob,{type:"image/jpeg"});
    state.imgs={...state.imgs,[cid]:{id:r.id}};
    if(prev&&prev.id)assets.delete(prev.id).catch(()=>{});
  }else{
    const {canvas}=await resizeImage(file,700,.8);
    state.imgs={...state.imgs,[cid]:{data:canvas.toDataURL("image/jpeg",.78)}};
  }
  saveChar(cid);
}
function imgErr(err){const c=err&&err.code;return c==="not_owner"?"Solo quien añadió este asesino puede cambiar su imagen.":c==="bad_type"?"Usa una imagen PNG, JPG o WebP.":c==="quota_exceeded"?"No queda espacio para más imágenes. Quita alguna y vuelve a probar.":"No se pudo subir la imagen. Prueba con otra.";}
$("imgFile").addEventListener("change",async e=>{
  const file=e.target.files&&e.target.files[0];e.target.value="";
  const cid=state.open;if(!file||!cid)return;
  $("imgPick").disabled=true;$("imgPick").textContent="Subiendo…";
  try{await setImage(cid,file);render();renderPanel();toast("Imagen guardada.");}
  catch(err){toast(imgErr(err));}
  finally{$("imgPick").disabled=false;if(state.open)renderHero(charById(state.open));}
});
function matchKiller(filename){
  const base=slug(filename.replace(/\.[^.]+$/,"")).replace(/^the-/,"");
  if(!base)return null;
  const cands=allChars().map(c=>({c,s:slug(c.name).replace(/^the-/,"")})).sort((a,b)=>b.s.length-a.s.length);
  const hit=cands.find(x=>x.s===base)||cands.find(x=>x.s.length>=3&&base.includes(x.s))||cands.find(x=>base.length>=3&&x.s.includes(base));
  return hit?hit.c:null;
}
$("bulkBtn").onclick=()=>$("bulkFile").click();
$("bulkFile").addEventListener("change",async e=>{
  const files=[...(e.target.files||[])];e.target.value="";if(!files.length)return;
  const btn=$("bulkBtn");btn.disabled=true;
  let ok=0;const miss=[];
  for(let i=0;i<files.length;i++){
    btn.textContent="Importando "+(i+1)+" de "+files.length+"…";
    const c=matchKiller(files[i].name);
    if(!c){miss.push(files[i].name);continue;}
    try{await setImage(c.id,files[i]);ok++;}catch(err){miss.push(files[i].name);}
  }
  btn.disabled=false;btn.textContent="Importar imágenes";render();renderPanel();
  toast((ok===1?"1 imagen asignada":ok+" imágenes asignadas")+(miss.length?". Sin asignar: "+miss.slice(0,4).join(", ")+(miss.length>4?"…":""):"."),6000);
});
let dragTile=null;
function clearDrag(){if(dragTile)dragTile.classList.remove("drop");dragTile=null;}
$("grid").addEventListener("dragover",e=>{
  if(!canUpload())return;
  const t=e.target.closest(".tile:not(.add)");if(!t)return;
  e.preventDefault();e.dataTransfer.dropEffect="copy";
  if(dragTile!==t){clearDrag();dragTile=t;t.classList.add("drop");}
});
$("grid").addEventListener("dragleave",e=>{const t=e.target.closest(".tile");if(t&&t===dragTile&&!t.contains(e.relatedTarget))clearDrag();});
$("grid").addEventListener("drop",async e=>{
  const t=e.target.closest(".tile:not(.add)");clearDrag();
  if(!t||!canUpload())return;
  e.preventDefault();
  const f=e.dataTransfer.files&&e.dataTransfer.files[0];if(!f)return;
  const cid=t.dataset.id;
  try{await setImage(cid,f);render();renderPanel();toast("Imagen guardada en "+charById(cid).name+".");}
  catch(err){toast(imgErr(err));}
});
document.addEventListener("dragover",e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes("Files"))e.preventDefault();});
document.addEventListener("drop",e=>{if(e.dataTransfer&&[...e.dataTransfer.types].includes("Files"))e.preventDefault();clearDrag();});
let imgArmed=false;
$("imgRemove").onclick=()=>{
  const cid=state.open;if(!cid)return;
  if(!imgArmed){imgArmed=true;$("imgRemove").textContent="Confirmar";setTimeout(()=>{imgArmed=false;if(state.open)renderHero(charById(state.open));},3000);return;}
  imgArmed=false;
  const ck=sb&&state.custom.find(c=>c.id===cid&&c.shared);
  if(!state.imgs[cid]&&ck&&ck.imgPath){const pth=ck.imgPath;sb.from("killers").update({img_path:null}).eq("id",cid).then(({error})=>{if(error){toast("No se pudo quitar la imagen.");return;}sb.storage.from("killers").remove([pth]);state.custom=state.custom.map(c=>c.id===cid?{...c,imgPath:null,img:null}:c);render();renderPanel();toast("Imagen quitada.");});return;}
  const prev=state.imgs[cid];const ni={...state.imgs};delete ni[cid];state.imgs=ni;
  if(prev&&prev.id&&assets)assets.delete(prev.id).catch(()=>{});
  saveChar(cid);render();renderPanel();toast("Imagen quitada.");
};

$("q").addEventListener("input",e=>{state.q=e.target.value;animateNext=true;render();});
function relOf(c){if(c.rel)return c.rel;const i=allChars().filter(x=>!x.rel).findIndex(x=>x.id===c.id);return BASE.length+1+(i<0?0:i);}
$("sortSel").value=sortMode;
$("sortSel").addEventListener("change",e=>{sortMode=e.target.value;try{localStorage.setItem("dbd-sort",sortMode);}catch(err){}render();});
$("grid").addEventListener("click",e=>{
  const t=e.target.closest(".tile");if(!t)return;
  if(t.id==="addTile"){if(sb&&!state.session){openAcc("Para añadir asesinos para todos necesitas hacer login.");return;}if(sb&&!state.nick){openAcc();return;}$("addForm").hidden=false;$("addName").focus();return;}
  openPanel(t.dataset.id);
});
$("addCancel").onclick=()=>{$("addForm").hidden=true;$("addName").value="";};
$("addForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("addName").value.trim();if(!name)return;
  if(allChars().some(c=>norm(c.name)===norm(name))){toast("Ese asesino ya está en la lista.");return;}
  if(sb){cloudAddKiller(name);return;}
  const c={id:"kc-"+(slug(name)||"x")+"-"+uidGen().slice(-4),name,role:"killer",custom:true};
  state.custom=[...state.custom,c];saveRoster();
  $("addName").value="";$("addForm").hidden=true;render();toast("Asesino añadido.");
});
$("scrim").onclick=closePanel;
$("pClose").onclick=closePanel;
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!$("acc").hidden){closeAcc();return;}if(!$("rand").hidden){closeRand();return;}if(state.open)closePanel();});
$("newBuild").onclick=()=>startNewBuild();
$("fCancel").onclick=hideForm;
$("bform").addEventListener("submit",e=>{
  e.preventDefault();
  const cid=state.open;if(!cid)return;
  const name=$("fName").value.trim();if(!name){$("fName").focus();return;}
  const perks=[0,1,2,3].map(i=>{const v=$("fP"+i).value.trim();const f=findPerk(v);return f?f.en:v;});
  const notes=$("fNotes").value.trim();
  if(sb){cloudSave(cid,{name,perks,notes});return;}
  const list=[...buildsOf(cid)];
  if(state.editing&&state.editing!=="new"){
    const i=list.findIndex(b=>b.id===state.editing);
    if(i>=0)list[i]={...list[i],name,perks,notes,updatedAt:Date.now()};
  }else list.unshift({id:uidGen(),name,perks,notes,createdAt:Date.now()});
  state.builds={...state.builds,[cid]:list};
  saveChar(cid);hideForm();render();renderPanel();toast("Build guardada.");
});
const armed={};
$("blist").addEventListener("click",e=>{
  const b=e.target.closest("button[data-act]");if(!b)return;
  const cid=state.open,bid=b.dataset.bid;
  if(b.dataset.act==="edit"){const bd=buildsOf(cid).find(x=>x.id===bid);if(bd)showForm(bd);return;}
  if(b.dataset.act==="copy"){const bd=buildsOf(cid).find(x=>x.id===bid);if(!bd)return;const t=buildText(bd);copiedBuild=t;try{localStorage.setItem("dbd-copied",t);}catch(e){}copyText(t).then(ok=>toast(ok?"Build copiada. Pégala con Pegar build en cualquier asesino.":"Build copiada en la app. Usa Pegar build en otro asesino."));return;}
  if(!armed[bid]){armed[bid]=true;b.textContent="Confirmar borrado";b.classList.add("warn");setTimeout(()=>{delete armed[bid];if(b.isConnected){b.textContent="Borrar";b.classList.remove("warn");}},3000);return;}
  delete armed[bid];
  if(sb){cloudDelete(cid,bid);return;}
  state.builds={...state.builds,[cid]:buildsOf(cid).filter(x=>x.id!==bid)};
  saveChar(cid);render();renderPanel();toast("Build borrada.");
});
let removeArmed=false;
$("removeChar").onclick=()=>{
  const c=charById(state.open);if(!c||!c.custom)return;
  if(!removeArmed){removeArmed=true;$("removeChar").textContent="Confirmar: quitar asesino y sus builds";setTimeout(()=>{removeArmed=false;$("removeChar").textContent="Quitar asesino";},3500);return;}
  removeArmed=false;$("removeChar").textContent="Quitar asesino";
  if(sb&&c.shared){cloudRemoveKiller(c);return;}
  if(sb&&c.localOnly){state.localCustom=state.localCustom.filter(x=>x.id!==c.id);const ni={...state.imgs};delete ni[c.id];state.imgs=ni;lsSave();closePanel();render();toast("Asesino quitado.");return;}
  const prev=state.imgs[c.id];if(prev&&prev.id&&assets)assets.delete(prev.id).catch(()=>{});
  state.custom=state.custom.filter(x=>x.id!==c.id);
  const nb={...state.builds};delete nb[c.id];state.builds=nb;
  const ni={...state.imgs};delete ni[c.id];state.imgs=ni;
  saveRoster();saveChar(c.id);closePanel();render();toast("Asesino quitado.");
};

const formPerks=["","","",""];
const sugg=el("ul","sugg");sugg.id="perkSugg";sugg.setAttribute("role","listbox");sugg.hidden=true;
let comboIdx=-1,comboItems=[],comboActive=-1,skipOpen=false;
function setSlot(i,val){
  formPerks[i]=val||"";
  const inp=$("fP"+i);inp.value=val?perkLabel(val):"";
  const ic=$("fI"+i);ic.replaceWith(Object.assign(perkIcon(val,"slotpic"),{id:"fI"+i}));
  $("fX"+i).hidden=!val;
}
function highlight(text,q){
  const f=document.createDocumentFragment();
  if(!q){f.append(text);return f;}
  const n=norm(text),k=n.indexOf(q);
  if(k<0){f.append(text);return f;}
  f.append(text.slice(0,k));const m=el("mark",null,text.slice(k,k+q.length));f.append(m,text.slice(k+q.length));return f;
}
function buildSuggestions(i){
  const raw=$("fP"+i).value.trim(),q=norm(raw);
  const killer=charById(state.open);const kname=killer?killer.name:"";
  const taken=new Set(formPerks.filter((v,j)=>v&&j!==i).map(v=>norm(perkKey(v))));
  let pool=PERKS.filter(p=>!taken.has(p.ne)).map(p=>({perk:p,key:p.en}));
  customPerks().forEach(c=>{if(!taken.has(norm(c)))pool.push({perk:null,key:c});});
  let out;
  if(!q){
    const own=pool.filter(x=>x.perk&&x.perk.owner===kname);
    const used=new Map();
    Object.values(state.builds).forEach(a=>a.forEach(b=>(b.perks||[]).forEach(p=>{if(p){const k=norm(perkKey(p));used.set(k,(used.get(k)||0)+1);}})));
    const fav=pool.filter(x=>!own.includes(x)&&used.has(norm(x.key))).sort((a,b)=>used.get(norm(b.key))-used.get(norm(a.key)));
    const rest=pool.filter(x=>!own.includes(x)&&!fav.includes(x)).sort((a,b)=>perkLabel(a.key).localeCompare(perkLabel(b.key),"es"));
    own.forEach(x=>x.grp="Perks de "+kname);fav.forEach(x=>x.grp="Las que más usas");rest.forEach(x=>x.grp="Todas las perks");
    out=[...own,...fav,...rest];
  }else{
    const score=x=>{
      const names=x.perk?[x.perk.ns,x.perk.ne]:[norm(x.key)];
      let best=9;
      names.forEach((n,ix)=>{
        const bare=n.replace(/^(maleficio|hex|gancho de flagelo|scourge hook): /,"");
        let s=9;
        if(n.startsWith(q)||bare.startsWith(q))s=0;else if((" "+n).includes(" "+q))s=1;else if(n.includes(q))s=2;
        if(s<9)s+=(lang==="es"?ix:1-ix)*0.1;
        best=Math.min(best,s);
      });
      if(best===9&&x.perk&&norm(x.perk.owner).includes(q))best=3;
      return best;
    };
    out=pool.map(x=>({...x,s:score(x)})).filter(x=>x.s<9).sort((a,b)=>a.s-b.s||perkLabel(a.key).localeCompare(perkLabel(b.key),"es"));
    if(!findPerk(raw)&&!out.some(x=>norm(x.key)===q))out.push({perk:null,key:raw,free:true});
  }
  return {items:out,q,kname};
}
function openCombo(i){
  comboIdx=i;const {items,q,kname}=buildSuggestions(i);comboItems=items;comboActive=items.length&&q?0:-1;
  sugg.textContent="";
  if(!items.length){closeCombo();return;}
  let lastGrp=null;
  items.forEach((x,k)=>{
    if(!q&&x.grp&&x.grp!==lastGrp){const hd=el("li","shead",x.grp);hd.setAttribute("role","presentation");sugg.appendChild(hd);lastGrp=x.grp;}
    const li=el("li","opt");li.setAttribute("role","option");li.id="opt-"+k;li.dataset.k=k;
    if(x.free){li.classList.add("free");li.appendChild(perkIcon(x.key));const t=el("span","otext");t.appendChild(el("span","oname","Usar «"+x.key+"»"));t.appendChild(el("span","osub","Perk que no está en la lista"));li.appendChild(t);}
    else{
      li.appendChild(perkIcon(x.key));
      const t=el("span","otext");
      const nm=el("span","oname");nm.appendChild(highlight(perkLabel(x.key),q));t.appendChild(nm);
      const sub=x.perk?[perkOther(x.key),x.perk.owner||"General"].filter(Boolean).join(" · "):"Perk tuya";
      const sb=el("span","osub");sb.appendChild(highlight(sub,q));t.appendChild(sb);
      li.appendChild(t);
    }
    sugg.appendChild(li);
  });
  const slot=$("fP"+i).closest(".pslot");slot.appendChild(sugg);sugg.hidden=false;
  $("fP"+i).setAttribute("aria-expanded","true");
  paintActive();
}
function paintActive(){
  [...sugg.querySelectorAll(".opt")].forEach((li,k)=>{const on=k===comboActive;li.classList.toggle("active",on);li.setAttribute("aria-selected",on);if(on)li.scrollIntoView({block:"nearest"});});
  if(comboIdx>=0)$("fP"+comboIdx).setAttribute("aria-activedescendant",comboActive>=0?"opt-"+comboActive:"");
}
function closeCombo(){
  if(comboIdx>=0){$("fP"+comboIdx).setAttribute("aria-expanded","false");$("fP"+comboIdx).removeAttribute("aria-activedescendant");}
  sugg.hidden=true;comboIdx=-1;comboItems=[];comboActive=-1;
}
function pickCombo(k){
  const i=comboIdx,x=comboItems[k];if(i<0||!x)return;
  setSlot(i,x.perk?x.perk.en:x.key);closeCombo();
  const next=[0,1,2,3].find(j=>j>i&&!formPerks[j]);
  skipOpen=true;if(next!==undefined)$("fP"+next).focus();else $("fNotes").focus();skipOpen=false;
}
sugg.addEventListener("mousedown",e=>{const li=e.target.closest(".opt");if(!li)return;e.preventDefault();pickCombo(+li.dataset.k);});
[0,1,2,3].forEach(i=>{
  const inp=$("fP"+i);
  inp.addEventListener("focus",()=>{if(!skipOpen)openCombo(i);});
  inp.addEventListener("click",()=>{if(sugg.hidden||comboIdx!==i)openCombo(i);});
  inp.addEventListener("input",()=>{formPerks[i]=inp.value.trim();$("fX"+i).hidden=!inp.value;const ic=$("fI"+i);ic.replaceWith(Object.assign(perkIcon(findPerk(inp.value)?inp.value:"","slotpic"),{id:"fI"+i}));openCombo(i);});
  inp.addEventListener("blur",()=>{setTimeout(()=>{if(comboIdx===i)closeCombo();const v=inp.value.trim();setSlot(i,v?(findPerk(v)?findPerk(v).en:v):"");},120);});
  inp.addEventListener("keydown",e=>{
    const open=!sugg.hidden&&comboIdx===i;
    if(e.key==="ArrowDown"){e.preventDefault();if(!open)openCombo(i);else{comboActive=Math.min(comboItems.length-1,comboActive+1);paintActive();}}
    else if(e.key==="ArrowUp"){if(open){e.preventDefault();comboActive=Math.max(0,comboActive-1);paintActive();}}
    else if(e.key==="Enter"){if(open&&comboActive>=0){e.preventDefault();pickCombo(comboActive);}else if(open){e.preventDefault();closeCombo();}}
    else if(e.key==="Escape"){if(open){e.preventDefault();e.stopPropagation();closeCombo();}}
  });
  $("fX"+i).addEventListener("click",()=>{setSlot(i,"");inp.focus();});
});
$("langSel").value=lang;
$("langSel").addEventListener("change",e=>{
  lang=e.target.value;try{localStorage.setItem("dbd-lang",lang);}catch(err){}
  if(!$("bform").hidden)[0,1,2,3].forEach(i=>setSlot(i,formPerks[i]));
  render();renderPanel();
});

function alnum(s){return norm(s).replace(/&/g,"and").replace(/[^a-z0-9]/g,"");}
function matchPerk(filename){
  let b=filename.replace(/\.[^.]+$/,"");
  b=alnum(b).replace(/^(tui)?iconsperks|^iconperks|^perk/,"");
  if(!b)return null;
  const keys=PERKS.map(p=>({p,ks:[alnum(p.en),alnum(p.en.replace(/^(hex|scourge hook): /i,"")),alnum(p.es),alnum(p.es.replace(/^(maleficio|gancho de flagelo): /i,""))]}));
  let hit=keys.find(x=>x.ks.includes(b));
  if(!hit)hit=keys.filter(x=>x.ks.some(k=>k.length>=5&&(b.includes(k)||k.includes(b)))).sort((a,c)=>Math.max(...c.ks.map(k=>k.length))-Math.max(...a.ks.map(k=>k.length)))[0];
  return hit?hit.p:null;
}
function savePerkIcons(){
  if(!col){lsSave();return;}
  const ref=col.doc("perkicons");const map={...state.perkIcons};
  enqueue("perkicons",()=>ref.set({map}));
}
function iconBlob(file,size){
  return new Promise((res,rej)=>{
    const url=URL.createObjectURL(file);const im=new Image();
    im.onload=()=>{const cv=document.createElement("canvas");cv.width=cv.height=size;const r=Math.min(size/im.width,size/im.height);const w=im.width*r,h=im.height*r;
      cv.getContext("2d").drawImage(im,(size-w)/2,(size-h)/2,w,h);URL.revokeObjectURL(url);cv.toBlob(b=>b?res({blob:b,canvas:cv}):rej(new Error("blob")),"image/png");};
    im.onerror=()=>{URL.revokeObjectURL(url);rej(new Error("load"));};im.src=url;
  });
}
$("iconBtn").onclick=()=>$("iconFile").click();
$("iconFile").addEventListener("change",async e=>{
  const files=[...(e.target.files||[])];e.target.value="";if(!files.length)return;
  const btn=$("iconBtn");btn.disabled=true;let ok=0;const miss=[];const icons={...state.perkIcons};const old=[];
  for(let i=0;i<files.length;i++){
    btn.textContent="Importando "+(i+1)+" de "+files.length+"…";
    const f=files[i],p=matchPerk(f.name);
    if(!p||!/^image\/(png|jpeg|webp)$/.test(f.type)){miss.push(f.name);continue;}
    try{
      if(assets){const {blob}=await iconBlob(f,128);const r=await assets.upload(blob,{type:"image/png"});if(icons[p.en]&&icons[p.en].length===32)old.push(icons[p.en]);icons[p.en]=r.id;}
      else{const {canvas}=await iconBlob(f,72);icons[p.en]=canvas.toDataURL("image/png");}
      ok++;
    }catch(err){miss.push(f.name);if(err&&err.code==="quota_exceeded")break;}
  }
  state.perkIcons=icons;savePerkIcons();
  if(assets)old.forEach(id=>assets.delete(id).catch(()=>{}));
  btn.disabled=false;btn.textContent="Importar iconos de perks";
  [0,1,2,3].forEach(i=>setSlot(i,formPerks[i]));render();renderPanel();
  toast((ok===1?"1 icono asignado":ok+" iconos asignados")+(miss.length?". Sin asignar: "+miss.slice(0,4).join(", ")+(miss.length>4?"…":""):"."),6000);
});

let randTimer=null,randLast=null,randPick=null;
function randPool(){const only=$("randOnly").checked;return allChars().filter(c=>!only||buildsOf(c.id).length);}
function openRand(){$("rand").hidden=false;rollRand();}
function closeRand(){clearTimeout(randTimer);randTimer=null;$("rand").hidden=true;$("randBtn").focus();}
function landRand(c){
  const t=$("randTitle");t.textContent=c.name;t.classList.remove("rolling");void t.offsetWidth;t.classList.add("landed");
  const img=$("randImg"),src=imgSrc(c.id);
  if(src){img.onload=()=>requestAnimationFrame(()=>img.classList.add("on"));img.src=src;}else img.removeAttribute("src");
  const bs=buildsOf(c.id);
  let meta="Nº "+relOf(c)+" · "+(bs.length?(bs.length===1?"1 build":bs.length+" builds"):"Sin builds");
  if(bs.length)meta+=" · Prueba: "+bs[Math.floor(Math.random()*bs.length)].name;
  $("randMeta").textContent=meta;
  randPick=c.id;$("randGo").textContent=bs.length?"Ver sus builds":"Crear una build";
  $("randGo").disabled=false;$("randAgain").disabled=false;$("randAgain").focus();
}
function rollRand(){
  clearTimeout(randTimer);
  const pool=randPool(),img=$("randImg"),t=$("randTitle");
  img.classList.remove("on");$("randMeta").textContent="";randPick=null;
  if(!pool.length){t.classList.remove("rolling","landed");t.textContent="Sin asesinos";$("randMeta").textContent="Todavía no tienes builds guardadas. Desmarca la opción para elegir entre todos.";$("randGo").disabled=true;$("randAgain").disabled=false;return;}
  const cands=pool.length>1?pool.filter(c=>c.id!==randLast):pool;
  const pick=cands[Math.floor(Math.random()*cands.length)];randLast=pick.id;
  $("randGo").disabled=true;$("randAgain").disabled=true;
  t.classList.remove("landed");t.classList.add("rolling");
  if(matchMedia("(prefers-reduced-motion: reduce)").matches||pool.length===1){landRand(pick);return;}
  let step=0;const steps=12;
  const tick=()=>{
    if(step>=steps){landRand(pick);return;}
    let n;do{n=pool[Math.floor(Math.random()*pool.length)];}while(pool.length>2&&n.name===t.textContent);
    t.textContent=n.name;step++;randTimer=setTimeout(tick,30+step*step*1.6);
  };
  tick();
}
$("randBtn").onclick=openRand;
$("randClose").onclick=closeRand;
$("randAgain").onclick=rollRand;
$("randOnly").addEventListener("change",rollRand);
$("rand").addEventListener("click",e=>{if(e.target.id==="rand")closeRand();});
$("randGo").onclick=()=>{const id=randPick;if(!id)return;closeRand();openPanel(id);if(!buildsOf(id).length)startNewBuild();};
let copiedBuild=null,lastRandBuild=null;try{copiedBuild=localStorage.getItem("dbd-copied");}catch(e){}
function buildText(b){const perks=(b.perks||[]).filter(Boolean).map(p=>perkLabel(p));let t="Build: "+b.name+"\nPerks: "+perks.join(" / ");if(b.notes)t+="\nNotas: "+b.notes;return t;}
async function copyText(t){
  try{await navigator.clipboard.writeText(t);return true;}catch(e){}
  try{const ta=document.createElement("textarea");ta.value=t;ta.setAttribute("readonly","");ta.style.position="fixed";ta.style.opacity="0";document.body.appendChild(ta);ta.select();const ok=document.execCommand("copy");ta.remove();return ok;}catch(e){return false;}
}
function parseBuild(t){
  if(!t)return null;
  const lines=String(t).replace(/\r/g,"").split("\n").map(l=>l.trim()).filter(Boolean);
  let name="",perks=[],notes=[],mode=null;
  lines.forEach(l=>{
    const m=l.match(/^(build|nombre|name|perks|ventajas|notas|notes)\s*:\s*(.*)$/i);
    if(m){const k=m[1].toLowerCase();
      if(k==="perks"||k==="ventajas"){perks=m[2].split(/\s*[\/,|]\s*/).filter(Boolean);mode="perks";}
      else if(k==="notas"||k==="notes"){notes.push(m[2]);mode="notes";}
      else{name=m[2];mode="name";}}
    else if(mode==="notes")notes.push(l);
  });
  if(!name&&!perks.length)return null;
  return {name,perks:perks.slice(0,4).map(p=>{const f=findPerk(p);return f?f.en:p;}),notes:notes.join("\n")};
}
function fillFromPaste(b){
  if(b.name)$("fName").value=b.name;
  for(let i=0;i<4;i++)setSlot(i,b.perks[i]||"");
  if(b.notes)$("fNotes").value=b.notes;
  $("pasteBox").hidden=true;$("pasteBox").value="";
  toast("Build pegada. Revísala y guárdala.");
}
$("pasteBtn").onclick=async()=>{
  let t=null;try{t=await navigator.clipboard.readText();}catch(e){}
  let b=parseBuild(t);if(!b&&copiedBuild)b=parseBuild(copiedBuild);
  if(b){fillFromPaste(b);return;}
  const box=$("pasteBox");box.hidden=false;box.focus();toast("Pega la build en el cuadro.");
};
$("pasteBox").addEventListener("input",e=>{const b=parseBuild(e.target.value);if(b)fillFromPaste(b);});
$("fName").addEventListener("paste",e=>{const t=(e.clipboardData||window.clipboardData).getData("text");if(!t||t.indexOf("\n")<0)return;const b=parseBuild(t);if(b){e.preventDefault();fillFromPaste(b);}});
$("randBuild").onclick=()=>{
  const list=buildsOf(state.open);if(!list.length)return;
  const c=list.length>1?list.filter(b=>b.id!==lastRandBuild):list;
  const pick=c[Math.floor(Math.random()*c.length)];lastRandBuild=pick.id;
  $("blist").querySelectorAll(".build.picked").forEach(a=>a.classList.remove("picked"));
  const art=[...$("blist").querySelectorAll(".build")].find(a=>a.dataset.bid===pick.id);
  if(art){void art.offsetWidth;art.classList.add("picked");art.scrollIntoView({behavior:matchMedia("(prefers-reduced-motion: reduce)").matches?"auto":"smooth",block:"center"});}
  toast("Build aleatoria: "+pick.name);
};
function rowToBuild(r){return {id:r.id,name:r.name,perks:Array.isArray(r.perks)?r.perks:[],notes:r.notes||"",author:r.author||"",userId:r.user_id,createdAt:Date.parse(r.created_at)||0};}
let reloadT=null;
function scheduleReload(){clearTimeout(reloadT);reloadT=setTimeout(loadCloud,400);}
function rowToKiller(r){const url=r.img_path?sb.storage.from("killers").getPublicUrl(r.img_path).data.publicUrl:null;return {id:r.id,name:r.name,role:"killer",custom:true,shared:true,userId:r.user_id,author:r.author||"",imgPath:r.img_path||null,img:url};}
function ownsKiller(c){return !sb||!c.shared||c.userId===myId();}
async function uploadKillerImage(ck,file){
  const {blob}=await resizeImage(file,1200,.86);
  const path=myId()+"/"+ck.id+"-"+Date.now()+".jpg";
  const up=await sb.storage.from("killers").upload(path,blob,{contentType:"image/jpeg",upsert:false});
  if(up.error)throw up.error;
  const {error}=await sb.from("killers").update({img_path:path}).eq("id",ck.id);
  if(error){sb.storage.from("killers").remove([path]);throw error;}
  if(ck.imgPath)sb.storage.from("killers").remove([ck.imgPath]);
  state.custom=state.custom.map(c=>c.id===ck.id?{...c,imgPath:path,img:sb.storage.from("killers").getPublicUrl(path).data.publicUrl}:c);
}
async function cloudAddKiller(name){
  if(!state.session){openAcc("Para añadir asesinos para todos necesitas hacer login.");return;}
  if(!state.nick){openAcc();return;}
  const id="kc-"+(slug(name)||"x").slice(0,60)+"-"+uidGen().slice(-4);
  const {data,error}=await sb.from("killers").insert({id,name,author:state.nick}).select().single();
  if(error){toast(error.code==="23505"?"Ese asesino ya existe.":/limite/i.test(error.message||"")?"Has llegado al máximo de asesinos que puedes añadir.":"No se pudo añadir el asesino.");return;}
  state.custom=[...state.custom.filter(c=>c.id!==data.id),rowToKiller(data)];
  $("addName").value="";$("addForm").hidden=true;render();toast("Asesino añadido para todos.");
}
async function cloudRemoveKiller(c){
  const {error}=await sb.from("killers").delete().eq("id",c.id);
  if(error){toast(/otros/i.test(error.message||"")?"No se puede quitar: otros usuarios tienen builds de este asesino.":"No se pudo quitar el asesino.");return;}
  if(c.imgPath)sb.storage.from("killers").remove([c.imgPath]);
  state.custom=state.custom.filter(x=>x.id!==c.id);
  const nb={...state.builds};delete nb[c.id];state.builds=nb;
  closePanel();render();toast("Asesino quitado.");
}
let syncing=false;
async function syncLocalKillers(){
  if(syncing||!sb||!state.session||!state.nick||!(state.localCustom||[]).length)return;
  syncing=true;let moved=0;
  try{
    for(const c of [...state.localCustom]){
      let row=state.custom.find(x=>x.id===c.id);
      if(!row){
        const {data,error}=await sb.from("killers").insert({id:c.id,name:String(c.name).slice(0,60),author:state.nick}).select().single();
        if(error)continue;
        row=rowToKiller(data);state.custom=[...state.custom,row];
      }
      if(row.userId!==myId())continue;
      const li=state.imgs[c.id];
      if(li&&li.data&&!row.imgPath){
        try{const blob=await (await fetch(li.data)).blob();await uploadKillerImage(row,blob);const ni={...state.imgs};delete ni[c.id];state.imgs=ni;}
        catch(e){continue;}
      }
      state.localCustom=state.localCustom.filter(x=>x.id!==c.id);moved++;
    }
  }finally{syncing=false;}
  if(moved){lsSave();render();renderPanel();toast(moved===1?"Tu asesino ya es visible para todos.":"Tus "+moved+" asesinos ya son visibles para todos.");}
}
async function loadCloud(){
  const [res,kres]=await Promise.all([
    sb.from("builds").select("id,killer,name,perks,notes,author,user_id,created_at").order("created_at",{ascending:false}).limit(5000),
    sb.from("killers").select("id,name,author,user_id,img_path,created_at").order("created_at",{ascending:true}).limit(500)
  ]);
  if(!kres.error)state.custom=kres.data.map(rowToKiller);
  const {data,error}=res;
  if(error){toast("No se pudieron cargar las builds de la comunidad.");render();renderPanel();return;}
  const g={};data.forEach(r=>{(g[r.killer]=g[r.killer]||[]).push(rowToBuild(r));});
  state.builds=g;render();renderPanel();
  syncLocalKillers();
}
function setSession(s){
  state.session=s||null;
  const md=s&&s.user&&s.user.user_metadata||{};
  state.nick=(md.nick||"").trim();
  renderAccount();renderPanel();
  if(!$("acc").hidden)fillAcc();
  syncLocalKillers();
}
function renderAccount(){
  const b=$("accBtn");if(!sb){b.hidden=true;return;}
  b.hidden=false;b.textContent=state.session?(state.nick||"Mi cuenta"):"Login";
}
function localCount(){return Object.values(state.localBuilds||{}).reduce((n,a)=>n+(Array.isArray(a)?a.length:0),0);}
function localKillers(){return (state.localCustom||[]).length;}
let accReason="";
function fillAcc(){
  const logged=!!state.session;
  $("loginForm").hidden=logged;$("nickForm").hidden=!logged;$("accLogged").hidden=!logged;
  if(!logged){
    $("accTitle").textContent="Login";
    $("accText").textContent=accReason||"Cualquiera puede ver las builds. Para publicar, editar o borrar las tuyas, entra con tu email: te enviamos un enlace y no necesitas contraseña.";
  }else{
    $("accTitle").textContent=state.nick||"Elige tu nombre";
    $("accText").textContent=state.nick?"Has entrado como "+(state.session.user.email||"")+". Tu nombre aparece en las builds que publicas.":"Antes de publicar, elige el nombre que verán los demás en tus builds.";
    $("accNick").value=state.nick;
    const n=localCount(),k=localKillers();$("migrateBtn").hidden=!((n||k)&&state.nick);$("migrateBtn").textContent=n?(n===1?"Subir mi build local":"Subir mis "+n+" builds locales"):(k===1?"Subir mi asesino local":"Subir mis "+k+" asesinos locales");
  }
}
function openAcc(reason){accReason=reason||"";fillAcc();$("acc").hidden=false;setTimeout(()=>{const f=state.session?$("accNick"):$("accEmail");f.focus();},50);}
function closeAcc(){$("acc").hidden=true;}
function startNewBuild(){
  if(sb&&!state.session){openAcc("Para publicar builds en la comunidad necesitas entrar con tu email.");return false;}
  if(sb&&!state.nick){openAcc();return false;}
  showForm(null);return true;
}
async function cloudSave(cid,b){
  const btn=$("fSave");btn.disabled=true;
  try{
    let res;
    if(state.editing&&state.editing!=="new")res=await sb.from("builds").update({name:b.name,perks:b.perks,notes:b.notes,updated_at:new Date().toISOString()}).eq("id",state.editing).select().single();
    else res=await sb.from("builds").insert({killer:cid,name:b.name,perks:b.perks,notes:b.notes,author:state.nick}).select().single();
    if(res.error)throw res.error;
    const row=rowToBuild(res.data);
    state.builds={...state.builds,[cid]:[row,...buildsOf(cid).filter(x=>x.id!==row.id)]};
    hideForm();render();renderPanel();toast("Build publicada.");
  }catch(err){toast(/limite/i.test(err&&err.message||"")?"Has llegado al máximo de builds que puedes publicar.":"No se pudo guardar la build. Inténtalo de nuevo.");}
  finally{btn.disabled=false;}
}
async function cloudDelete(cid,bid){
  const {error}=await sb.from("builds").delete().eq("id",bid);
  if(error){toast("No se pudo borrar la build.");return;}
  state.builds={...state.builds,[cid]:buildsOf(cid).filter(x=>x.id!==bid)};
  render();renderPanel();toast("Build borrada.");
}
$("accBtn").onclick=()=>openAcc();
$("accClose").onclick=closeAcc;
$("acc").addEventListener("click",e=>{if(e.target.id==="acc")closeAcc();});
$("loginForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const email=$("accEmail").value.trim();if(!email)return;
  const btn=$("loginForm").querySelector("button");btn.disabled=true;
  const {error}=await sb.auth.signInWithOtp({email,options:{emailRedirectTo:location.origin+location.pathname}});
  btn.disabled=false;
  if(error){toast("No se pudo enviar el enlace. Revisa el email o espera un poco.");return;}
  $("accText").textContent="Te hemos enviado un enlace a "+email+". Ábrelo en este mismo dispositivo para entrar.";
});
$("nickForm").addEventListener("submit",async e=>{
  e.preventDefault();
  const nick=$("accNick").value.trim().slice(0,30);if(!nick)return;
  const btn=$("nickForm").querySelector("button");btn.disabled=true;
  const {data,error}=await sb.auth.updateUser({data:{nick}});
  btn.disabled=false;
  if(error){toast("No se pudo guardar el nombre.");return;}
  if(data&&data.user)state.session={...state.session,user:data.user};
  state.nick=nick;renderAccount();fillAcc();
  const uid=myId();if(uid){sb.from("builds").update({author:nick}).eq("user_id",uid).then(()=>scheduleReload());sb.from("killers").update({author:nick}).eq("user_id",uid).then(()=>scheduleReload());}
  toast("Nombre guardado.");
});
$("logoutBtn").onclick=async()=>{await sb.auth.signOut();closeAcc();toast("Has cerrado sesión.");};
$("migrateBtn").onclick=async()=>{
  const rows=[];
  Object.entries(state.localBuilds||{}).forEach(([cid,arr])=>(arr||[]).forEach(b=>rows.push({killer:cid,name:String(b.name||"Build").slice(0,80),perks:(b.perks||[]).slice(0,4),notes:String(b.notes||"").slice(0,600),author:state.nick})));
  if(!rows.length&&!(state.localCustom||[]).length)return;
  const btn=$("migrateBtn");btn.disabled=true;btn.textContent="Subiendo…";
  await syncLocalKillers();
  for(let i=0;i<rows.length;i+=100){
    const {error}=await sb.from("builds").insert(rows.slice(i,i+100));
    if(error){btn.disabled=false;fillAcc();toast("No se pudieron subir todas las builds.");return;}
  }
  state.localBuilds={};lsSave();btn.disabled=false;fillAcc();await loadCloud();toast("Tus builds locales ya están en la comunidad.");
};
$("mineOnly").addEventListener("change",e=>{state.filterMine=e.target.checked;renderPanel();});
async function init(){
  render();
  const cfg=window.DBD_CONFIG||{};
  if(cfg.url&&cfg.key&&window.supabase&&typeof window.supabase.createClient==="function"){
    try{
      sb=window.supabase.createClient(cfg.url,cfg.key);
      lsLoad();state.localBuilds=state.builds||{};state.builds={};state.localCustom=state.custom||[];state.custom=[];state.mode="cloud";
      renderAccount();
      const {data}=await sb.auth.getSession();setSession(data&&data.session);
      sb.auth.onAuthStateChange((ev,s)=>setSession(s));
      await loadCloud();
      sb.channel("builds-live").on("postgres_changes",{event:"*",schema:"public",table:"builds"},()=>scheduleReload()).on("postgres_changes",{event:"*",schema:"public",table:"killers"},()=>scheduleReload()).subscribe();
      document.addEventListener("visibilitychange",()=>{if(!document.hidden)scheduleReload();});
      return;
    }catch(e){sb=null;toast("No se pudo conectar con la comunidad. Se usará el modo local.");}
  }
  renderAccount();
  await initClaude();
}
init();
})();
