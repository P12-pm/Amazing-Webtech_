/* ============================================
   AMAZING WEBTECH - ALL SERVICE PAGES
   Shared JavaScript
   ============================================ */
'use strict';

/* ---- Utilities ---- */
const $  = (s,c=document) => c.querySelector(s);
const $$ = (s,c=document) => [...c.querySelectorAll(s)];
const deb = (fn,ms) => { let t; return (...a)=>{ clearTimeout(t); t=setTimeout(()=>fn(...a),ms); }; };
const thr = (fn,ms) => { let last=0; return (...a)=>{ const n=Date.now(); if(n-last>=ms){last=n;fn(...a);} }; };

/* ============================================
   PAGE LOADER
   ============================================ */
(function(){
  const loader = document.createElement('div');
  loader.id = 'svc-loader';
  Object.assign(loader.style, {
    position:'fixed', inset:'0',
    background:'#0a0a0f', zIndex:'999999',
    display:'flex', alignItems:'center',
    justifyContent:'center', flexDirection:'column', gap:'1.5rem',
    transition:'opacity 0.6s ease, visibility 0.6s ease',
    fontFamily:"'Poppins',sans-serif"
  });

  const pageName = document.title.split(' - ')[0] || 'Amazing WebTech';

  loader.innerHTML = `
    <div style="font-size:1.6rem;font-weight:700;
      background:linear-gradient(135deg,#6c63ff,#ff6584);
      -webkit-background-clip:text;-webkit-text-fill-color:transparent;
      background-clip:text;letter-spacing:-0.5px;">${pageName}</div>
    <div style="width:180px;height:2px;background:rgba(255,255,255,0.08);border-radius:999px;overflow:hidden;">
      <div id="ld-bar" style="height:100%;width:0%;background:linear-gradient(90deg,#6c63ff,#ff6584);border-radius:999px;transition:width 0.05s linear;"></div>
    </div>
    <div style="font-size:0.65rem;letter-spacing:3px;text-transform:uppercase;color:rgba(255,255,255,0.25);">Loading...</div>
  `;
  document.body.prepend(loader);

  let p = 0;
  const bar = loader.querySelector('#ld-bar');
  const iv = setInterval(()=>{
    p += Math.random() * 14;
    if(p >= 100){ p=100; clearInterval(iv); }
    if(bar) bar.style.width = p + '%';
  }, 70);

  window.addEventListener('load', ()=>{
    setTimeout(()=>{
      loader.style.opacity='0'; loader.style.visibility='hidden';
      setTimeout(()=>{ loader.remove(); initReveal(); }, 600);
    }, 1200);
  });
})();

/* ============================================
   SCROLL PROGRESS
   ============================================ */
function initScrollProgress(){
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  document.body.prepend(bar);
  window.addEventListener('scroll', thr(()=>{
    const sc = window.scrollY;
    const tot = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (tot > 0 ? sc/tot*100 : 0) + '%';
  }, 16), {passive:true});
}

/* ============================================
   NAVBAR
   ============================================ */
