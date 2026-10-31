/* ============================================
   PORTFOLIO — UNIFIED SCRIPT (JS + Language)
   ============================================ */

const translations = {
  en: {
    hero_eyebrow: "Front-End Developer — Portfolio 2025",
    hero_title: "I BUILD<br><span class='neon-glow'>DIGITAL EXPERIENCES</span>",
    hero_sub: "Front-End Developer specializing in interactive 3D and high-end web design. Crafting pixel-perfect interfaces with cutting-edge technologies.",
    btn_view_work: "View My Work",
    btn_get_touch: "Get In Touch",
    sec_projects: "Featured Work",
    sec_projects_sub: "Selected projects that showcase my expertise",
    p1_title: "Diga Scanner",
    p1_desc: "Diagnostics platform for vehicle fault tuning — manipulating both software and hardware layers.",
    p2_title: "ScannerPro",
    p2_desc: "High-conversion product landing page built to sell — sharp layout, strong typography, sales-focused flow.",
    p3_title: "The Perfumer",
    p3_desc: "Elegant perfume store with refined motion and premium product presentation.",
    p4_title: "Destination",
    p4_desc: "Modern phones landing page with a clean product-first layout and smooth browsing experience.",
    btn_view_live: "View Live ↗",
    sec_about: "Skills & Expertise",
    about_text: "I specialize in building immersive web experiences that blend aesthetics with functionality. With expertise in modern frontend technologies and a keen eye for design, I transform concepts into interactive digital products that captivate and engage users.",
    footer_title: "Let's Work Together",
    footer_sub: "Have a project in mind? I'd love to discuss how we can create something extraordinary.",
    footer_btn: "Send Me An Email",
    footer_rights: "© 2025 Creative Developer. All rights reserved."
  },
  ar: {
    hero_eyebrow: "مطور واجهات أمامية - ملف أعمال 2025",
    hero_title: "أقوم ببناء<br><span class='neon-glow'>تجارب رقمية</span>",
    hero_sub: "مطور واجهات أمامية متخصص في تصميم مواقع الويب التفاعلية ثلاثية الأبعاد والراقية. أصمم واجهات دقيقة للغاية باستخدام أحدث التقنيات.",
    btn_view_work: "عرض أعمالي",
    btn_get_touch: "تواصل معنا",
    sec_projects: "أعمال مختارة",
    sec_projects_sub: "مشاريع تبرز خبراتي ومهاراتي",
    p1_title: "ديجا سكانر",
    p1_desc: "منصة تشخيص لتعديل أعطال السيارات — التحكم في طبقات البرمجيات والعتاد.",
    p2_title: "سكانر برو",
    p2_desc: "صفحة هبوط احترافية لبيع المنتجات — تصميم حاد، طباعة قوية، وتركيز على المبيعات.",
    p3_title: "العطار",
    p3_desc: "متجر عطور أنيق مع حركات بصرية راقية وعرض متميز للمنتجات.",
    p4_title: "الوجهة",
    p4_desc: "صفحة هبوط حديثة للهواتف المحمولة بتصميم نظيف يركز على المنتج وتجربة تصفح سلسة.",
    btn_view_live: "زيارة الموقع ↗",
    sec_about: "المهارات والخبرات",
    about_text: "أركز في عملي على بناء تجارب ويب تفاعلية تجمع بين الجمال والوظائف العملية. بفضل خبرتي في تقنيات الواجهة الأمامية الحديثة ونظرتي الثاقبة للتصميم، أحوّل الأفكار إلى منتجات رقمية تفاعلية تجذب المستخدمين وتُحفّزهم على التفاعل.",
    footer_title: "لنعمل معاً",
    footer_sub: "هل لديك مشروع في ذهنك؟ أود أن نناقش كيف يمكننا إنشاء شيء استثنائي.",
    footer_btn: "أرسل لي بريداً إلكترونياً",
    footer_rights: "© 2025 مطور مبدع. جميع الحقوق محفوظة."
  }
};

