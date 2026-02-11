/* Smooth scrolling for nav and CTA */
document.addEventListener('DOMContentLoaded',()=>{
  // set year
  const y=document.getElementById('year'); if(y) y.textContent=new Date().getFullYear();

  // nav toggle for small screens
  const navToggle=document.querySelector('.nav-toggle');
  const nav=document.querySelector('.main-nav');
  if(navToggle && nav){
    navToggle.addEventListener('click',()=>nav.classList.toggle('open'))
  }

  // dark mode: toggle and remember preference
  const themeToggle=document.getElementById('themeToggle');
  const applyTheme=(dark)=>{
    if(dark) document.body.classList.add('dark'); else document.body.classList.remove('dark');
    if(themeToggle) themeToggle.textContent = dark? '🌙' : '🌞';
  }
  const stored = localStorage.getItem('theme');
  if(stored){ applyTheme(stored==='dark') }
  else { applyTheme(window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) }
  if(themeToggle){
    themeToggle.addEventListener('click',()=>{
      const isDark = document.body.classList.toggle('dark');
      localStorage.setItem('theme', isDark? 'dark' : 'light');
      themeToggle.textContent = isDark? '🌙' : '🌞';
    })
  }

  // smooth nav links
  document.querySelectorAll('a.nav-link, a.btn.primary[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const href=a.getAttribute('href');
      if(href&&href.startsWith('#')){
        e.preventDefault();
        document.querySelector(href).scrollIntoView({behavior:'smooth',block:'start'});
      }
    })
  })

  // active nav highlighting using IntersectionObserver
  const sections=document.querySelectorAll('main section[id]');
  const navLinks=document.querySelectorAll('.main-nav a');
  const io=new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      const id=entry.target.id;
      const link=document.querySelector('.main-nav a[href="#'+id+'"]');
      if(entry.isIntersecting){
        navLinks.forEach(l=>l.classList.remove('active'));
        if(link) link.classList.add('active');
      }
    })
  },{threshold:0.45})
  sections.forEach(s=>io.observe(s));

  // progress bars animate on view
  const bars=document.querySelectorAll('.bar');
  const pbIO=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        const el=e.target; const v=el.dataset.value||0; const span=el.querySelector('span');
        if(span) span.style.width=v+'%';
        pbIO.unobserve(el);
      }
    })
  },{threshold:0.4})
  bars.forEach(b=>pbIO.observe(b));

  // fade-in elements
  const fadeEls=document.querySelectorAll('.fade-in, .project-card, .timeline-item, .skill-card');
  const fadeIO=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){ e.target.classList.add('visible'); fadeIO.unobserve(e.target); }
    })
  },{threshold:0.15})
  fadeEls.forEach(el=>fadeIO.observe(el));

  // Contact form validation (client-side only)
  const form=document.getElementById('contactForm');
  if(form){
    form.addEventListener('submit',e=>{
      e.preventDefault();
      let valid=true;
      const name=form.name; const email=form.email; const message=form.message;
      const emailRe=/^\S+@\S+\.\S+$/;
      form.querySelectorAll('.error').forEach(el=>el.textContent='');
      if(!name.value || name.value.trim().length<2){ form.name.nextElementSibling.textContent='Please enter your name.'; valid=false }
      if(!email.value || !emailRe.test(email.value)){ form.email.nextElementSibling.textContent='Enter a valid email.'; valid=false }
      if(!message.value || message.value.trim().length<10){ form.message.nextElementSibling.textContent='Message is too short.'; valid=false }
      const msg=document.getElementById('formMsg');
      if(!valid){ if(msg){ msg.textContent='Please fix errors above.'; msg.classList.add('show'); setTimeout(()=>msg.classList.remove('show'),3000) } ; return }
      // pretend to send
      if(msg){ msg.textContent='Message sent — thanks! (demo only)'; msg.classList.add('show'); setTimeout(()=>msg.classList.remove('show'),4000); form.reset() }
    })
  }
});
