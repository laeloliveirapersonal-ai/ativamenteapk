const $ = id => document.getElementById(id);
const WORDS = [
 {word:"BOLA",syllables:["BO","LA"],theme:"objetos"},
 {word:"CASA",syllables:["CA","SA"],theme:"objetos"},
 {word:"GATO",syllables:["GA","TO"],theme:"animais"},
 {word:"PATO",syllables:["PA","TO"],theme:"animais"},
 {word:"SAPO",syllables:["SA","PO"],theme:"animais"},
 {word:"MALA",syllables:["MA","LA"],theme:"objetos"},
 {word:"LUA",syllables:["LU","A"],theme:"natureza"},
 {word:"SOL",syllables:["SOL"],theme:"natureza"},
 {word:"BOLO",syllables:["BO","LO"],theme:"alimentos"},
 {word:"UVA",syllables:["U","VA"],theme:"alimentos"},
 {word:"BONECA",syllables:["BO","NE","CA"],theme:"objetos"},
 {word:"BANANA",syllables:["BA","NA","NA"],theme:"alimentos"},
 {word:"PIPOCA",syllables:["PI","PO","CA"],theme:"alimentos"},
 {word:"CAVALO",syllables:["CA","VA","LO"],theme:"animais"},
 {word:"JANELA",syllables:["JA","NE","LA"],theme:"objetos"},
 {word:"ESCOLA",syllables:["ES","CO","LA"],theme:"objetos"},
 {word:"MACACO",syllables:["MA","CA","CO"],theme:"animais"},
 {word:"ABACAXI",syllables:["A","BA","CA","XI"],theme:"alimentos"},

 {word:"ASA",syllables:["A","SA"],theme:"animais"},
 {word:"OVO",syllables:["O","VO"],theme:"alimentos"},
 {word:"RUA",syllables:["RU","A"],theme:"objetos"},
 {word:"CÉU",syllables:["CÉU"],theme:"natureza"},
 {word:"PÉ",syllables:["PÉ"],theme:"corpo"},
 {word:"NÓ",syllables:["NÓ"],theme:"objetos"},
 {word:"CHÁ",syllables:["CHÁ"],theme:"alimentos"},
 {word:"MEL",syllables:["MEL"],theme:"alimentos"},
 {word:"MAR",syllables:["MAR"],theme:"natureza"},
 {word:"REI",syllables:["REI"],theme:"pessoas"},
 {word:"BOI",syllables:["BOI"],theme:"animais"},
 {word:"RIO",syllables:["RI","O"],theme:"natureza"},
 {word:"DIA",syllables:["DI","A"],theme:"natureza"},
 {word:"FIO",syllables:["FI","O"],theme:"objetos"},
 {word:"PÃO",syllables:["PÃO"],theme:"alimentos"},
 {word:"EU",syllables:["EU"],theme:"pessoas"},
 {word:"TU",syllables:["TU"],theme:"pessoas"},
 {word:"JÁ",syllables:["JÁ"],theme:"pessoas"},
 {word:"LÁ",syllables:["LÁ"],theme:"natureza"},
 {word:"CÁ",syllables:["CÁ"],theme:"natureza"},
 {word:"DÓ",syllables:["DÓ"],theme:"música"},
 {word:"FÉ",syllables:["FÉ"],theme:"pessoas"},
 {word:"RÉ",syllables:["RÉ"],theme:"música"},
 {word:"VÊ",syllables:["VÊ"],theme:"pessoas"},
 {word:"DÁ",syllables:["DÁ"],theme:"pessoas"},
 {word:"MÃO",syllables:["MÃO"],theme:"corpo"},
 {word:"BOCA",syllables:["BO","CA"],theme:"corpo"},
 {word:"DEDO",syllables:["DE","DO"],theme:"corpo"},
 {word:"PATO",syllables:["PA","TO"],theme:"animais"},
 {word:"RATO",syllables:["RA","TO"],theme:"animais"},
 {word:"FOCA",syllables:["FO","CA"],theme:"animais"},
 {word:"LEÃO",syllables:["LE","ÃO"],theme:"animais"},
 {word:"LOBO",syllables:["LO","BO"],theme:"animais"},
 {word:"VACA",syllables:["VA","CA"],theme:"animais"},
 {word:"PIPA",syllables:["PI","PA"],theme:"objetos"},
 {word:"BOTA",syllables:["BO","TA"],theme:"objetos"},
 {word:"MESA",syllables:["ME","SA"],theme:"objetos"},
 {word:"SOFÁ",syllables:["SO","FÁ"],theme:"objetos"},
 {word:"DEDO",syllables:["DE","DO"],theme:"corpo"},
 {word:"DADO",syllables:["DA","DO"],theme:"objetos"},
 {word:"FADA",syllables:["FA","DA"],theme:"pessoas"},
 {word:"LATA",syllables:["LA","TA"],theme:"objetos"},
 {word:"POTE",syllables:["PO","TE"],theme:"objetos"},
 {word:"CAMA",syllables:["CA","MA"],theme:"objetos"},
 {word:"CUBO",syllables:["CU","BO"],theme:"objetos"},
 {word:"BICO",syllables:["BI","CO"],theme:"animais"},
 {word:"GIRAFA",syllables:["GI","RA","FA"],theme:"animais"},
 {word:"COELHO",syllables:["CO","E","LHO"],theme:"animais"},
 {word:"GALINHA",syllables:["GA","LI","NHA"],theme:"animais"},
 {word:"TARTARUGA",syllables:["TAR","TA","RU","GA"],theme:"animais"},
 {word:"ELEFANTE",syllables:["E","LE","FAN","TE"],theme:"animais"},
 {word:"FORMIGA",syllables:["FOR","MI","GA"],theme:"animais"},
 {word:"BORBOLETA",syllables:["BOR","BO","LE","TA"],theme:"animais"},
 {word:"CACHORRO",syllables:["CA","CHOR","RO"],theme:"animais"},
 {word:"GELATINA",syllables:["GE","LA","TI","NA"],theme:"alimentos"},
 {word:"ABÓBORA",syllables:["A","BÓ","BO","RA"],theme:"alimentos"},
 {word:"MORANGO",syllables:["MO","RAN","GO"],theme:"alimentos"},
 {word:"TOMATE",syllables:["TO","MA","TE"],theme:"alimentos"},
 {word:"CENOURA",syllables:["CE","NOU","RA"],theme:"alimentos"},
 {word:"BISCOITO",syllables:["BIS","COI","TO"],theme:"alimentos"},
 {word:"PANELA",syllables:["PA","NE","LA"],theme:"objetos"},
 {word:"CADEIRA",syllables:["CA","DEI","RA"],theme:"objetos"},
 {word:"TELEFONE",syllables:["TE","LE","FO","NE"],theme:"objetos"},
 {word:"GELADEIRA",syllables:["GE","LA","DEI","RA"],theme:"objetos"},
 {word:"CHUVEIRO",syllables:["CHU","VEI","RO"],theme:"objetos"},
 {word:"CADERNO",syllables:["CA","DER","NO"],theme:"objetos"},
 {word:"BORRACHA",syllables:["BOR","RA","CHA"],theme:"objetos"},
 {word:"TESOURA",syllables:["TE","SOU","RA"],theme:"objetos"},
 {word:"CORAÇÃO",syllables:["CO","RA","ÇÃO"],theme:"corpo"},
 {word:"CABELO",syllables:["CA","BE","LO"],theme:"corpo"},
 {word:"JOELHO",syllables:["JO","E","LHO"],theme:"corpo"},
 {word:"OMBRO",syllables:["OM","BRO"],theme:"corpo"},
 {word:"COTOVELO",syllables:["CO","TO","VE","LO"],theme:"corpo"},
 {word:"PESCOÇO",syllables:["PES","CO","ÇO"],theme:"corpo"},
 {word:"BORBOLETA",syllables:["BOR","BO","LE","TA"],theme:"animais"},
 {word:"MONTANHA",syllables:["MON","TA","NHA"],theme:"natureza"},
 {word:"FLORESTA",syllables:["FLO","RES","TA"],theme:"natureza"},
 {word:"CACHOEIRA",syllables:["CA","CHO","EI","RA"],theme:"natureza"},
 {word:"ESTRELA",syllables:["ES","TRE","LA"],theme:"natureza"},
 {word:"PLANETA",syllables:["PLA","NE","TA"],theme:"natureza"},
 {word:"BICICLETA",syllables:["BI","CI","CLE","TA"],theme:"objetos"},
 {word:"CHOCOLATE",syllables:["CHO","CO","LA","TE"],theme:"alimentos"},
 {word:"ABACATE",syllables:["A","BA","CA","TE"],theme:"alimentos"},
 {word:"MELANCIA",syllables:["ME","LAN","CI","A"],theme:"alimentos"},
 {word:"ESPELHO",syllables:["ES","PE","LHO"],theme:"objetos"},
 {word:"TRAVESSEIRO",syllables:["TRA","VES","SEI","RO"],theme:"objetos"},
 {word:"DINOSSAURO",syllables:["DI","NOS","SAU","RO"],theme:"animais"}
];
const KEY_SETTINGS="ativamente_words_settings_v1", KEY_HISTORY="ativamente_words_history_v1";
let mode="letters", queue=[], current=0, slots=[], tiles=[], selectedTile=null, selectedSlot=null, hinted=false, hintStage=0, completed=0, customWords=[], settings=loadSettings(), sessionWords=[];
function loadSettings(){try{return {...{theme:"all",custom:"",difficulty:1,wordLength:"varied",showWordAfter:true,sound:false},...JSON.parse(localStorage.getItem(KEY_SETTINGS)||"{}")}}catch{return {theme:"all",custom:"",difficulty:1,wordLength:"varied",showWordAfter:true,sound:false}}}
function getHistory(){try{return JSON.parse(localStorage.getItem(KEY_HISTORY)||"[]")}catch{return []}}
function saveHistory(item){const h=getHistory();h.unshift(item);localStorage.setItem(KEY_HISTORY,JSON.stringify(h.slice(0,300)));updateHistory()}
function showScreen(name){["homeScreen","gameScreen","settingsScreen"].forEach(id=>$(id).classList.toggle("hidden",id!==name))}
function shuffle(a){const b=[...a];for(let i=b.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));[b[i],b[j]]=[b[j],b[i]]}return b}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toLocaleUpperCase("pt-BR").replace(/[^A-Z]/g,"")}
function getPool(){
 const seenBank=new Set();
 const pool=WORDS.filter(w=>{
  const key=norm(w.word);
  if(seenBank.has(key))return false;
  seenBank.add(key);
  return settings.theme==="all"||w.theme===settings.theme;
 });
 if(settings.custom.trim()){
  const entries=settings.custom.split(/[,;\n]+/).map(s=>s.trim()).filter(Boolean);
  const seen=new Set(pool.map(w=>norm(w.word)));
  entries.forEach(raw=>{
   const display=raw.toLocaleUpperCase("pt-BR").trim();
   const key=norm(display);
   if(display.length<2||display.length>24||!key||seen.has(key))return;
   const known=WORDS.find(w=>norm(w.word)===key);
   if(known){
    pool.push({...known,custom:true});
   }else{
    pool.push({word:display,syllables:null,theme:"personalizadas",image:null,custom:true});
   }
   seen.add(key);
  });
 }
 return pool;
}
function knownSyllables(word){const known=WORDS.find(w=>norm(w.word)===norm(word));return known?known.syllables:null}
function showPictureHint(item){ return false; }
function wordsForDifficulty(pool){
 const level=Math.max(1,Math.min(10,Number(settings.difficulty)||1));
 const ranges={1:[2,3],2:[2,3],3:[3,4],4:[3,4],5:[4,5],6:[4,5],7:[5,6],8:[5,6],9:[6,24],10:[6,24]};
 const [min,max]=ranges[level];
 const lengthChoice=String(settings.wordLength||"varied");
 return pool.filter(w=>{
  const len=[...norm(w.word)].length;
  const matchesLength=lengthChoice==="varied"?true:lengthChoice==="7plus"?len>=7:len===Number(lengthChoice);
  // A escolha exata de tamanho prevalece sobre a faixa padrão do nível.
  return lengthChoice==="varied" ? (len>=min && len<=max) : matchesLength;
 });
}
function startGame(chosenMode, useCustom=false){
 mode=chosenMode; current=0;completed=0;selectedTile=null;selectedSlot=null;hinted=false;hintStage=0;
 let pool=wordsForDifficulty(getPool());
 if(mode==="syllables"){
  const unsupported=pool.filter(w=>!Array.isArray(w.syllables)||!w.syllables.length);
  if(unsupported.length){
   alert("Algumas palavras personalizadas ainda não têm divisão silábica revisada: "+unsupported.map(w=>w.word).join(", ")+". Para evitar uma divisão incorreta, use o desafio de letras ou retire essas palavras desta rodada.");
   pool=pool.filter(w=>Array.isArray(w.syllables)&&w.syllables.length);
  }
 }
 if(pool.length<10){alert(`Esta seleção tem apenas ${pool.length} palavras disponíveis. Para montar uma partida com 10 palavras, escolha “Todos os temas”, use tamanhos variados ou acrescente palavras conhecidas nas configurações.`);return}
 sessionWords=shuffle(pool).slice(0,10);
 queue=sessionWords;showScreen("gameScreen");
 $("hintBtn").classList.remove("hidden");$("clearBtn").classList.remove("hidden");
 $("checkBtn").textContent="Verificar";$("checkBtn").onclick=checkAnswer;
 renderRound();
}
function renderRound(){
 if(current>=queue.length){showSummary();return}
 const item=queue[current];const pieces=mode==="letters"?[...item.word]:item.syllables;
 slots=Array(pieces.length).fill(null);
 tiles=shuffle(pieces.map((text,i)=>({id:`${current}-${i}-${Math.random().toString(36).slice(2,7)}`,text,sourceIndex:i})));
 selectedTile=null;selectedSlot=null;hinted=false;hintStage=0;
 $("hintBtn").textContent="💡 Pista";$("hintBtn").disabled=false;
 $("roundLabel").textContent=`Nível ${settings.difficulty||1} · Palavra ${current+1} de ${queue.length}`;
 $("progressBar").style.width=`${current/queue.length*100}%`;
 $("taskTag").textContent=mode==="letters"?"DESAFIO DE LETRAS":"DESAFIO DE SÍLABAS";
 $("promptTitle").textContent=mode==="letters"?"Monte a palavra":"Organize as sílabas";
 $("promptSub").textContent=mode==="letters"?"Coloque cada letra no espaço certo.":"Coloque os blocos na ordem correta.";

 $("feedback").textContent="";$("feedback").className="feedback";
 renderSlots();renderTiles();
}
function renderSlots(){
 const box=$("answerSlots");box.innerHTML="";
 slots.forEach((tile,i)=>{
  const b=document.createElement("button");b.className="slot"+(tile?" filled":"")+(selectedSlot===i?" selected":"");b.textContent=tile?tile.text:"";b.setAttribute("aria-label",`Espaço ${i+1}${tile?", "+tile.text:" vazio"}`);b.dataset.slot=i;
  b.addEventListener("click",()=>slotClick(i));b.addEventListener("dragover",e=>e.preventDefault());b.addEventListener("drop",e=>{e.preventDefault();const id=e.dataTransfer.getData("text/plain");placeTile(id,i)});
  box.appendChild(b);
 });
}
function renderTiles(){
 const box=$("tileBank");box.innerHTML="";
 tiles.forEach(tile=>{
  const used=slots.some(x=>x&&x.id===tile.id);
  const b=document.createElement("button");b.className="tile"+(used?" used":"");b.textContent=tile.text;b.disabled=used;b.draggable=true;b.dataset.tile=tile.id;b.setAttribute("aria-label",`Peça ${tile.text}${used?", já utilizada":""}`);
  b.addEventListener("click",()=>tileClick(tile.id));b.addEventListener("dragstart",e=>{e.dataTransfer.setData("text/plain",tile.id);e.dataTransfer.effectAllowed="move"});
  box.appendChild(b);
 });
}
function tileClick(id){
 const tile=tiles.find(t=>t.id===id);if(!tile||slots.some(x=>x&&x.id===id))return;
 if(selectedSlot!==null){placeTile(id,selectedSlot);selectedSlot=null;return}
 selectedTile=id;
 $("feedback").textContent=`Peça ${tile.text} selecionada. Agora toque em um espaço vazio.`;
 renderSlots();
}
function slotClick(i){
 if(slots[i]){const removed=slots[i];slots[i]=null;selectedTile=null;selectedSlot=i;renderSlots();renderTiles();$("feedback").textContent=`Peça ${removed.text} retirada. Escolha outra peça para este espaço ou toque em outra peça.`;return}
 if(selectedTile){placeTile(selectedTile,i);selectedTile=null;selectedSlot=null;return}
 selectedSlot=i;renderSlots();$("feedback").textContent="Agora escolha uma peça.";
}
function placeTile(id,i){
 const tile=tiles.find(t=>t.id===id);if(!tile)return;
 const existing=slots.findIndex(x=>x&&x.id===id);if(existing>=0)slots[existing]=null;
 if(slots[i]){slots[i]=null}
 slots[i]=tile;selectedTile=null;selectedSlot=null;renderSlots();renderTiles();$("feedback").textContent="";
}
function clearSlots(){slots=slots.map(()=>null);selectedTile=null;selectedSlot=null;renderSlots();renderTiles();$("feedback").textContent="Você pode tentar novamente."; $("feedback").className="feedback"}
function showHint(){
 const item=queue[current];
 if(!item)return;
 hinted=true;
 let revealed=0;
 for(let n=0;n<2;n++){
  const target=slots.findIndex(value=>!value);
  if(target<0)break;
  const correctTile=tiles.find(t=>t.sourceIndex===target&&!slots.some(x=>x&&x.id===t.id));
  if(correctTile){slots[target]=correctTile;revealed++;}
 }
 selectedTile=null;selectedSlot=null;renderSlots();renderTiles();
 if(revealed===2){
  $("feedback").textContent=mode==="letters"?"Boa! Duas letras foram colocadas na ordem correta.":"Boa! Duas sílabas foram colocadas na ordem correta.";
 }else if(revealed===1){
  $("feedback").textContent=mode==="letters"?"Só falta uma posição: uma letra correta foi revelada.":"Só falta uma posição: uma sílaba correta foi revelada.";
 }else{
  $("feedback").textContent="Todas as posições já estão preenchidas. Confira a palavra!";
 }
 const allFilled=slots.every(Boolean);
 $("hintBtn").textContent=allFilled?"Pistas usadas":"💡 Outra pista";
 if(allFilled)$("hintBtn").disabled=true;
 $("feedback").className="feedback";
}
function checkAnswer(){
 if(slots.some(x=>!x)){ $("feedback").textContent="Preencha todos os espaços antes de verificar."; $("feedback").className="feedback error";return}
 const answer=slots.map(x=>x.text).join("");const item=queue[current];const correct=norm(answer)===norm(item.word);
 saveHistory({word:item.word,mode,correct,usedHint:hinted,date:new Date().toISOString(),completed:correct});
 if(correct){
  completed++;
  $("feedback").textContent=`Muito bem! Você montou ${item.word}!`; $("feedback").className="feedback success";
  if(settings.showWordAfter){$("promptTitle").textContent=item.word;$("promptSub").textContent="Você conseguiu organizar as peças!"}
  if(settings.sound) speak(item.word);
  $("progressBar").style.width=`${(current+1)/queue.length*100}%`;
  $("checkBtn").textContent=current===queue.length-1?"Ver resultado":"Próxima palavra";
  $("checkBtn").onclick=nextRound;
 }else{$("feedback").textContent="Ainda não. Revise a ordem das peças e tente novamente."; $("feedback").className="feedback error"}
}
function nextRound(){current++;$("checkBtn").textContent="Verificar";$("checkBtn").onclick=checkAnswer;renderRound()}
function showSummary(){
 $("hintBtn").classList.add("hidden");$("clearBtn").classList.add("hidden");
 $("taskTag").textContent="RODADA CONCLUÍDA";$("promptTitle").textContent="Você terminou!";$("promptSub").textContent=`Você concluiu ${completed} de ${queue.length} palavras nesta rodada.`;
 $("answerSlots").innerHTML="";$("tileBank").innerHTML="";
 $("hintBtn").classList.add("hidden");$("clearBtn").classList.add("hidden");$("checkBtn").textContent="Jogar novamente";$("checkBtn").onclick=()=>{ $("hintBtn").classList.remove("hidden");$("clearBtn").classList.remove("hidden");startGame(mode)};
 $("feedback").textContent="Continue praticando no seu ritmo."; $("feedback").className="feedback success";
 $("sessionCount").textContent=`${completed} de ${queue.length} concluídas`;
}
function speak(word){if("speechSynthesis" in window){window.speechSynthesis.cancel();const u=new SpeechSynthesisUtterance(word.toLowerCase());u.lang="pt-BR";window.speechSynthesis.speak(u)}}
function openSettings(){fillSettings();updateHistory();showScreen("settingsScreen")}
function fillSettings(){$("themeSelect").value=settings.theme||"all";$("wordInput").value=settings.custom||"";$("difficultySelect").value=String(settings.difficulty||1);$("wordLengthSelect").value=settings.wordLength||"varied";$("homeDifficultySelect").value=String(settings.difficulty||1);$("showWordAfter").checked=settings.showWordAfter!==false;$("soundToggle").checked=!!settings.sound}
function saveSettings(){settings={theme:$("themeSelect").value,custom:$("wordInput").value,difficulty:Number($("difficultySelect").value),wordLength:$("wordLengthSelect").value,showWordAfter:$("showWordAfter").checked,sound:$("soundToggle").checked};$("homeDifficultySelect").value=String(settings.difficulty);localStorage.setItem(KEY_SETTINGS,JSON.stringify(settings));$("settingsFeedback").textContent="Configurações salvas neste dispositivo.";$("settingsFeedback").className="feedback success";updateHistory()}
function updateHistory(){const h=getHistory();const words=[...new Set(h.map(x=>x.word))];$("historySummary").textContent=words.length?`${words.length} palavras registradas · ${h.length} tentativas no total.`:"Ainda não há palavras registradas."}
function backToMenu(){showScreen("homeScreen");$("checkBtn").textContent="Verificar";$("checkBtn").onclick=checkAnswer;$("hintBtn").classList.remove("hidden");$("hintBtn").textContent="💡 Pista";$("hintBtn").disabled=false;$("clearBtn").classList.remove("hidden")}
function showSummaryReset(){ $("hintBtn").classList.remove("hidden");$("clearBtn").classList.remove("hidden");startGame(mode)}
$("homeDifficultySelect").value=String(settings.difficulty||1);
$("homeDifficultySelect").addEventListener("change",()=>{settings.difficulty=Number($("homeDifficultySelect").value);$("difficultySelect").value=String(settings.difficulty);localStorage.setItem(KEY_SETTINGS,JSON.stringify(settings));});
document.querySelectorAll("[data-mode]").forEach(b=>b.addEventListener("click",()=>{settings.difficulty=Number($("homeDifficultySelect").value);localStorage.setItem(KEY_SETTINGS,JSON.stringify(settings));startGame(b.dataset.mode)}));
$("customWordsBtn").addEventListener("click",openSettings);
$("settingsBtn").addEventListener("click",openSettings);
$("settingsBackBtn").addEventListener("click",()=>showScreen("homeScreen"));
$("backBtn").addEventListener("click",backToMenu);
$("restartBtn").addEventListener("click",()=>{current=0;completed=0;$("hintBtn").classList.remove("hidden");$("clearBtn").classList.remove("hidden");$("hintBtn").disabled=false;$("checkBtn").textContent="Verificar";$("checkBtn").onclick=checkAnswer;renderRound()});
$("hintBtn").addEventListener("click",showHint);
$("clearBtn").addEventListener("click",clearSlots);
$("checkBtn").onclick=checkAnswer;
$("saveSettingsBtn").addEventListener("click",saveSettings);
$("playCustomBtn").addEventListener("click",()=>{saveSettings();startGame(mode==="syllables"?"syllables":"letters",true)});
$("clearHistoryBtn").addEventListener("click",()=>{if(confirm("Apagar o histórico de palavras deste dispositivo?")){localStorage.removeItem(KEY_HISTORY);updateHistory()}});
