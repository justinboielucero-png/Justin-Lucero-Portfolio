/* Prelim originals gallery - no image transforms or compression */
(()=>{
 const lib=document.getElementById('prelim-library');
 const open=document.getElementById('prelim-browse');
 const collapse=document.getElementById('prelim-collapse');
 const dialog=document.getElementById('prelim-viewer');
 if(!lib||!open||!collapse||!dialog)return;
 const all=[...lib.querySelectorAll('[data-prelim-file]')];
 const filters=[...lib.querySelectorAll('[data-prelim-filter]')];
 const count=document.getElementById('prelim-count');
 const stage=document.getElementById('prelim-viewer-stage');
 const img=document.getElementById('prelim-viewer-image');
 const pdf=document.getElementById('prelim-viewer-pdf');
 const original=document.getElementById('prelim-original');
 const title=document.getElementById('prelim-viewer-title');
 const filename=document.getElementById('prelim-viewer-filename');
 const filetype=document.getElementById('prelim-viewer-filetype');
 const counter=document.getElementById('prelim-viewer-counter');
 const prev=document.getElementById('prelim-prev');
 const next=document.getElementById('prelim-next');
 const zoom=document.getElementById('prelim-zoom');
 const close=document.getElementById('prelim-viewer-close');
 let active=[],current=-1,restoreFocus=null;
 const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
 function setArchive(visible){
   lib.hidden=!visible;
   open.setAttribute('aria-expanded',String(visible));
   if(visible)lib.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
   else open.focus({preventScroll:true});
 }
 open.addEventListener('click',()=>setArchive(lib.hidden));
 collapse.addEventListener('click',()=>setArchive(false));
 if(location.hash==='#prelim-library')setArchive(true);
 function visible(){return all.filter(card=>!card.hidden)}
 function filterBy(group){
   all.forEach(card=>{card.hidden=group!=='all'&&card.dataset.group!==group});
   filters.forEach(button=>{const selected=button.dataset.prelimFilter===group;button.classList.toggle('is-active',selected);button.setAttribute('aria-pressed',String(selected))});
   count.textContent='Showing '+visible().length+' '+(visible().length===1?'file':'files');
 }
 filters.forEach(button=>button.addEventListener('click',()=>filterBy(button.dataset.prelimFilter)));
 function view(card){
   if(!card)return;
   stage.scrollTop=0;stage.scrollLeft=0;stage.classList.remove('is-zoomed');
   const src=card.dataset.src,kind=card.dataset.kind;
   const isPdf=kind==='pdf';
   img.hidden=isPdf;pdf.hidden=!isPdf;
   img.removeAttribute('src');pdf.removeAttribute('src');
   if(isPdf){pdf.title=card.dataset.title+' PDF preview';pdf.src=src+'#toolbar=1&navpanes=0'}
   else{img.alt=card.dataset.title;img.src=src}
   title.textContent=card.dataset.title;
   filename.textContent=card.dataset.filename;
   filetype.textContent=isPdf?'ORIGINAL PDF':'ORIGINAL IMAGE';
   zoom.hidden=isPdf;zoom.textContent='Zoom to actual size';
   original.href=src;
   counter.textContent=String(current+1).padStart(2,'0')+' / '+String(active.length).padStart(2,'0');
   prev.disabled=active.length<2;next.disabled=active.length<2;
 }
 function showAt(index){if(!active.length)return;current=(index+active.length)%active.length;view(active[current])}
 function show(card){
   restoreFocus=card;active=visible();current=active.indexOf(card);
   if(current<0)return;
   dialog.hidden=false;document.body.classList.add('prelim-modal-open');
   view(card);close.focus({preventScroll:true});
 }
 function dismiss(){
   dialog.hidden=true;document.body.classList.remove('prelim-modal-open');
   img.removeAttribute('src');pdf.removeAttribute('src');stage.classList.remove('is-zoomed');
   if(restoreFocus&&restoreFocus.isConnected)restoreFocus.focus({preventScroll:true});
 }
 all.forEach(card=>card.addEventListener('click',()=>show(card)));
 close.addEventListener('click',dismiss);
 dialog.querySelector('[data-prelim-close]').addEventListener('click',dismiss);
 prev.addEventListener('click',()=>showAt(current-1));next.addEventListener('click',()=>showAt(current+1));
 function toggleZoom(){if(img.hidden)return;const zoomed=stage.classList.toggle('is-zoomed');zoom.textContent=zoomed?'Fit to screen':'Zoom to actual size'}
 zoom.addEventListener('click',toggleZoom);
 img.addEventListener('click',toggleZoom);
 document.addEventListener('keydown',event=>{
   if(dialog.hidden)return;
   if(event.key==='Escape'){event.preventDefault();dismiss()}
   else if(event.key==='ArrowRight'){event.preventDefault();showAt(current+1)}
   else if(event.key==='ArrowLeft'){event.preventDefault();showAt(current-1)}
   else if(event.key==='Tab'){
     const focusable=[...dialog.querySelectorAll('a[href],button:not([disabled]):not([hidden])')].filter(el=>el.offsetParent!==null);
     if(!focusable.length)return;
     const first=focusable[0],last=focusable[focusable.length-1];
     if(event.shiftKey&&document.activeElement===first){event.preventDefault();last.focus()}
     else if(!event.shiftKey&&document.activeElement===last){event.preventDefault();first.focus()}
   }
 });
})();
