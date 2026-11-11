/* Computer Programming 1 original media archives.
   One accessible viewer is shared by Prelim, Midterm, and Finals. */
(()=>{
  const dialog=document.getElementById('prelim-viewer');
  if(!dialog)return;
  const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const termConfigs=[
    {term:'PRELIM',id:'prelim',data:'data-prelim-file',filter:'data-prelim-filter'},
    {term:'MIDTERM',id:'midterm',data:'data-midterm-file',filter:'data-midterm-filter'},
    {term:'FINALS',id:'finals',data:'data-finals-file',filter:null}
  ];
  const galleries=termConfigs.map(t=>({
    ...t,
    lib:document.getElementById(t.id+'-library'),
    open:document.getElementById(t.id+'-browse'),
    collapse:document.getElementById(t.id+'-collapse'),
    count:document.getElementById(t.id+'-count')
  }));
  if(galleries.some(g=>!g.lib||!g.open||!g.collapse))return;
  galleries.forEach(g=>{
    g.items=[...g.lib.querySelectorAll('['+g.data+']')];
    g.filters=g.filter?[...g.lib.querySelectorAll('['+g.filter+']')]:[];
  });
  const blenderItems=[...document.querySelectorAll('[data-blender-file]')];
  const all=[...galleries.flatMap(g=>g.items),...blenderItems];
  const kicker=dialog.querySelector('.prelim-viewer-kicker');
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
  if([kicker,stage,img,pdf,original,title,filename,filetype,counter,prev,next,zoom,close].some(x=>!x))return;
  let active=[],current=-1,restoreFocus=null;
  function setArchive(g,shown){
    galleries.forEach(other=>{
      const visible=other===g&&shown;
      other.lib.hidden=!visible;
      other.open.setAttribute('aria-expanded',String(visible));
    });
    if(shown)g.lib.scrollIntoView({behavior:reduced?'auto':'smooth',block:'start'});
    else g.open.focus({preventScroll:true});
  }
  for(const g of galleries){
    g.open.addEventListener('click',()=>setArchive(g,g.lib.hidden));
    g.collapse.addEventListener('click',()=>setArchive(g,false));
    for(const button of g.filters){
      button.addEventListener('click',()=>{
        const group=button.getAttribute(g.filter);
        g.items.forEach(card=>{card.hidden=group!=='all'&&card.dataset.group!==group});
        g.filters.forEach(item=>{
          const selected=item===button;
          item.classList.toggle('is-active',selected);
          item.setAttribute('aria-pressed',String(selected));
        });
        const shown=g.items.filter(card=>!card.hidden).length;
        if(g.count)g.count.textContent='Showing '+shown+' '+(shown===1?'file':'files');
      });
    }
  }
  const deepLink=galleries.find(g=>location.hash==='#'+g.id+'-library');
  if(deepLink)setArchive(deepLink,true);
  function visible(){
    return all.filter(card=>{
      const library=card.closest('.prelim-library');
      return !card.hidden&&(!library||!library.hidden);
    });
  }
  function view(card){
    if(!card)return;
    stage.scrollTop=0;stage.scrollLeft=0;stage.classList.remove('is-zoomed');
    const src=card.dataset.src,kind=card.dataset.kind;
    const isPdf=kind==='pdf';
    img.hidden=isPdf;pdf.hidden=!isPdf;
    img.removeAttribute('src');pdf.removeAttribute('src');
    if(isPdf){pdf.title=card.dataset.title+' PDF preview';pdf.src=src+'#toolbar=1&navpanes=0'}
    else{img.alt=card.dataset.title;img.src=src}
    const gallery=galleries.find(g=>g.items.includes(card));
    kicker.textContent=card.hasAttribute('data-blender-file')?'BLENDER / CREATIVE WORK':(gallery?gallery.term:'COURSEWORK')+' / FILE VIEWER';
    title.textContent=card.dataset.title;
    filename.textContent=card.dataset.filename;
    filetype.textContent=isPdf?'ORIGINAL PDF':'ORIGINAL IMAGE';
    zoom.hidden=isPdf;zoom.textContent='Zoom to actual size';
    original.href=card.dataset.original||src;
    counter.textContent=String(current+1).padStart(2,'0')+' / '+String(active.length).padStart(2,'0');
    prev.disabled=active.length<2;next.disabled=active.length<2;
  }
  function showAt(index){
    if(!active.length)return;
    current=(index+active.length)%active.length;
    view(active[current]);
  }
  function show(card){
    restoreFocus=card;
    active=card.hasAttribute('data-blender-file')?blenderItems:visible().filter(item=>!item.hasAttribute('data-blender-file'));
    current=active.indexOf(card);
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
  prev.addEventListener('click',()=>showAt(current-1));
  next.addEventListener('click',()=>showAt(current+1));
  function toggleZoom(){
    if(img.hidden)return;
    const zoomed=stage.classList.toggle('is-zoomed');
    zoom.textContent=zoomed?'Fit to screen':'Zoom to actual size';
  }
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
