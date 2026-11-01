(function () {
  'use strict';

  // خط دفاع: في حال لم يتم تحميل lang.js
  if (typeof translations === 'undefined') window.translations = { en: {}, ar: {} };

  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  // 1. بيانات المشاريع المضمنة (لضمان الظهور 100%)
  const fallbackProjects = [
    {id:1, category:"webapp", theme:"theme-1", label:"DIGA SCANNER", url:"https://ishakdiga55-ops.github.io/Diga-scaner/", titleKey:"p1_title", descKey:"p1_desc", tagKey:"p1_tag"},
    {id:2, category:"ecommerce", theme:"theme-2", label:"SCANNERPRO", url:"https://ishakdiga55-ops.github.io/ScannerPro/", titleKey:"p2_title", descKey:"p2_desc", tagKey:"p2_tag"},
    {id:3, category:"ecommerce", theme:"theme-3", label:"THE PERFUMER", url:"https://ishakdiga55-ops.github.io/The-Perfumer/", titleKey:"p3_title", descKey:"p3_desc", tagKey:"p3_tag"},
    {id:4, category:"ecommerce", theme:"theme-4", label:"DESTINATION", url:"https://ishakdiga55-ops.github.io/Destination/#features", titleKey:"p4_title", descKey:"p4_desc", tagKey:"p4_tag"},
    {id:5, category:"ecommerce", theme:"theme-5", label:"ALA KIFAK", url:"https://ishakdiga55-ops.github.io/Ala-kifak-/", titleKey:"p5_title", descKey:"p5_desc", tagKey:"p5_tag"},
    {id:6, category:"ecommerce", theme:"theme-6", label:"LAMA BEAUTY", url:"https://ishakdiga55-ops.github.io/beauty/", titleKey:"p6_title", descKey:"p6_desc", tagKey:"p6_tag"},
    {id:7, category:"ecommerce", theme:"theme-7", label:"AL-NOUR PHARMACY", url:"https://ishakdiga55-ops.github.io/Nour-Pharmacy/#order", titleKey:"p7_title", descKey:"p7_desc", tagKey:"p7_tag"},
    {id:8, category:"ecommerce", theme:"theme-8", label:"AUTO PARTS", url:"https://ishakdiga55-ops.github.io/Pi-ces-d-tach-es-automobiles/", titleKey:"p8_title", descKey:"p8_desc", tagKey:"p8_tag"},
    {id:9, category:"webapp", theme:"theme-9", label:"MINI MARKET", url:"https://ishakdiga55-ops.github.io/Mini-Market/#/merchant/m4", titleKey:"p9_title", descKey:"p9_desc", tagKey:"p9_tag"}
  ];

  let allProjects = [];

  // 2. رسم المشاريع
  function renderProjects(projects) {
    const grid = document.getElementById('projectsGrid');
    if (!grid) return;
    grid.innerHTML = '';
    
    const currentLang = document.documentElement.getAttribute('lang') || 'en';

    projects.forEach(project => {
      const title = (translations[currentLang] && translations[currentLang][project.titleKey]) || project.titleKey;
      const desc = (translations[currentLang] && translations[currentLang][project.descKey]) || project.descKey;
      const tag = (translations[currentLang] && translations[currentLang][project.tagKey]) || project.tagKey;

      const cardHTML = `
        <article class="project-card glass" data-category="${project.category}" data-project onclick="openProjectModal(${project.id})">
          <div class="project-image ${project.theme}">
            <span class="project-image-label">${project.label}</span>
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
    
    // إظهار الكروت فوراً (حل مشكلة الاختفاء)
    gsap.to('.project-card', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
  }

  async function loadProjects() {
    try {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error("JSON not found");
      allProjects = await response.json();
    } catch (e) {
      console.warn("Using fallback data due to fetch error.");
      allProjects = fallbackProjects; 
    }
    renderProjects(allProjects);
  }

  // 3. النافذة المنبثقة والتصفية
  window.openProjectModal = function(id) {
    const project = allProjects.find(p => p.id === id);
    if (!project) return;
    const lang = document.documentElement.getAttribute('lang') || 'en';
    
    const modalImg = document.getElementById('modalImage');
    modalImg.className = `modal-image ${project.theme}`;
    modalImg.innerHTML = `<span class="project-image-label">${project.label}</span>`;

    document.getElementById('modalTitle').textContent = (translations[lang] && translations[lang][project.titleKey]) || project.titleKey;
    document.getElementById('modalDesc').textContent = (translations[lang] && translations[lang][project.descKey]) || project.descKey;
    document.getElementById('modalTag').textContent = (translations[lang] && translations[lang][project.tagKey]) || project.tagKey;
    document.getElementById('modalLink').href = project.url;
    document.getElementById('projectModal').classList.add('active');
  };

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
            gsap.fromTo(card, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
          } else {
            card.style.display = 'none';
          }
        });
      });
    });
  }

  function initModal() {
    const modal = document.getElementById('projectModal');
    const closeBtn = document.getElementById('closeModal');
    if (modal && closeBtn) {
      closeBtn.addEventListener('click', () => modal.classList.remove('active'));
      modal.addEventListener('click', (e) => { if (e.target === modal) modal.classList.remove('active'); });
    }
  }

  // 4. محرك الهوك 3D (Three.js + Tilt)
  function init3DHook() {
    const card = document.getElementById('hookCard');
    const canvas = document.getElementById('hook-canvas');
    if (!card || !canvas || IS_MOBILE || PREFERS_REDUCED) return;

    // أ. تأثير الإمالة (Tilt Effect)
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      
      const rotateX = ((y - centerY) / centerY) * -15; // أقصى ميلان 15 درجة
      const rotateY = ((x - centerX) / centerX) * 15;

      card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.05)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = `rotateX(0) rotateY(0) scale(1)`;
    });

    // ب. رسم المجسم 3D داخل البطاقة
    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, card.offsetWidth / card.offsetHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    renderer.setSize(card.offsetWidth, card.offsetHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    camera.position.z = 5;

    // شكل هندسي مضيء (Torus Knot)
    const geometry = new THREE.TorusKnotGeometry(1.2, 0.4, 100, 16);
    const material = new THREE.MeshNormalMaterial({ wireframe: true, transparent: true, opacity: 0.3 });
    const knot = new THREE.Mesh(geometry, material);
    scene.add(knot);

    // إضاءة
    const light = new THREE.PointLight(0x00d9ff, 2, 10);
    light.position.set(2, 3, 4);
    scene.add(light);

    function animateHook() {
      requestAnimationFrame(animateHook);
      knot.rotation.x += 0.005;
      knot.rotation.y += 0.01;
      renderer.render(scene, camera);
    }
    animateHook();

    // تحديث الحجم عند تغيير الشاشة
    window.addEventListener('resize', () => {
      camera.aspect = card.offsetWidth / card.offsetHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(card.offsetWidth, card.offsetHeight);
    });
  }

  // 5. تهيئة عامة
  function init() {
    loadProjects();
    initFilters();
    initModal();
    init3DHook();

    // حركة دخول الهيرو
    if (!PREFERS_REDUCED) {
      gsap.from('.hero-text-side > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
    }

    window.addEventListener('languageChanged', () => {
      setTimeout(() => { renderProjects(allProjects); ScrollTrigger.refresh(); }, 100);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