function initNavbar(){
  const nav    = $('#navbar');
  const toggle = $('#menuToggle');
  const links  = $('#navLinks');
  const close  = $('#closeMenu');
  const overlay= $('#overlay');
  const dds    = $$('.dropdown');
  let open = false;

  if(!nav) return;

  // Scroll
  const onScroll = thr(()=>{ nav.classList.toggle('scrolled', window.scrollY > 60); }, 50);
  window.addEventListener('scroll', onScroll, {passive:true});
  onScroll();

  function openMenu(){
    open = true;
    links?.classList.add('active');
    toggle?.classList.add('active');
    overlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    $$('li', links).forEach((li,i)=>{
      li.style.cssText = 'opacity:0;transform:translateX(25px)';
      setTimeout(()=>{
        li.style.cssText = `transition:opacity 0.35s ease ${i*0.07}s,transform 0.35s ease ${i*0.07}s;opacity:1;transform:none`;
      }, 40);
    });
  }
  function closeMenu(){
    open = false;
    links?.classList.remove('active');
    toggle?.classList.remove('active');
    overlay?.classList.remove('active');
    document.body.style.overflow = '';
    dds.forEach(d=>d.classList.remove('open'));
  }

  toggle?.addEventListener('click', ()=> open ? closeMenu() : openMenu());
  close?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);

  dds.forEach(dd=>{
    const dt = $('.dropdown-toggle', dd);
    dt?.addEventListener('click', e=>{
      if(window.innerWidth >= 992) return;
      e.preventDefault(); e.stopPropagation();
      dds.forEach(d=>{ if(d!==dd) d.classList.remove('open'); });
      dd.classList.toggle('open');
    });
  });

  document.addEventListener('click', e=>{
    if(!e.target.closest('.dropdown')) dds.forEach(d=>d.classList.remove('open'));
  });

  $$('li > a:not(.dropdown-toggle)', links).forEach(a=>{
    a.addEventListener('click', ()=>{ if(window.innerWidth<992) closeMenu(); });
  });

  document.addEventListener('keydown', e=>{
    if(e.key==='Escape'){ if(open){closeMenu();toggle?.focus();} dds.forEach(d=>d.classList.remove('open')); }
  });

  window.addEventListener('resize', deb(()=>{ if(window.innerWidth>=992 && open) closeMenu(); }, 200));
}

/* ============================================
   HERO ORBS + PARALLAX
   ============================================ */
function initHeroFX(){
  const hero = $('.service-hero');
  if(!hero) return;

  // Create orbs
  ['hero-orb-1','hero-orb-2','hero-orb-3'].forEach(cls=>{
    const orb = document.createElement('div');
    orb.className = `hero-orb ${cls}`;
    hero.appendChild(orb);
  });

  // Scroll hint
  const sh = document.createElement('div');
  sh.className = 'scroll-hint';
  sh.innerHTML = `<div class="scroll-mouse"><div class="scroll-wheel"></div></div><span>Scroll</span>`;
  hero.appendChild(sh);

  // Mouse parallax
  if(window.matchMedia('(hover:hover)').matches){
    hero.addEventListener('mousemove', thr(e=>{
      const {innerWidth:W,innerHeight:H} = window;
      const x = (e.clientX - W/2)/W;
      const y = (e.clientY - H/2)/H;
      $$('.hero-orb', hero).forEach((o,i)=>{
        const d = (i+1)*18;
        o.style.transform = `translate(${x*d}px,${y*d}px)`;
        o.style.transition = 'transform 0.3s ease';
      });
    }, 20));
  }
}

/* ============================================
   SCROLL REVEAL
   ============================================ */
function initReveal(){
  const targets = [
    '.overview-left','overview-right',
    '.feature-card','.benefit-row','.benefits-box',
    '.process-card','.price-card','.testi-card',
    '.related-card','.tool-chip','.faq-item',
    '.section-head','.cta-band-inner',
    '.stats-row','.img-wrap'
  ];

  targets.forEach(sel=>{
    $$(sel).forEach((el,i)=>{
      if(el.closest('.rev,.rev-l,.rev-r,.rev-z')) return;
      el.classList.add('rev');
      el.style.transitionDelay = `${i * 0.07}s`;
    });
  });

  $$('.overview-left').forEach(el=>{el.classList.remove('rev');el.classList.add('rev-l');});
  $$('.overview-right').forEach(el=>{el.classList.remove('rev');el.classList.add('rev-r');});
  $$('.img-wrap').forEach(el=>{el.classList.remove('rev');el.classList.add('rev-z');});

  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(en.isIntersecting){ en.target.classList.add('in'); obs.unobserve(en.target); }
    });
  },{threshold:0.08, rootMargin:'0px 0px -50px 0px'});

  $$('.rev,.rev-l,.rev-r,.rev-z').forEach(el=>obs.observe(el));
}

