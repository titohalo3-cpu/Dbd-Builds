(function(){
const KILLERS=["The Trapper","The Wraith","The Hillbilly","The Nurse","The Shape","The Hag","The Doctor","The Huntress","The Cannibal","The Nightmare","The Pig","The Clown","The Spirit","The Legion","The Plague","The Ghost Face","The Demogorgon","The Oni","The Deathslinger","The Executioner","The Blight","The Twins","The Trickster","The Nemesis","The Cenobite","The Artist","The Onryō","The Dredge","The Mastermind","The Knight","The Skull Merchant","The Singularity","The Xenomorph","The Good Guy","The Unknown","The Lich - Vecna","Dracula","The Houndmaster","The Ghoul","The Animatronic","The Krasue","The First","The Slasher","The Judgment"];
const slug=s=>s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLowerCase().replace(/[^a-z0-9]+/g,"-").replace(/^-|-$/g,"");
const BASE=KILLERS.map((n,i)=>({id:"k-"+slug(n),name:n,rel:i+1}));

const DEFAULT_IMGS={"k-the-mastermind": "img/killers/the-mastermind.webp","k-the-unknown": "img/killers/the-unknown.webp","k-the-onryo": "img/killers/the-onryo.webp","k-the-dredge": "img/killers/the-dredge.webp","k-the-knight": "img/killers/the-knight.webp","k-the-skull-merchant": "img/killers/the-skull-merchant.webp","k-the-singularity": "img/killers/the-singularity.webp","k-the-krasue": "img/killers/the-krasue.webp","k-the-demogorgon": "img/killers/the-demogorgon.webp","k-the-first": "img/killers/the-first.webp","k-the-slasher": "img/killers/the-slasher.webp","k-the-judgment": "img/killers/the-judgment.webp","k-dracula": "img/killers/dracula.webp","k-the-ghoul": "img/killers/the-ghoul.webp","k-the-houndmaster": "img/killers/the-houndmaster.webp","k-the-animatronic": "img/killers/the-animatronic.webp","k-the-xenomorph": "img/killers/the-xenomorph.webp","k-the-lich-vecna": "img/killers/the-lich-vecna.webp","k-the-good-guy": "img/killers/the-good-guy.webp","k-the-hag": "img/killers/the-hag.webp","k-the-cannibal": "img/killers/the-cannibal.webp","k-the-nightmare": "img/killers/the-nightmare.webp","k-the-blight": "img/killers/the-blight.webp","k-the-clown": "img/killers/the-clown.webp","k-the-deathslinger": "img/killers/the-deathslinger.webp","k-the-doctor": "img/killers/the-doctor.webp","k-the-ghost-face": "img/killers/the-ghost-face.webp","k-the-hillbilly": "img/killers/the-hillbilly.webp","k-the-huntress": "img/killers/the-huntress.webp","k-the-legion": "img/killers/the-legion.webp","k-the-nemesis": "img/killers/the-nemesis.webp","k-the-nurse": "img/killers/the-nurse.webp","k-the-oni": "img/killers/the-oni.webp","k-the-pig": "img/killers/the-pig.webp","k-the-plague": "img/killers/the-plague.webp","k-the-executioner": "img/killers/the-executioner.webp","k-the-spirit": "img/killers/the-spirit.webp","k-the-artist": "img/killers/the-artist.webp","k-the-twins": "img/killers/the-twins.webp","k-the-trapper": "img/killers/the-trapper.webp","k-the-trickster": "img/killers/the-trickster.webp","k-the-wraith": "img/killers/the-wraith.webp","k-the-shape": "img/killers/the-shape.webp","k-the-cenobite": "img/killers/the-cenobite.webp"};
let sortMode="new";try{const s=localStorage.getItem("dbd-sort");if(s=="new"||s=="old"||s=="az")sortMode=s;}catch(e){}
const state={q:"",builds:{},imgs:{},perkIcons:{},custom:[],open:null,editing:null,mode:"loading"};
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
const DEFAULT_PERK_ICONS={"Dead Man's Switch": "img/perks/dead-man-s-switch.webp","Hex: Huntress Lullaby": "img/perks/hex-huntress-lullaby.webp","Genetic Limits": "img/perks/genetic-limits.webp","Barbecue & Chilli": "img/perks/barbecue-chilli.webp","Hex: Hive Mind": "img/perks/hex-hive-mind.webp","Machine Learning": "img/perks/machine-learning.webp","Hubris": "img/perks/hubris.webp","Secret Project": "img/perks/secret-project.webp","Forced Hesitation": "img/perks/forced-hesitation.webp","Dissolution": "img/perks/dissolution.webp","Septic Touch": "img/perks/septic-touch.webp","Alien Instinct": "img/perks/alien-instinct.webp","Ultimate Weapon": "img/perks/ultimate-weapon.webp","Rapid Brutality": "img/perks/rapid-brutality.webp","Wandering Eye": "img/perks/wandering-eye.webp","Haywire": "img/perks/haywire.webp","Rampage": "img/perks/rampage.webp","Dominance": "img/perks/dominance.webp","Lay Waste": "img/perks/lay-waste.webp","Turn Back the Clock": "img/perks/turn-back-the-clock.webp","Scourge Hook: Pain Resonance": "img/perks/scourge-hook-pain-resonance.webp","Darkness Revealed": "img/perks/darkness-revealed.webp","Hex: Face the Darkness": "img/perks/hex-face-the-darkness.webp","Help Wanted": "img/perks/help-wanted.webp","Phantom Fear": "img/perks/phantom-fear.webp","Game Afoot": "img/perks/game-afoot.webp","Terminus": "img/perks/terminus.webp","Hex: Two Can Play": "img/perks/hex-two-can-play.webp","Unbound": "img/perks/unbound.webp","Undone": "img/perks/undone.webp","Unforeseen": "img/perks/unforeseen.webp","Batteries Included": "img/perks/batteries-included.webp","Friends 'til the End": "img/perks/friends-til-the-end.webp","Nowhere to Hide": "img/perks/nowhere-to-hide.webp","Leverage": "img/perks/leverage.webp","THWACK!": "img/perks/thwack.webp","No Quarter": "img/perks/no-quarter.webp","Hex: Overture of Doom": "img/perks/hex-overture-of-doom.webp","Ravenous": "img/perks/ravenous.webp","Hex: Wretched Fate": "img/perks/hex-wretched-fate.webp","Celestial Witness": "img/perks/celestial-witness.webp","Hex: Under Your Thumb": "img/perks/hex-under-your-thumb.webp","Scared to Death": "img/perks/scared-to-death.webp","Silent Shadow": "img/perks/silent-shadow.webp","Languid Touch": "img/perks/languid-touch.webp","Dark Arrogance": "img/perks/dark-arrogance.webp","Superior Anatomy": "img/perks/superior-anatomy.webp","Weave Attunement": "img/perks/weave-attunement.webp","All-Shaking Thunder": "img/perks/all-shaking-thunder.webp","Awakened Awareness": "img/perks/awakened-awareness.webp","None Are Free": "img/perks/none-are-free.webp","Forever Entwined": "img/perks/forever-entwined.webp","Scourge Hook: Jagged Compass": "img/perks/scourge-hook-jagged-compass.webp","Hex: Nothing but Misery": "img/perks/hex-nothing-but-misery.webp","Cruel Limits": "img/perks/cruel-limits.webp","Mindbreaker": "img/perks/mindbreaker.webp","Surge": "img/perks/surge.webp","Hex: Blood Favour": "img/perks/hex-blood-favour.webp","Pop Goes the Weasel": "img/perks/pop-goes-the-weasel.webp","Monitor & Abuse": "img/perks/monitor-abuse.webp","Overcharge": "img/perks/overcharge.webp","Deathbound": "img/perks/deathbound.webp","Furtive Chase": "img/perks/furtive-chase.webp","Beast of Prey": "img/perks/beast-of-prey.webp","Eruption": "img/perks/eruption.webp","Hysteria": "img/perks/hysteria.webp","Lethal Pursuer": "img/perks/lethal-pursuer.webp","Blood Warden": "img/perks/blood-warden.webp","Fire Up": "img/perks/fire-up.webp","A Nurse's Calling": "img/perks/a-nurse-s-calling.webp","Surveillance": "img/perks/surveillance.webp","Infectious Fright": "img/perks/infectious-fright.webp","Hex: Haunted Ground": "img/perks/hex-haunted-ground.webp","Grim Embrace": "img/perks/grim-embrace.webp","Hex: Pentimento": "img/perks/hex-pentimento.webp","Agitation": "img/perks/agitation.webp","Brutal Strength": "img/perks/brutal-strength.webp","Oppression": "img/perks/oppression.webp","Dragon's Grip": "img/perks/dragon-s-grip.webp","Hex: Undying": "img/perks/hex-undying.webp","Call of Brine": "img/perks/call-of-brine.webp","Bamboozle": "img/perks/bamboozle.webp","Coulrophobia": "img/perks/coulrophobia.webp","Gearhead": "img/perks/gearhead.webp","Hex: Retribution": "img/perks/hex-retribution.webp","Overwhelming Presence": "img/perks/overwhelming-presence.webp","Forced Penance": "img/perks/forced-penance.webp","Trail of Torment": "img/perks/trail-of-torment.webp","I'm All Ears": "img/perks/i-m-all-ears.webp","Thrilling Tremors": "img/perks/thrilling-tremors.webp","Hex: Ruin": "img/perks/hex-ruin.webp","Hex: The Third Seal": "img/perks/hex-the-third-seal.webp","Hex: Devour Hope": "img/perks/hex-devour-hope.webp","Enduring": "img/perks/enduring.webp","Lightborn": "img/perks/lightborn.webp","Tinkerer": "img/perks/tinkerer.webp","Territorial Imperative": "img/perks/territorial-imperative.webp","Franklin's Demise": "img/perks/franklin-s-demise.webp","Knock Out": "img/perks/knock-out.webp","Discordance": "img/perks/discordance.webp","Iron Maiden": "img/perks/iron-maiden.webp","Mad Grit": "img/perks/mad-grit.webp","Merciless Storm": "img/perks/merciless-storm.webp","Remember Me": "img/perks/remember-me.webp","Stridor": "img/perks/stridor.webp","Thanatophobia": "img/perks/thanatophobia.webp","Blood Echo": "img/perks/blood-echo.webp","Nemesis": "img/perks/nemesis.webp","Zanshin Tactics": "img/perks/zanshin-tactics.webp","Hangman's Trick": "img/perks/hangman-s-trick.webp","Make Your Choice": "img/perks/make-your-choice.webp","Corrupt Intervention": "img/perks/corrupt-intervention.webp","Dark Devotion": "img/perks/dark-devotion.webp","Scourge Hook: Floods of Rage": "img/perks/scourge-hook-floods-of-rage.webp","Rancor": "img/perks/rancor.webp","Spirit Fury": "img/perks/spirit-fury.webp","Unnerving Presence": "img/perks/unnerving-presence.webp","Hex: Crowd Control": "img/perks/hex-crowd-control.webp","No Way Out": "img/perks/no-way-out.webp","Starstruck": "img/perks/starstruck.webp","Coup de Grâce": "img/perks/coup-de-grace.webp","Hoarder": "img/perks/hoarder.webp","Bloodhound": "img/perks/bloodhound.webp","Predator": "img/perks/predator.webp","Shadowborn": "img/perks/shadowborn.webp","Insidious": "img/perks/insidious.webp","Monstrous Shrine": "img/perks/monstrous-shrine.webp","Sloppy Butcher": "img/perks/sloppy-butcher.webp","Spies from the Shadows": "img/perks/spies-from-the-shadows.webp","Whispers": "img/perks/whispers.webp","Human Greed": "img/perks/human-greed.webp","Dying Light": "img/perks/dying-light.webp","Iron Grasp": "img/perks/iron-grasp.webp","Unrelenting": "img/perks/unrelenting.webp","Distressing": "img/perks/distressing.webp","Save the Best for Last": "img/perks/save-the-best-for-last.webp","Play with Your Food": "img/perks/play-with-your-food.webp","Deadlock": "img/perks/deadlock.webp","Hex: Plaything": "img/perks/hex-plaything.webp","Scourge Hook: Gift of Pain": "img/perks/scourge-hook-gift-of-pain.webp","Bitter Murmur": "img/perks/bitter-murmur.webp","Hex: No One Escapes Death": "img/perks/hex-no-one-escapes-death.webp","Hex: Thrill of the Hunt": "img/perks/hex-thrill-of-the-hunt.webp","Deerstalker": "img/perks/deerstalker.webp"};
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
function lsSave(){try{localStorage.setItem(LS,JSON.stringify({builds:state.builds,custom:state.custom,imgs:state.imgs,perkIcons:state.perkIcons}));}catch(e){toast("No hay espacio suficiente en este navegador.");}}
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
async function init(){
  render();
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

function allChars(){return [...BASE,...state.custom];}
function charById(id){return allChars().find(c=>c.id===id);}
function buildsOf(id){return state.builds[id]||[];}
function imgSrc(id){const i=state.imgs[id];if(i)return i.id?"/_blob/"+i.id:(i.data||DEFAULT_IMGS[id]||null);return DEFAULT_IMGS[id]||null;}
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
  $("foot").textContent=state.mode==="cloud"?"Tus builds se guardan en tu cuenta y solo las ves tú."+tip:state.mode==="local"?"Tus builds se guardan en este navegador."+tip:"Cargando tus builds…";
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
function canUpload(){return state.mode!=="loading"&&(state.mode==="local"||!!col);}
function renderHero(c){
  const hero=$("hero"),src=imgSrc(c.id);
  if(src!==lastHeroSrc){
    const old=hero.querySelector("img");if(old)old.remove();
    if(src){const im=document.createElement("img");im.alt="";im.src=src;hero.insertBefore(im,hero.firstChild);}
    lastHeroSrc=src;
  }
  hero.classList.toggle("noimg",!src);
  $("imgActions").hidden=!canUpload();
  $("imgPick").textContent=src?"Cambiar imagen":"Subir imagen";
  $("imgRemove").hidden=!state.imgs[c.id];
  $("imgRemove").textContent=DEFAULT_IMGS[c.id]?"Volver a la original":"Quitar imagen";
}
function renderPanel(){
  if(!state.open)return;
  const c=charById(state.open);if(!c){closePanel();return;}
  $("pTitle").textContent=c.name;
  renderHero(c);
  $("removeChar").hidden=!c.custom;
  const q=norm(state.q.trim());
  const box=$("blist");box.textContent="";
  const list=buildsOf(c.id);
  if(!list.length){box.appendChild(el("p","noBuilds","Todavía no hay builds para "+c.name+". Crea la primera con Nueva build."));return;}
  list.forEach(b=>{
    const art=el("article","build");
    const lo=el("div","loadout");const dm=el("div","diamond");
    const perks=(b.perks||[]).slice(0,4);while(perks.length<4)perks.push("");
    perks.forEach(p=>{const t=p?perkType(p):"";const s=el("div","slot "+(p?"filled":"empty")+(t?" "+t:""));s.title=p?perkLabel(p):"Vacío";const src=p?perkIconSrc(p):null;if(src){const im=document.createElement("img");im.alt="";im.src=src;s.appendChild(im);s.classList.add("has-img");}else s.appendChild(el("span",null,p?initials(perkLabel(p)):""));dm.appendChild(s);});
    lo.appendChild(dm);lo.setAttribute("aria-hidden","true");
    const body=el("div");
    body.appendChild(el("h3",null,b.name));
    const ol=el("ol","perks");
    const filled=perks.filter(Boolean);
    if(!filled.length)ol.appendChild(el("li","none","Sin perks"));
    filled.forEach(p=>{const hit=q&&(norm(p).includes(q)||norm(perkLabel(p)).includes(q)||norm(perkOther(p)).includes(q));const li=el("li",hit?"hit":null);li.appendChild(perkIcon(p,"mini"));li.appendChild(el("span",null,perkLabel(p)));const f=findPerk(p);if(f)li.appendChild(el("span","pown",f.owner||"General"));ol.appendChild(li);});
    body.appendChild(ol);
    if(b.notes)body.appendChild(el("p","notes",b.notes));
    const act=el("div","bact");
    const ed=el("button","btn small","Editar");ed.type="button";ed.dataset.act="edit";ed.dataset.bid=b.id;
    const del=el("button","btn small ghost","Borrar");del.type="button";del.dataset.act="del";del.dataset.bid=b.id;
    act.append(ed,del);body.appendChild(act);
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
function imgErr(err){const c=err&&err.code;return c==="bad_type"?"Usa una imagen PNG, JPG o WebP.":c==="quota_exceeded"?"No queda espacio para más imágenes. Quita alguna y vuelve a probar.":"No se pudo subir la imagen. Prueba con otra.";}
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
  const prev=state.imgs[cid];const ni={...state.imgs};delete ni[cid];state.imgs=ni;
  if(prev&&prev.id&&assets)assets.delete(prev.id).catch(()=>{});
  saveChar(cid);render();renderPanel();toast("Imagen quitada.");
};

$("q").addEventListener("input",e=>{state.q=e.target.value;animateNext=true;render();});
function relOf(c){if(c.rel)return c.rel;const i=state.custom.findIndex(x=>x.id===c.id);return BASE.length+1+(i<0?0:i);}
$("sortSel").value=sortMode;
$("sortSel").addEventListener("change",e=>{sortMode=e.target.value;try{localStorage.setItem("dbd-sort",sortMode);}catch(err){}render();});
$("grid").addEventListener("click",e=>{
  const t=e.target.closest(".tile");if(!t)return;
  if(t.id==="addTile"){$("addForm").hidden=false;$("addName").focus();return;}
  openPanel(t.dataset.id);
});
$("addCancel").onclick=()=>{$("addForm").hidden=true;$("addName").value="";};
$("addForm").addEventListener("submit",e=>{
  e.preventDefault();
  const name=$("addName").value.trim();if(!name)return;
  if(allChars().some(c=>norm(c.name)===norm(name))){toast("Ese asesino ya está en la lista.");return;}
  const c={id:"kc-"+(slug(name)||"x")+"-"+uidGen().slice(-4),name,role:"killer",custom:true};
  state.custom=[...state.custom,c];saveRoster();
  $("addName").value="";$("addForm").hidden=true;render();toast("Asesino añadido.");
});
$("scrim").onclick=closePanel;
$("pClose").onclick=closePanel;
document.addEventListener("keydown",e=>{if(e.key!=="Escape")return;if(!$("rand").hidden){closeRand();return;}if(state.open)closePanel();});
$("newBuild").onclick=()=>showForm(null);
$("fCancel").onclick=hideForm;
$("bform").addEventListener("submit",e=>{
  e.preventDefault();
  const cid=state.open;if(!cid)return;
  const name=$("fName").value.trim();if(!name){$("fName").focus();return;}
  const perks=[0,1,2,3].map(i=>{const v=$("fP"+i).value.trim();const f=findPerk(v);return f?f.en:v;});
  const notes=$("fNotes").value.trim();
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
  if(!armed[bid]){armed[bid]=true;b.textContent="Confirmar borrado";b.classList.add("warn");setTimeout(()=>{delete armed[bid];if(b.isConnected){b.textContent="Borrar";b.classList.remove("warn");}},3000);return;}
  delete armed[bid];
  state.builds={...state.builds,[cid]:buildsOf(cid).filter(x=>x.id!==bid)};
  saveChar(cid);render();renderPanel();toast("Build borrada.");
});
let removeArmed=false;
$("removeChar").onclick=()=>{
  const c=charById(state.open);if(!c||!c.custom)return;
  if(!removeArmed){removeArmed=true;$("removeChar").textContent="Confirmar: quitar asesino y sus builds";setTimeout(()=>{removeArmed=false;$("removeChar").textContent="Quitar asesino";},3500);return;}
  removeArmed=false;$("removeChar").textContent="Quitar asesino";
  const prev=state.imgs[c.id];if(prev&&prev.id&&assets)assets.delete(prev.id).catch(()=>{});
  state.custom=state.custom.filter(x=>x.id!==c.id);
  const nb={...state.builds};delete nb[c.id];state.builds=nb;
  const ni={...state.imgs};delete ni[c.id];state.imgs=ni;
  saveRoster();saveChar(c.id);closePanel();render();toast("Asesino quitado.");
};

const formPerks=["","","",""];
const sugg=el("ul","sugg");sugg.id="perkSugg";sugg.setAttribute("role","listbox");sugg.hidden=true;
let comboIdx=-1,comboItems=[],comboActive=-1;
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
  if(next!==undefined)$("fP"+next).focus();else $("fNotes").focus();
}
sugg.addEventListener("mousedown",e=>{const li=e.target.closest(".opt");if(!li)return;e.preventDefault();pickCombo(+li.dataset.k);});
[0,1,2,3].forEach(i=>{
  const inp=$("fP"+i);
  inp.addEventListener("focus",()=>openCombo(i));
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
$("randGo").onclick=()=>{const id=randPick;if(!id)return;closeRand();openPanel(id);if(!buildsOf(id).length)showForm(null);};
init();
})();
