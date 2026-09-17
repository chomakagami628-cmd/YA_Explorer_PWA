const $=id=>document.getElementById(id);
const urlInput=$("auctionUrl"),apiInput=$("apiUrl"),runButton=$("runButton"),statusEl=$("status"),result=$("result"),resultCard=$("resultCard");

apiInput.value=localStorage.getItem("yaExplorerApiUrl")||"";

function setStatus(message,type=""){
  statusEl.textContent=message;
  statusEl.className=`status ${type}`.trim();
}

async function copyText(text){
  try{await navigator.clipboard.writeText(text);return true;}
  catch(_){result.focus();result.select();return document.execCommand("copy");}
}

$("pasteButton").addEventListener("click",async()=>{
  try{urlInput.value=(await navigator.clipboard.readText()).trim();setStatus("");}
  catch(_){setStatus("入力欄を長押ししてURLを貼り付けてください","error");}
});

$("saveButton").addEventListener("click",()=>{
  const value=apiInput.value.trim();
  if(!/^https:\/\/script\.google\.com\/macros\/s\/.+\/exec(?:\?.*)?$/.test(value)){
    setStatus("正しいApps ScriptのウェブアプリURLを入力してください","error");return;
  }
  localStorage.setItem("yaExplorerApiUrl",value);
  setStatus("Apps Script URLを保存しました","success");
});

$("copyButton").addEventListener("click",async()=>{
  const ok=await copyText(result.value);
  setStatus(ok?"JSONをコピーしました":"コピーできませんでした",ok?"success":"error");
});

runButton.addEventListener("click",async()=>{
  const auctionUrl=urlInput.value.trim();
  const apiUrl=(localStorage.getItem("yaExplorerApiUrl")||apiInput.value).trim();
  if(!/^https:\/\/auctions\.yahoo\.co\.jp\/jp\/auction\/[A-Za-z0-9_-]+(?:[?#].*)?$/.test(auctionUrl)){
    setStatus("Yahoo!オークションの商品URLを入力してください","error");return;
  }
  if(!apiUrl){setStatus("先に「初回設定」でApps Script URLを保存してください","error");$("setupCard").querySelector("details").open=true;return;}

  runButton.disabled=true;setStatus("取得中…");
  try{
    const endpoint=`${apiUrl}${apiUrl.includes("?")?"&":"?"}url=${encodeURIComponent(auctionUrl)}`;
    const response=await fetch(endpoint,{redirect:"follow",cache:"no-store"});
    const payload=await response.json();
    if(!response.ok||!payload.ok||!payload.info)throw new Error(payload.error||"EXTRACTION_FAILED");
    const json=JSON.stringify(payload.info);
    result.value=json;resultCard.hidden=false;
    const copied=await copyText(json);
    setStatus(copied?"オークション情報を取得しました。JSONをコピーしました。":"取得しました。下のコピーボタンを押してください",copied?"success":"");
  }catch(error){console.error(error);setStatus("データの取得に失敗しました","error");}
  finally{runButton.disabled=false;}
});

if("serviceWorker" in navigator)window.addEventListener("load",()=>navigator.serviceWorker.register("sw.js"));