/* ============================================
   STAT COUNTERS
   ============================================ */
function initCounters(){
  const els = $$('.stat-num[data-count]');
  if(!els.length) return;

  const done = new Set();
  const obs = new IntersectionObserver(entries=>{
    entries.forEach(en=>{
      if(!en.isIntersecting || done.has(en.target)) return;
      done.add(en.target);
      const el = en.target;
      const raw = el.getAttribute('data-count');
      const suffix = raw.replace(/[\d.]/g,'');
      const target = parseFloat(raw);
      const dur = 2000, fps = 60, steps = dur/1000*fps;
      let step = 0;
      const iv = setInterval(()=>{
        step++;
        const p = step/steps;
        const e = 1 - Math.pow(1-p, 3);
        const cur = e * target;
        el.textContent = (Number.isInteger(target) ? Math.round(cur).toLocaleString() : cur.toFixed(1)) + suffix;
        if(step >= steps){ clearInterval(iv); el.textContent = raw; }
      }, 1000/fps);
    });
  },{threshold:0.4});

  els.forEach(el=>obs.observe(el));
}

/* ============================================
   FAQ ACCORDION
   ============================================ */
function initFAQ(){
  $$('.faq-item').forEach(item=>{
    const q = $('.faq-q', item);
    if(!q) return;
    q.addEventListener('click', ()=>{
      const isOpen = item.classList.contains('open');
      $$('.faq-item').forEach(i=>i.classList.remove('open'));
      if(!isOpen) item.classList.add('open');
    });
  });
}

/* ============================================
   TILT EFFECT
   ============================================ */
