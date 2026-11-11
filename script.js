// Exclusive reflection accordion (native <details> stays keyboard accessible).
const reflectionEntries=[...document.querySelectorAll('#reflect details.reflection-entry')];
reflectionEntries.forEach(entry=>entry.addEventListener('toggle',()=>{
  if(entry.open) reflectionEntries.forEach(other=>{if(other!==entry&&other.open)other.open=false});
}));
const nav=[...document.querySelectorAll('.nav-link')];if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(e.isIntersecting)nav.forEach(a=>a.classList.toggle('active',a.dataset.section===e.target.id))}),{rootMargin:'-25% 0px -60% 0px'});document.querySelectorAll('section[id]').forEach(s=>observer.observe(s))}if(window.matchMedia('(pointer:fine)').matches)window.addEventListener('pointermove',e=>{document.documentElement.style.setProperty('--mouse-x',e.clientX+'px');document.documentElement.style.setProperty('--mouse-y',e.clientY+'px')},{passive:true});const year=document.getElementById('year');if(year)year.textContent=new Date().getFullYear();

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
