(() => {
  const reduceMotion = matchMedia('(prefers-reduced-motion: reduce)');
  const video = document.getElementById('hero-video');
  const control = document.getElementById('video-control');
  let manuallyPaused = false;
  const syncVideo = () => {
    const paused = video.paused;
    document.querySelector('.hero').classList.toggle('film-paused', paused);
    control.innerHTML = paused ? 'Play film <span aria-hidden="true">▷</span>' : 'Pause film <span aria-hidden="true">Ⅱ</span>';
    control.setAttribute('aria-pressed', String(paused));
  };
  video.addEventListener('play', syncVideo);
  video.addEventListener('pause', syncVideo);
  video.addEventListener('error', () => {control.hidden = true;});
  control.addEventListener('click', () => {
    if (video.paused) {manuallyPaused = false; video.play().catch(syncVideo);}
    else {manuallyPaused = true; video.pause();}
  });
  const mediaPreference = () => {
    if (reduceMotion.matches) video.pause();
    else if (!manuallyPaused) video.play().catch(syncVideo);
  };
  reduceMotion.addEventListener('change', mediaPreference);
  mediaPreference();
  new IntersectionObserver(([entry]) => {
    document.body.classList.toggle('hero-visible',entry.isIntersecting);
    if (!entry.isIntersecting) video.pause();
    else if (!manuallyPaused && !reduceMotion.matches) video.play().catch(syncVideo);
  }, {threshold:.1}).observe(video);
  document.addEventListener('visibilitychange', () => {if(document.hidden) video.pause(); else mediaPreference();});
  const marquee = document.querySelector('.marquee');
  const original = marquee.firstElementChild;
  const track = document.createElement('div'); track.className = 'marquee-track';
  marquee.replaceChildren(track); track.append(original, original.cloneNode(true));
  if (!reduceMotion.matches && 'IntersectionObserver' in window) {
    document.body.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (entry.isIntersecting) {entry.target.classList.add('visible'); observer.unobserve(entry.target);}
    }), {threshold:.08});
    document.querySelectorAll('.intro>div,.section-head,.card,.statement h2,.enquire>div,form,.address,.gallery-photo,.faq-section>div').forEach((el,i) => {
      el.classList.add('in-view'); el.style.setProperty('--delay', `${el.classList.contains('card') ? i%3*.1 : 0}s`); observer.observe(el);
    });
  }
  const progress = document.querySelector('.scroll-progress');
  const header = document.querySelector('header');
  let ticking = false;
  const updateScroll = () => {
    const max = document.documentElement.scrollHeight - innerHeight;
    progress.style.transform = `scaleX(${max ? scrollY/max : 0})`;
    header.classList.toggle('scrolled', scrollY > 60); ticking = false;
  };
  addEventListener('scroll', () => {if (!ticking) {requestAnimationFrame(updateScroll); ticking=true;}}, {passive:true});
  addEventListener('resize',updateScroll); updateScroll();
  document.querySelectorAll('.faqs details').forEach(d => d.addEventListener('toggle', () => {
    if(d.open) document.querySelectorAll('.faqs details').forEach(other => {if(other!==d) other.open=false;});
  }));
  const photos = [
    {src:'assets/pac-studio-1.webp',alt:'A group gathered in front of the PAC Dance Studio signage',caption:'Together at PAC — studio group photograph'},
    {src:'assets/pac-studio-2.webp',alt:'Three people posing together at PAC Dance Studio',caption:'In our element — a moment at the studio'}
  ];
  const dialog=document.getElementById('photo-dialog');
  const img=document.getElementById('lightbox-img');
  let current=0; let opener=null;
  const show = index => {
    current=(index+photos.length)%photos.length; const photo=photos[current];
    img.src=photo.src; img.alt=photo.alt;
    document.getElementById('photo-caption').textContent=photo.caption;
    document.getElementById('photo-count').textContent=`0${current+1} / 0${photos.length}`;
  };
  document.querySelectorAll('.photo-open').forEach(button => button.addEventListener('click', () => {
    opener=button; show(Number(button.dataset.photo)); dialog.showModal(); document.body.classList.add('modal-open');
  }));
  const close = () => dialog.close();
  document.getElementById('photo-close').addEventListener('click',close);
  dialog.addEventListener('close',()=>{document.body.classList.remove('modal-open');opener?.focus({preventScroll:true});});
  dialog.querySelector('.photo-prev').addEventListener('click',()=>show(current-1));
  dialog.querySelector('.photo-next').addEventListener('click',()=>show(current+1));
  dialog.addEventListener('keydown',e=>{if(e.key==='ArrowRight'){e.preventDefault();show(current+1);}if(e.key==='ArrowLeft'){e.preventDefault();show(current-1);}});
  let touchX=0;
  img.addEventListener('touchstart',e=>{touchX=e.changedTouches[0].clientX;},{passive:true});
  img.addEventListener('touchend',e=>{const delta=e.changedTouches[0].clientX-touchX;if(Math.abs(delta)>50)show(current+(delta<0?1:-1));},{passive:true});
  document.querySelectorAll('.photo-open img').forEach(photo=>photo.addEventListener('error',()=>{photo.closest('button').hidden=true;}));
})();