function initTilt(){
  if(!window.matchMedia('(hover:hover)').matches) return;
  $$('.feature-card,.related-card,.testi-card,.price-card').forEach(card=>{
    card.addEventListener('mousemove', thr(e=>{
      const r = card.getBoundingClientRect();
      const x = e.clientX-r.left, y = e.clientY-r.top;
      const cx = r.width/2, cy = r.height/2;
      const rx = ((y-cy)/cy)*-6, ry = ((x-cx)/cx)*6;
      card.style.transform = `translateY(-6px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`;
      card.style.transition = 'transform 0.08s ease';
    },25));
    card.addEventListener('mouseleave', ()=>{
      card.style.transform = '';
      card.style.transition = 'all 0.4s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
}

/* ============================================
   MAGNETIC BUTTONS
   ============================================ */
function initMagnetic(){
  if(!window.matchMedia('(hover:hover)').matches) return;
  $$('.btn-primary-grad,.btn-outline-white,.btn-hero-primary,.btn-hero-outline').forEach(btn=>{
    btn.addEventListener('mousemove', e=>{
      const r = btn.getBoundingClientRect();
      const x = e.clientX-r.left-r.width/2;
      const y = e.clientY-r.top-r.height/2;
      btn.style.transform = `translate(${x*0.25}px,${y*0.25}px)`;
      btn.style.transition = 'transform 0.08s ease';
    });
    btn.addEventListener('mouseleave', ()=>{
      btn.style.transform = '';
      btn.style.transition = 'all 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
    // Ripple
    btn.addEventListener('click', e=>{
      const r = btn.getBoundingClientRect();
      const size = Math.max(r.width,r.height)*2;
      const x = e.clientX-r.left-size/2;
      const y = e.clientY-r.top-size/2;
      const rpl = document.createElement('span');
      rpl.style.cssText = `
        position:absolute;width:${size}px;height:${size}px;
        left:${x}px;top:${y}px;background:rgba(255,255,255,0.2);
        border-radius:50%;transform:scale(0);
        animation:rpl 0.6s ease-out;pointer-events:none;
      `;
      if(!$('#rpl-style')){
        const s = document.createElement('style');
        s.id = 'rpl-style';
        s.textContent = '@keyframes rpl{to{transform:scale(1);opacity:0;}}';
        document.head.appendChild(s);
      }
      btn.style.position='relative'; btn.style.overflow='hidden';
      btn.appendChild(rpl);
      setTimeout(()=>rpl.remove(), 600);
    });
  });
}

/* ============================================
   BACK TO TOP
   ============================================ */
function initBTT(){
  const btn = document.createElement('button');
  btn.id = 'btt';
  btn.setAttribute('aria-label','Back to top');
  btn.innerHTML = '<i class="fas fa-chevron-up"></i>';
  document.body.appendChild(btn);
  window.addEventListener('scroll', thr(()=> btn.classList.toggle('vis', window.scrollY>400),100),{passive:true});
  btn.addEventListener('click', ()=> window.scrollTo({top:0,behavior:'smooth'}));
}

/* ============================================
   NEWSLETTER FORM
   ============================================ */
function initNewsletter(){
  $$('.newsletter-wrap').forEach(wrap=>{
    const input = $('input[type="email"]', wrap);
    const btn = $('button', wrap);
    if(!input||!btn) return;
    const form = input.closest('form') || wrap;
    const handler = async e=>{
      e.preventDefault();
      if(!input.value || !input.checkValidity()){
        input.style.borderColor='rgba(255,101,132,0.6)';
        input.focus();
        setTimeout(()=>input.style.borderColor='',2000);
        return;
      }
      const orig = btn.textContent;
      btn.textContent='Subscribing...'; btn.disabled=true;
      await new Promise(r=>setTimeout(r,1500));
      btn.textContent='✓ Subscribed!';
      btn.style.background='linear-gradient(135deg,#43e97b,#00d2ff)';
      input.value='';
      setTimeout(()=>{ btn.textContent=orig; btn.style.background=''; btn.disabled=false; },3500);
    };
    form.addEventListener('submit', handler);
  });
}

/* ============================================
   TOOL CHIPS HOVER WAVE
   ============================================ */
function initToolChips(){
  const chips = $$('.tool-chip');
  chips.forEach((chip,i)=>{
    chip.addEventListener('mouseenter', ()=>{
      chips.forEach((c,j)=>{
        const d = Math.abs(j-i);
        setTimeout(()=>{
          c.style.transform = `translateY(${d===0?-4:-1}px) scale(${d===0?1.05:1.01})`;
          setTimeout(()=>c.style.transform='',300);
        },d*40);
      });
    });
  });
}

/* ============================================
   SMOOTH ANCHOR SCROLL
   ============================================ */
function initSmoothScroll(){
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click', e=>{
      const target = $(a.getAttribute('href'));
      if(!target) return;
      e.preventDefault();
      target.scrollIntoView({behavior:'smooth',block:'start'});
    });
  });
}

/* ============================================
   CURSOR (Desktop)
   ============================================ */
function initCursor(){
  if(window.matchMedia('(hover:none)').matches) return;
  const cur = document.createElement('div');
  const fol = document.createElement('div');
  Object.assign(cur.style, {
    position:'fixed',width:'10px',height:'10px',background:'#6c63ff',
    borderRadius:'50%',pointerEvents:'none',zIndex:'99999',
    transform:'translate(-50%,-50%)',mixBlendMode:'exclusion',
    transition:'width 0.3s,height 0.3s,background 0.3s'
  });
  Object.assign(fol.style, {
    position:'fixed',width:'36px',height:'36px',
    border:'2px solid rgba(108,99,255,0.5)',
    borderRadius:'50%',pointerEvents:'none',zIndex:'99998',
    transform:'translate(-50%,-50%)',
    transition:'width 0.3s,height 0.3s,border-color 0.3s'
  });
  document.body.append(cur,fol);

  let mx=0,my=0,fx=0,fy=0;
  document.addEventListener('mousemove', e=>{ mx=e.clientX;my=e.clientY; cur.style.left=mx+'px';cur.style.top=my+'px'; });
  (function follow(){ fx+=(mx-fx)*0.1; fy+=(my-fy)*0.1; fol.style.left=fx+'px'; fol.style.top=fy+'px'; requestAnimationFrame(follow); })();

  $$('a,button,.feature-card,.related-card,.testi-card,.price-card,.tool-chip,.faq-q').forEach(el=>{
    el.addEventListener('mouseenter',()=>{ cur.style.width='18px';cur.style.height='18px'; fol.style.width='55px';fol.style.height='55px'; fol.style.borderColor='rgba(108,99,255,0.8)'; });
    el.addEventListener('mouseleave',()=>{ cur.style.width='10px';cur.style.height='10px'; fol.style.width='36px';fol.style.height='36px'; fol.style.borderColor='rgba(108,99,255,0.5)'; });
  });
}

/* ============================================
   PARTICLE CANVAS
   ============================================ */
function initParticles(){
  const hero = $('.service-hero');
  if(!hero) return;

  const canvas = document.createElement('canvas');
  canvas.style.cssText='position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:1;opacity:0.45;';
  hero.appendChild(canvas);

  const ctx = canvas.getContext('2d');
  let pts=[], af;

  function resize(){
    canvas.width=hero.offsetWidth; canvas.height=hero.offsetHeight;
    const n = Math.floor(canvas.width*canvas.height/13000);
    pts = Array.from({length:n},()=>({
      x:Math.random()*canvas.width, y:Math.random()*canvas.height,
      vx:(Math.random()-0.5)*0.35, vy:(Math.random()-0.5)*0.35,
      r:Math.random()*1.4+0.4, o:Math.random()*0.35+0.1,
      c:Math.random()>0.5?'108,99,255':'255,101,132'
    }));
  }

  function draw(){
    ctx.clearRect(0,0,canvas.width,canvas.height);
    pts.forEach(p=>{
      p.x+=p.vx; p.y+=p.vy;
      if(p.x<0)p.x=canvas.width; if(p.x>canvas.width)p.x=0;
      if(p.y<0)p.y=canvas.height; if(p.y>canvas.height)p.y=0;
      ctx.beginPath(); ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle=`rgba(${p.c},${p.o})`; ctx.fill();
    });
    for(let i=0;i<pts.length-1;i++){
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<90){ ctx.beginPath(); ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y); ctx.strokeStyle=`rgba(108,99,255,${0.07*(1-d/90)})`; ctx.lineWidth=0.5; ctx.stroke(); }
      }
    }
    af=requestAnimationFrame(draw);
  }

  resize(); draw();
  window.addEventListener('resize', deb(resize,300));
  document.addEventListener('visibilitychange',()=>{ if(document.hidden)cancelAnimationFrame(af); else draw(); });
}

