(function () {
  'use strict';

  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  let allProjects = [];

  // 1. جلب بيانات المشاريع من JSON
  async function fetchAndRenderProjects() {
    try {
      const response = await fetch('projects.json');
      allProjects = await response.json();
      renderProjects(allProjects);
      initProjectReveals(); 
    } catch (error) {
      console.error("Error loading projects:", error);
    }
  }

  // 2. رسم الكروت ديناميكياً
  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const currentLang = document.documentElement.getAttribute('lang') || 'en';

    projects.forEach(project => {
      const title = translations[currentLang][project.titleKey] || project.titleKey;
      const desc = translations[currentLang][project.descKey] || project.descKey;
      const tag = translations[currentLang][project.tagKey] || project.tagKey;
      const btnText = translations[currentLang]['modal_visit'] || 'View Project';

      const cardHTML = `
        <article class="project-card glass" data-category="${project.category}" onclick="openProjectModal(${project.id})">
          <div class="project-image">
            <img src="${project.image}" alt="${title}" class="project-img-real" loading="lazy" />
          </div>
          <div class="project-overlay">
            <div class="project-tag">${tag}</div>
            <h3 class="project-title">${title}</h3>
            <p class="project-description">${desc}</p>
            <span class="btn-neon project-button">Quick View</span>
          </div>
        </article>
      `;
      grid.insertAdjacentHTML('beforeend', cardHTML);
    });
  }

  // 3. نظام التصفية (Filters)
  function initFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        
        const filterValue = btn.getAttribute('data-filter');
        const cards = document.querySelectorAll('.project-card');
        
        cards.forEach(card => {
          if (filterValue === 'all' || card.getAttribute('data-category') === filterValue) {
            card.style.display = 'block';
            gsap.fromTo(card, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.5 });
          } else {
            card.style.display = 'none';
          }
        });
        ScrollTrigger.refresh();
      });
    });
  }

  // 4. النافذة المنبثقة (Modal)
  window.openProjectModal = function(id) {
    const project = allProjects.find(p => p.id === id);
    if (!project) return;
    
    const currentLang = document.documentElement.getAttribute('lang') || 'en';
    const title = translations[currentLang][project.titleKey] || project.titleKey;
    const desc = translations[currentLang][project.descKey] || project.descKey;
    const tag = translations[currentLang][project.tagKey] || project.tagKey;

    document.getElementById('modalImage').src = project.image;
    document.getElementById('modalTitle').textContent = title;
    document.getElementById('modalDesc').textContent = desc;
    document.getElementById('modalTag').textContent = tag;
    document.getElementById('modalLink').href = project.url;

    const modal = document.getElementById('projectModal');
    modal.classList.add('active');
  };

  function initModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeModal');
    if (!modal || !closeBtn) return;

    closeBtn.addEventListener('click', () => modal.classList.remove('active'));
    modal.addEventListener('click', (e) => {
      if (e.target === modal) modal.classList.remove('active');
    });
  }

  // 5. المؤشر (Cursor)
  function initCursor() {
    if (IS_MOBILE || PREFERS_REDUCED) return;
    const cursor = document.getElementById('cursor');
    if (!cursor) return;
    let mx = 0, my = 0, cx = 0, cy = 0;
    window.addEventListener('mousemove', (e) => { mx = e.clientX; my = e.clientY; });
    function loop() {
      cx += (mx - cx) * 0.2; cy += (my - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();
    const interactive = document.querySelectorAll('a, button, .project-card, .skill-badge');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => gsap.to(cursor, { scale: 1.8, duration: 0.25, ease: 'power2.out' }));
      el.addEventListener('mouseleave', () => gsap.to(cursor, { scale: 1, duration: 0.25, ease: 'power2.out' }));
    });
  }

  // 6. الخلفية 3D (Three.js) - تم إصلاح خطأ الإضاءة
  function initThreeJS() {
    if (IS_MOBILE || PREFERS_REDUCED) return;
    if (typeof THREE === 'undefined') return;
    const canvas = document.getElementById('canvas');
    if (!canvas) return;
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x050505, 0);
    camera.position.z = 50;

    const sphere = new THREE.Mesh(
      new THREE.IcosahedronGeometry(20, 4),
      new THREE.MeshPhongMaterial({ color: 0x00d9ff, emissive: 0x00d9ff, wireframe: true, emissiveIntensity: 0.3 })
    );
    scene.add(sphere);

    const torus = new THREE.Mesh(
      new THREE.TorusGeometry(30, 3, 16, 100),
      new THREE.MeshPhongMaterial({ color: 0x22ff88, emissive: 0x22ff88, wireframe: true, emissiveIntensity: 0.2 })
    );
    torus.rotation.set(0.5, 0, 0.8);
    scene.add(torus);

    const light1 = new THREE.PointLight(0x00d9ff, 2, 100); light1.position.set(30, 30, 30); scene.add(light1);
    const light2 = new THREE.PointLight(0x22ff88, 1.5, 100); light2.position.set(-30, -30, 30); scene.add(light2);
    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    let rafId = null;
    let running = true;

    function animate() {
      if (!running) return;
      rafId = requestAnimationFrame(animate);
      sphere.rotation.x += 0.0005; sphere.rotation.y += 0.0008;
      torus.rotation.x += 0.0003; torus.rotation.y += 0.0005; torus.rotation.z += 0.0007;
      renderer.render(scene, camera);
    }
    animate();

    gsap.to(sphere.rotation, {
      x: Math.PI * 2, y: Math.PI * 2, ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
    });

    window.addEventListener('resize', () => {
      const w = window.innerWidth; const h = window.innerHeight;
      if (w < 768) { running = false; if (rafId) cancelAnimationFrame(rafId); canvas.style.display = 'none'; return; }
      canvas.style.display = 'block'; if (!running) { running = true; animate(); }
      camera.aspect = w / h; camera.updateProjectionMatrix(); renderer.setSize(w, h);
    });
  }

  // 7. حركات الظهور (GSAP Reveals)
  function initHeroAnimation() {
    if (PREFERS_REDUCED) return;
    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero-badge', { y: -20, opacity: 0, duration: 0.6 })
      .from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.6 }, '-=0.3')
      .from('.hero-title', { y: 60, opacity: 0, duration: 1 }, '-=0.4')
      .from('.hero-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-actions .btn-neon', { y: 30, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.4')
      .from('.scroll-down', { opacity: 0, duration: 0.6 }, '-=0.2');
  }

  function initProjectReveals() {
    if (PREFERS_REDUCED) return;
    gsap.utils.toArray('[data-project]').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0, y: 40, duration: 0.9, ease: 'power3.out', delay: (i % 2) * 0.1,
        scrollTrigger: { trigger: card, start: 'top 90%', toggleActions: 'play none none none' },
      });
    });
  }

  function initSectionReveals() {
    if (PREFERS_REDUCED) return;
    gsap.from('.about-card', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.about', start: 'top 75%' } });
    gsap.from('.skill-badge', { y: 30, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(1.6)', scrollTrigger: { trigger: '.skills-list', start: 'top 85%' } });
    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.from(title, { y: 40, opacity: 0, duration: 0.9, ease: 'power3.out', scrollTrigger: { trigger: title, start: 'top 88%' } });
    });
    gsap.from('.footer-title', { y: 50, opacity: 0, duration: 1, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 75%' } });
    gsap.from('.footer-sub, .footer .btn-neon', { y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out', scrollTrigger: { trigger: '.footer', start: 'top 75%' } });
  }

  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;
        const target = document.querySelector(href);
        if (!target) return;
        e.preventDefault();
        gsap.to(window, { duration: 1, ease: 'power2.inOut', scrollTo: { y: target, offsetY: 80, autoKill: true } });
      });
    });
  }

  function initButtonHover() {
    if (PREFERS_REDUCED) return;
    document.querySelectorAll('.btn-neon').forEach((btn) => {
      btn.addEventListener('mouseenter', () => gsap.to(btn, { scale: 1.05, duration: 0.25, ease: 'power2.out' }));
      btn.addEventListener('mouseleave', () => gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' }));
    });
  }

  // 8. التهيئة الرئيسية
  function init() {
    initCursor();
    initThreeJS();
    initHeroAnimation();
    initSectionReveals();
    initSmoothScroll();
    initButtonHover();
    initModal();
    initFilters();
    
    fetchAndRenderProjects(); // بناء المشاريع ديناميكياً

    window.addEventListener('languageChanged', () => {
      setTimeout(() => {
        renderProjects(allProjects); // إعادة رسم المشاريع لترجمة النصوص الجديدة
        ScrollTrigger.refresh();
      }, 150);
    });

    window.addEventListener('load', () => {
      if (typeof ScrollTrigger !== 'undefined') ScrollTrigger.refresh();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
