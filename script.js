const reflections={"prelim":{"title":"Prelim Reflection","counter":"TERM 01 — 03","paragraphs":["During the preliminary term in Computer Programming 1, I started developing my understanding of programming fundamentals and how to solve problems using logical steps. I learned about algorithms and flowcharts, which helped me understand how to organize instructions before writing an actual program. I also became familiar with the basic structure of Java, variables, data types, and input and output statements. These lessons taught me that programming is not just about writing code but also about understanding the problem and planning the correct solution.","As we moved on to more advanced topics, I learned about conditional statements and how they allow a program to make decisions depending on certain conditions. Through different activities and programming exercises, I practiced using conditions to solve problems involving grades, passwords, calculations, and other situations. At first, I sometimes struggled with understanding the correct syntax and determining which conditions to use. However, by studying examples and practicing the activities, I gradually became more comfortable with writing and understanding code.","Overall, the preliminary term helped me establish a strong foundation in programming. I realized that even simple programs require logical thinking, patience, and attention to detail. I also learned that making mistakes is part of the learning process because debugging helps me identify what went wrong and understand how to improve my code. This term encouraged me to practice more and become more confident in solving programming problems independently."]},"midterm":{"title":"Midterm Reflection","counter":"TERM 02 — 03","paragraphs":["During the midterm term in Computer Programming 1, I focused on using the programming concepts I had previously learned to solve more complex exercises and problems. I started to understand better how the different parts of a program work together, particularly when receiving user input, processing data, and displaying the expected output. I also learned that writing a program is not simply about making it run but ensuring that it performs the correct operations and produces accurate results.","One of the challenges I encountered was converting problem statements into actual Java programs. There were times when I understood what the problem required but had difficulty figuring out how to start writing the code. To overcome this, I learned to break down the problem into smaller steps and identify the variables and operations needed before coding. I also practiced tracing my programs line by line to understand how each instruction affected the final output and to identify possible errors.","Throughout this term, I realized that programming requires patience, practice, and critical thinking. Whenever my code did not produce the expected result, I learned to review my logic and check my mistakes instead of immediately giving up or rewriting everything. I also understood that being able to follow a programming example does not always mean I can solve the same problem independently. This experience taught me to focus more on understanding the logic behind every program, which helped me become more careful and confident in approaching programming activities."]},"final":{"title":"Final Term Reflection","counter":"TERM 03 — 03","paragraphs":["During the final term in Computer Programming 1, I focused on applying the programming knowledge and skills I had developed from the previous lessons to our remaining activities. I became more aware of the steps involved in solving programming problems, starting from understanding the instructions and planning the solution to writing the code, testing its output, and fixing any errors. Having a clear process helped me become more organized and systematic when working on programming tasks.","One important thing I learned during this term was the importance of checking and improving my own code. I realized that just because a program runs successfully does not necessarily mean that the solution is completely correct. I learned to review the output and compare it with the given instructions to make sure my program worked as expected. Whenever I encountered difficulties, I tried to revisit the basic programming concepts and use what I had learned to understand and correct my mistakes.","Working on my e-portfolio also gave me the chance to look back on the activities and exercises I had completed throughout the course. It allowed me to see the progress I had made, recognize the concepts I had gradually understood, and identify the areas where I still needed improvement. By the end of the final term, I realized that learning programming takes time, continuous practice, and patience. I hope to further improve my Java programming skills and become more confident in solving problems independently while making sure that I fully understand the code I write."]}};
const tabs=[...document.querySelectorAll('.term-tab')];
function activateTab(tab,focus=false){
  const reflection=reflections[tab.dataset.term];
  if(!reflection)return;
  tabs.forEach(button=>{
    const selected=button===tab;
    button.classList.toggle('active',selected);
    button.setAttribute('aria-selected',String(selected));
    button.tabIndex=selected?0:-1;
  });
  document.getElementById('reflection-counter').textContent=reflection.counter;
  document.getElementById('reflection-title').textContent=reflection.title;
  const body=document.getElementById('reflection-description');
  body.replaceChildren(...reflection.paragraphs.map(content=>{
    const paragraph=document.createElement('p');
    paragraph.textContent=content;
    return paragraph;
  }));
  document.getElementById('term-panel').setAttribute('aria-labelledby',tab.id);
  if(focus)tab.focus();
}
tabs.forEach((tab,index)=>{
  tab.addEventListener('click',()=>activateTab(tab));
  tab.addEventListener('keydown',event=>{
    let next=index;
    if(event.key==='ArrowRight')next=(index+1)%tabs.length;
    else if(event.key==='ArrowLeft')next=(index+tabs.length-1)%tabs.length;
    else if(event.key==='Home')next=0;
    else if(event.key==='End')next=tabs.length-1;
    else return;
    event.preventDefault();
    activateTab(tabs[next],true);
  });
});
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
