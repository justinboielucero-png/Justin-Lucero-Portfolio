const reflections={prelim:{counter:'TERM 01 — 03',title:'Prelim Term Reflection',description:'Write about the topics and experiences from your prelim term in Computer Programming 1.',prompt:'Prompt: What did I learn in the prelim term?'},midterm:{counter:'TERM 02 — 03',title:'Midterm Reflection',description:'Describe your midterm programming lessons, activities, and challenges.',prompt:'Prompt: Which midterm challenge taught me the most?'},final:{counter:'TERM 03 — 03',title:'Final Term Reflection',description:'Reflect on the final-term topics, learnings and programming activities.',prompt:'Prompt: What will I practice next?'}};const tabs=[...document.querySelectorAll('.term-tab')];function activateTab(tab,focus=false){const r=reflections[tab.dataset.term];tabs.forEach(t=>{t.classList.toggle('active',t===tab);t.setAttribute('aria-selected',String(t===tab));t.tabIndex=t===tab?0:-1;});for(const [id,value] of Object.entries({'reflection-counter':r.counter,'reflection-title':r.title,'reflection-description':r.description,'reflection-prompt':r.prompt})){const el=document.getElementById(id);if(el)el.textContent=value;}if(focus)tab.focus()}tabs.forEach((t,i)=>{t.addEventListener('click',()=>activateTab(t));t.addEventListener('keydown',e=>{let j=i;if(e.key==='ArrowRight')j=(i+1)%tabs.length;else if(e.key==='ArrowLeft')j=(i+tabs.length-1)%tabs.length;else if(e.key==='Home')j=0;else if(e.key==='End')j=tabs.length-1;else return;e.preventDefault();activateTab(tabs[j],true)})});const nav=[...document.querySelectorAll('.nav-link')];if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)nav.forEach(a=>a.classList.toggle('active',a.dataset.section===e.target.id))}),{rootMargin:'-25% 0px -60% 0px'});document.querySelectorAll('section[id]').forEach(s=>observer.observe(s))}if(window.matchMedia('(pointer:fine)').matches)window.addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mouse-x',e.clientX+'px');document.documentElement.style.setProperty('--mouse-y',e.clientY+'px')},{passive:true});const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

// Progressive reveal, subtle 3D card tilt, and pointer-reactive highlights.
(() => {
  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(hover: hover) and (pointer: fine)').matches;
  const revealTargets = document.querySelectorAll(
    '.section-overline, .hero-title, .intro-text, .primary-cta, .section-heading, .prose, .fact, .course-banner, .archive-card, .project-card, .timeline-item, .term-tabs, .reflection-panel, .contact-title, .contact-section > p'
  );

  revealTargets.forEach((element, index) => {
    element.classList.add('reveal');
    if (element.matches('.fact, .archive-card, .project-card')) {
      element.classList.add('reveal-delay-' + ((index % 3) + 1));
    }
  });

  if (!reduceMotion && 'IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -45px 0px' });
    revealTargets.forEach(element => revealObserver.observe(element));
  } else {
    revealTargets.forEach(element => element.classList.add('is-visible'));
  }

  if (finePointer && !reduceMotion) {
    const tiltCards = document.querySelectorAll('.fact, .archive-card, .project-card, .timeline-item');
    tiltCards.forEach(card => {
      card.addEventListener('pointermove', event => {
        const rect = card.getBoundingClientRect();
        const x = (event.clientX - rect.left) / rect.width;
        const y = (event.clientY - rect.top) / rect.height;
        const rotateY = (x - 0.5) * 5;
        const rotateX = (0.5 - y) * 5;
        card.style.transform = 'perspective(900px) translateY(-5px) rotateX(' + rotateX.toFixed(2) + 'deg) rotateY(' + rotateY.toFixed(2) + 'deg)';
        card.style.setProperty('--glow-x', (x * 100).toFixed(1) + '%');
        card.style.setProperty('--glow-y', (y * 100).toFixed(1) + '%');
      });
      card.addEventListener('pointerleave', () => {
        card.style.transform = '';
        card.style.removeProperty('--glow-x');
        card.style.removeProperty('--glow-y');
      });
    });

    document.querySelectorAll('.term-tab, .primary-cta').forEach(control => {
      control.addEventListener('pointermove', event => {
        const rect = control.getBoundingClientRect();
        control.style.setProperty('--glow-x', ((event.clientX - rect.left) / rect.width * 100) + '%');
        control.style.setProperty('--glow-y', ((event.clientY - rect.top) / rect.height * 100) + '%');
      });
    });
  }
})();
