(function () {
  'use strict';

  if (typeof translations === 'undefined') window.translations = { en: {}, ar: {} };

  const IS_MOBILE = window.matchMedia('(max-width: 768px)').matches;
  const PREFERS_REDUCED = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

  const fallbackProjects = [
    {id:1, category:"webapp", theme:"theme-1", label:"DIGA SCANNER", url:"https://ishakdiga55-ops.github.io/Diga-scaner/", titleKey:"p1_title", descKey:"p1_desc", tagKey:"p1_tag"},
    {id:2, category:"ecommerce", theme:"theme-2", label:"SCANNERPRO", url:"https://ishakdiga55-ops.github.io/ScannerPro/", titleKey:"p2_title", descKey:"p2_desc", tagKey:"p2_tag"},
    {id:3, category:"ecommerce", theme:"theme-3", label:"THE PERFUMER", url:"https://ishakdiga55-ops.github.io/The-Perfumer/", titleKey:"p3_title", descKey:"p3_desc", tagKey:"p3_tag"},
    {id:4, category:"ecommerce", theme:"theme-4", label:"DESTINATION", url:"https://ishakdiga55-ops.github.io/Destination/#features", titleKey:"p4_title", descKey:"p4_desc", tagKey:"p4_tag"},
    {id:5, category:"ecommerce", theme:"theme-5", label:"ALA KIFAK", url:"https://ishakdiga55-ops.github.io/Ala-kifak-/", titleKey:"p5_title", descKey:"p5_desc", tagKey:"p5_tag"},
    {id:6, category:"ecommerce", theme:"theme-6", label:"LAMA BEAUTY", url:"https://ishakdiga55-ops.github.io/beauty/", titleKey:"p6_title", descKey:"p6_desc", tagKey:"p6_tag"},
    {id:7, category:"ecommerce", theme:"theme-7", label:"AL-NOUR PHARMACY", url:"https://ishakdiga55-ops.github.io/Nour-Pharmacy/#order", titleKey:"p7_title", descKey:"p7_desc", tagKey:"p7_tag"},
    {id:8, category:"ecommerce", theme:"theme-8", label:"AUTO PARTS", url:"https://ishakdiga55-ops.github.io/Pi-ces-d-tach-es-automobiles/", titleKey:"p8_title", descKey:"p8_desc", tagKey:"p8_tag"},
    {id:9, category:"webapp", theme:"theme-9", label:"MINI MARKET", url:"https://ishakdiga55-ops.github.io/Mini-Market/#/merchant/m4", titleKey:"p9_title", descKey:"p9_desc", tagKey:"p9_tag"},
    {id:10, category:"webapp", theme:"theme-10", label:"BIPLI CASHIER", url:"https://bipli-1.onrender.com/cashier/", titleKey:"p10_title", descKey:"p10_desc", tagKey:"p10_tag"},
    {id:11, category:"webapp", theme:"theme-11", label:"L'EQUIPE DU PROGRES", url:"https://ishakdiga55-ops.github.io/L-quipe-du-progr-s/#", titleKey:"p11_title", descKey:"p11_desc", tagKey:"p11_tag"}
  ];

  let allProjects = [];

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
    
    gsap.to('.project-card', { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: 'power2.out' });
  }

  async function loadProjects() {
    try {
      const response = await fetch('projects.json');
      if (!response.ok) throw new Error("JSON not found");
      allProjects = await response.json();
    } catch (e) {
      console.warn("Using fallback data.");
      allProjects = fallbackProjects; 
    }
    renderProjects(allProjects);
  }

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

  function init3DHook() {
    const card = document.getElementById('hookCard');
    const canvas = document.getElementById('hook-canvas');
    if (!card || !canvas || PREFERS_REDUCED) return;

    if (!IS_MOBILE) {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;
        card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
      });
      card.addEventListener('mouseleave', () => { card.style.transform = `rotateX(0) rotateY(0) scale(1)`; });
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(50, card.offsetWidth / card.offsetHeight, 0.1, 100);
    const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
    
    camera.position.set(0, 0, 8);

    function updateSize() {
      const w = card.offsetWidth; const h = card.offsetHeight;
      if (w > 0 && h > 0) {
        renderer.setSize(w, h);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
      }
    }
    updateSize();
    setTimeout(updateSize, 200);

    const particleCount = 70;
    const radius = 2.5;
    const positions = [];
    const velocities = [];

    for (let i = 0; i < particleCount; i++) {
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos((Math.random() * 2) - 1);
      const r = radius * Math.cbrt(Math.random());
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      positions.push(new THREE.Vector3(x, y, z));
      velocities.push(new THREE.Vector3((Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01, (Math.random()-0.5)*0.01));
    }

    const pointsGeometry = new THREE.BufferGeometry().setFromPoints(positions);
    const pointsMaterial = new THREE.PointsMaterial({
      color: 0x00d9ff, size: 0.12, transparent: true, opacity: 0.9, blending: THREE.AdditiveBlending
    });
    const pointsMesh = new THREE.Points(pointsGeometry, pointsMaterial);
    scene.add(pointsMesh);

    const lineGeometry = new THREE.BufferGeometry();
    const linePositions = [];
    const maxDistance = 1.8; 
    for (let i = 0; i < particleCount; i++) {
      for (let j = i + 1; j < particleCount; j++) {
        const dist = positions[i].distanceTo(positions[j]);
        if (dist < maxDistance) {
          linePositions.push(positions[i].x, positions[i].y, positions[i].z);
          linePositions.push(positions[j].x, positions[j].y, positions[j].z);
        }
      }
    }
    
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
    const lineMaterial = new THREE.LineBasicMaterial({
      color: 0x22ff88, transparent: true, opacity: 0.15, blending: THREE.AdditiveBlending
    });
    const linesMesh = new THREE.LineSegments(lineGeometry, lineMaterial);
    scene.add(linesMesh);

    const light = new THREE.PointLight(0x00d9ff, 2, 20); light.position.set(5, 5, 5); scene.add(light);

    const neuralGroup = new THREE.Group();
    neuralGroup.add(pointsMesh);
    neuralGroup.add(linesMesh);
    scene.add(neuralGroup);

    function animateHook() {
      requestAnimationFrame(animateHook);
      neuralGroup.rotation.y += 0.003;
      neuralGroup.rotation.x += 0.001;
      renderer.render(scene, camera);
    }
    animateHook();

    window.addEventListener('resize', updateSize);
  }

  function init() {
    loadProjects();
    initFilters();
    initModal();
    init3DHook();

    if (!PREFERS_REDUCED) {
      gsap.from('.hero-text-side > *', { y: 30, opacity: 0, duration: 0.8, stagger: 0.15, ease: 'power3.out' });
      gsap.from('.hook-card-wrapper', { x: 50, opacity: 0, duration: 1, ease: 'power3.out', delay: 0.3 });
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