(function () {
  'use strict';

  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // تفعيل مكتبات GSAP
  if (typeof gsap !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);
  }

  /* -------------------------------------------
     1. LANGUAGE TOGGLE LOGIC
  ------------------------------------------- */
  function initLanguage() {
    const langToggle = document.getElementById('langToggle');
    if (!langToggle) {
      console.warn("Language toggle button not found!");
      return;
    }

    let currentLang = 'en';
    try {
      currentLang = localStorage.getItem('site-lang') || 'en';
    } catch (e) {
      console.warn("LocalStorage disabled, defaulting to en");
    }

    function applyLanguage(lang) {
      // تغيير اتجاه الصفحة
      document.documentElement.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
      document.documentElement.setAttribute('lang', lang);
      
      // تغيير نص الزر
      langToggle.textContent = lang === 'ar' ? 'English' : 'عربي';

      // تحديث النصوص
      document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        if (translations[lang] && translations[lang][key]) {
          el.innerHTML = translations[lang][key];
        }
      });

      // تحديث GSAP
      if (typeof ScrollTrigger !== 'undefined') {
        setTimeout(() => ScrollTrigger.refresh(), 150);
      }
    }

    applyLanguage(currentLang);

    langToggle.addEventListener('click', (e) => {
      e.preventDefault();
      currentLang = currentLang === 'en' ? 'ar' : 'en';
      try { localStorage.setItem('site-lang', currentLang); } catch(e) {}
      applyLanguage(currentLang);
    });
  }

  /* -------------------------------------------
     2. CUSTOM CURSOR
  ------------------------------------------- */
  function initCursor() {
    if (IS_MOBILE || PREFERS_REDUCED) return;

    const cursor = document.getElementById('cursor');
    if (!cursor) return;

    let mx = 0, my = 0, cx = 0, cy = 0;

    window.addEventListener('mousemove', (e) => {
      mx = e.clientX;
      my = e.clientY;
    });

    function loop() {
      cx += (mx - cx) * 0.2;
      cy += (my - cy) * 0.2;
      cursor.style.transform = `translate(${cx}px, ${cy}px) translate(-50%, -50%)`;
      requestAnimationFrame(loop);
    }
    loop();

    const interactive = document.querySelectorAll('a, button, .project-card, .skill-badge');
    interactive.forEach((el) => {
      el.addEventListener('mouseenter', () => {
        gsap.to(cursor, { scale: 1.8, duration: 0.25, ease: 'power2.out' });
      });
      el.addEventListener('mouseleave', () => {
        gsap.to(cursor, { scale: 1, duration: 0.25, ease: 'power2.out' });
      });
    });
  }

  /* -------------------------------------------
     3. THREE.JS BACKGROUND
  ------------------------------------------- */
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

    const lightCyan = new THREE.PointLight(0x00d9ff, 2, 100);
    lightCyan.position.set(30, 30, 30);
    scene.add(lightCyan);

    const lightGreen = new THREE.PointLight(0x22ff88, 1.5, 100);
    lightGreen.position.set(-30, -30, 30);
    scene.add(lightGreen);

    scene.add(new THREE.AmbientLight(0xffffff, 0.1));

    let rafId = null;
    let running = true;

    function animate() {
      if (!running) return;
      rafId = requestAnimationFrame(animate);
      sphere.rotation.x += 0.0005;
      sphere.rotation.y += 0.0008;
      torus.rotation.x += 0.0003;
      torus.rotation.y += 0.0005;
      torus.rotation.z += 0.0007;
      renderer.render(scene, camera);
    }
    animate();

    gsap.to(sphere.rotation, {
      x: Math.PI * 2,
      y: Math.PI * 2,
      ease: 'none',
      scrollTrigger: { trigger: document.body, start: 'top top', end: 'bottom bottom', scrub: 1 },
    });

    window.addEventListener('resize', () => {
      const w = window.innerWidth;
      const h = window.innerHeight;

      if (w < 768) {
        running = false;
        if (rafId) cancelAnimationFrame(rafId);
        canvas.style.display = 'none';
        return;
      }

      canvas.style.display = 'block';
      if (!running) { running = true; animate(); }

      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

  /* -------------------------------------------
     4. HERO INTRO ANIMATION
  ------------------------------------------- */
  function initHeroAnimation() {
    if (PREFERS_REDUCED) return;

    const tl = gsap.timeline({ defaults: { ease: 'power3.out' } });
    tl.from('.hero .eyebrow', { y: 20, opacity: 0, duration: 0.6 })
      .from('.hero-title', { y: 60, opacity: 0, duration: 1 }, '-=0.3')
      .from('.hero-sub', { y: 30, opacity: 0, duration: 0.8 }, '-=0.5')
      .from('.hero-actions .btn-neon', { y: 30, opacity: 0, duration: 0.6, stagger: 0.15 }, '-=0.4');
  }

  /* -------------------------------------------
     5. SCROLL REVEAL — PROJECT CARDS
  ------------------------------------------- */
  function initProjectReveals() {
    if (PREFERS_REDUCED) return;

    gsap.utils.toArray('[data-project]').forEach((card, i) => {
      gsap.from(card, {
        opacity: 0,
        y: 40,
        duration: 0.9,
        ease: 'power3.out',
        delay: (i % 2) * 0.1,
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none none',
        },
      });
    });
  }

  /* -------------------------------------------
     6. SCROLL REVEAL — SECTIONS
  ------------------------------------------- */
  function initSectionReveals() {
    if (PREFERS_REDUCED) return;

    gsap.from('.about-card', {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.about', start: 'top 75%' },
    });

    gsap.from('.skill-badge', {
      y: 30, opacity: 0, duration: 0.6, stagger: 0.06, ease: 'back.out(1.6)',
      scrollTrigger: { trigger: '.skills-list', start: 'top 85%' },
    });

    gsap.utils.toArray('.section-title').forEach((title) => {
      gsap.from(title, {
        y: 40, opacity: 0, duration: 0.9, ease: 'power3.out',
        scrollTrigger: { trigger: title, start: 'top 88%' },
      });
    });

    gsap.from('.footer-title', {
      y: 50, opacity: 0, duration: 1, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 75%' },
    });

    gsap.from('.footer-sub, .footer .btn-neon', {
      y: 30, opacity: 0, duration: 0.7, stagger: 0.15, ease: 'power3.out',
      scrollTrigger: { trigger: '.footer', start: 'top 75%' },
    });
  }

  /* -------------------------------------------
     7. SMOOTH SCROLL
  ------------------------------------------- */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((link) => {
      link.addEventListener('click', (e) => {
        const href = link.getAttribute('href');
        if (!href || href === '#') return;

        const target = document.querySelector(href);
        if (!target) return;

        e.preventDefault();

        gsap.to(window, {
          duration: 1,
          ease: 'power2.inOut',
          scrollTo: { y: target, offsetY: 80, autoKill: true },
        });
      });
    });
  }

  /* -------------------------------------------
     8. BUTTON MICRO-INTERACTIONS
  ------------------------------------------- */
  function initButtonHover() {
    if (PREFERS_REDUCED) return;

    document.querySelectorAll('.btn-neon').forEach((btn) => {
      btn.addEventListener('mouseenter', () => {
        gsap.to(btn, { scale: 1.05, duration: 0.25, ease: 'power2.out' });
      });
      btn.addEventListener('mouseleave', () => {
        gsap.to(btn, { scale: 1, duration: 0.25, ease: 'power2.out' });
      });
    });
  }

  /* -------------------------------------------
     9. INIT ON LOAD
  ------------------------------------------- */
  function init() {
    initLanguage(); 
    initCursor();
    initThreeJS();
    initHeroAnimation();
    initProjectReveals();
    initSectionReveals();
    initSmoothScroll();
    initButtonHover();

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