/* ============================================
   ACTIVE NAV LINK
   ============================================ */
function initActiveNav(){
  const cur = window.location.pathname.split('/').pop();
  $$('.nav-links li > a').forEach(a=>{
    const href = a.getAttribute('href')?.split('/').pop();
    if(href && href===cur){
      a.style.color='var(--primary-light)';
      a.style.background='rgba(108,99,255,0.1)';
      a.style.borderRadius='var(--r-full)';
    }
  });
}

/* ============================================
   INIT ALL
   ============================================ */
document.addEventListener('DOMContentLoaded', ()=>{
  initScrollProgress();
  initNavbar();
  initHeroFX();
  initFAQ();
  initTilt();
  initMagnetic();
  initBTT();
  initNewsletter();
  initToolChips();
  initSmoothScroll();
  initActiveNav();
  initCursor();
  setTimeout(initCounters, 800);
  setTimeout(initParticles, 1800);
  setTimeout(initReveal,    1600);
  console.log('%c✅ Service Page Ready — Amazing WebTech','color:#6c63ff;font-size:1rem;font-weight:700;');
});

document.addEventListener('visibilitychange',()=>{
  document.querySelectorAll('[style*="animation"]').forEach(el=>{
    el.style.animationPlayState = document.hidden ? 'paused' : 'running';
  });
});