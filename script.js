/* ============================================
   GSAP CONFIGURATION & INITIALIZATION
   ============================================ */

gsap.registerPlugin(ScrollTrigger);

/* ============================================
   CUSTOM CURSOR
   ============================================ */

const cursor = document.querySelector('.cursor');
let mouseX = 0;
let mouseY = 0;
let cursorX = 0;
let cursorY = 0;

document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
});

function animateCursor() {
    cursorX += (mouseX - cursorX) * 0.2;
    cursorY += (mouseY - cursorY) * 0.2;
    
    cursor.style.left = cursorX + 'px';
    cursor.style.top = cursorY + 'px';
    
    requestAnimationFrame(animateCursor);
}

animateCursor();

// Hide cursor on mobile
if (window.innerWidth < 768) {
    cursor.style.display = 'none';
}

/* ============================================
   THREE.JS BACKGROUND SETUP
   ============================================ */

const canvas = document.getElementById('canvas');
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);
renderer.setClearColor(0x050505, 0);

camera.position.z = 50;

// Create floating wireframe sphere
const geometrySphere = new THREE.IcosahedronGeometry(20, 4);
const materialSphere = new THREE.MeshPhongMaterial({
    color: 0x00d9ff,
    emissive: 0x00d9ff,
    wireframe: true,
    emissiveIntensity: 0.3,
});
const sphere = new THREE.Mesh(geometrySphere, materialSphere);
scene.add(sphere);

// Create rotating torus
const geometryTorus = new THREE.TorusGeometry(30, 3, 16, 100);
const materialTorus = new THREE.MeshPhongMaterial({
    color: 0x22ff88,
    emissive: 0x22ff88,
    wireframe: true,
    emissiveIntensity: 0.2,
});
const torus = new THREE.Mesh(geometryTorus, materialTorus);
torus.rotation.x = 0.5;
torus.rotation.z = 0.8;
scene.add(torus);

// Lighting
const lightCyan = new THREE.PointLight(0x00d9ff, 2, 100);
lightCyan.position.set(30, 30, 30);
scene.add(lightCyan);

const lightGreen = new THREE.PointLight(0x22ff88, 1.5, 100);
lightGreen.position.set(-30, -30, 30);
scene.add(lightGreen);

const ambientLight = new THREE.AmbientLight(0xffffff, 0.1);
scene.add(ambientLight);

// Animation loop
function animateThree() {
    requestAnimationFrame(animateThree);
    
    sphere.rotation.x += 0.0005;
    sphere.rotation.y += 0.0008;
    
    torus.rotation.x += 0.0003;
    torus.rotation.y += 0.0005;
    torus.rotation.z += 0.0007;
    
    renderer.render(scene, camera);
}

animateThree();

// Handle window resize
window.addEventListener('resize', () => {
    const width = window.innerWidth;
    const height = window.innerHeight;
    
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);
});

/* ============================================
   GSAP SCROLL ANIMATIONS
   ============================================ */

// Hero section animations
gsap.timeline()
    .from('.hero h1', {
        duration: 1,
        y: 100,
        opacity: 0,
        ease: 'power3.out'
    }, 0)
    .from('.hero p', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out'
    }, 0.2)
    .from('.hero .btn-neon', {
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        stagger: 0.2
    }, 0.4);

// Project cards stagger animation on scroll
const projectCards = document.querySelectorAll('.project-card');

projectCards.forEach((card, index) => {
    gsap.from(card, {
        scrollTrigger: {
            trigger: card,
            start: 'top 80%',
            end: 'top 20%',
            scrub: false,
            markers: false
        },
        duration: 0.8,
        y: 50,
        opacity: 0,
        ease: 'power3.out',
        delay: index * 0.15
    });
});

// About section animation
gsap.from('.about .glass', {
    scrollTrigger: {
        trigger: '.about',
        start: 'top 70%',
        end: 'top 30%',
        scrub: false
    },
    duration: 1,
    y: 60,
    opacity: 0,
    ease: 'power3.out'
});

// Skill badges stagger animation
const skillBadges = document.querySelectorAll('.skill-badge');

skillBadges.forEach((badge, index) => {
    gsap.from(badge, {
        scrollTrigger: {
            trigger: '.about',
            start: 'top 60%',
            end: 'top 20%',
            scrub: false
        },
        duration: 0.6,
        y: 40,
        opacity: 0,
        ease: 'back.out(1.7)',
        delay: index * 0.08
    });
});

// Footer animation
gsap.from('.footer h2', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 70%',
        end: 'top 30%',
        scrub: false
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: 'power3.out'
});

gsap.from('.footer p, .footer .btn-neon', {
    scrollTrigger: {
        trigger: '.footer',
        start: 'top 70%',
        end: 'top 30%',
        scrub: false
    },
    duration: 0.8,
    y: 50,
    opacity: 0,
    ease: 'power3.out',
    stagger: 0.2,
    delay: 0.2
});

/* ============================================
   SMOOTH SCROLL FOR ANCHOR LINKS
   ============================================ */

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            
            const target = document.querySelector(href);
            const offset = 80;
            const targetPosition = target.offsetTop - offset;
            
            gsap.to(window, {
                duration: 1,
                scrollTo: {
                    y: targetPosition,
                    autoKill: true
                },
                ease: 'power2.inOut'
            });
        }
    });
});

/* ============================================
   INTERACTIVE HOVER EFFECTS
   ============================================ */

// Project card hover glow effect
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            y: -10,
            ease: 'power2.out'
        });
    });
    
    card.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            y: 0,
            ease: 'power2.out'
        });
    });
});

// Button hover effects
const buttons = document.querySelectorAll('.btn-neon');

buttons.forEach(button => {
    button.addEventListener('mouseenter', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1.05,
            ease: 'back.out(1.7)'
        });
    });
    
    button.addEventListener('mouseleave', function() {
        gsap.to(this, {
            duration: 0.3,
            scale: 1,
            ease: 'back.out(1.7)'
        });
    });
});

/* ============================================
   PARALLAX EFFECT ON SCROLL
   ============================================ */

gsap.to(sphere, {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1,
        markers: false
    },
    rotationX: Math.PI * 2,
    rotationY: Math.PI * 2,
    ease: 'none'
});

/* ============================================
   SCROLL-TRIGGERED BACKGROUND ANIMATION
   ============================================ */

gsap.to(canvas, {
    scrollTrigger: {
        trigger: 'body',
        start: 'top top',
        end: 'bottom bottom',
        scrub: 1
    },
    opacity: 0.6,
    ease: 'none'
});

/* ============================================
   PERFORMANCE OPTIMIZATION
   ============================================ */

// Reduce animation complexity on lower-end devices
const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

if (prefersReducedMotion) {
    gsap.globalTimeline.timeScale(0);
    document.documentElement.style.scrollBehavior = 'auto';
}

// Disable Three.js on mobile for better performance
if (window.innerWidth < 768) {
    renderer.dispose();
    canvas.style.display = 'none';
}

/* ============================================
   PAGE LOAD ANIMATION
   ============================================ */

window.addEventListener('load', () => {
    gsap.to('body', {
        duration: 0.5,
        opacity: 1,
        ease: 'power2.out'
    });
});

/* ============================================
   INTERSECTION OBSERVER FOR ADDITIONAL EFFECTS
   ============================================ */

const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('in-view');
            
            if (entry.target.classList.contains('skill-badge')) {
                gsap.to(entry.target, {
                    duration: 0.6,
                    background: 'rgba(0, 217, 255, 0.15)',
                    boxShadow: '0 0 30px rgba(0, 217, 255, 0.6)',
                    ease: 'power2.out'
                });
            }
        }
    });
}, observerOptions);

// Observe skill badges and project cards
skillBadges.forEach(badge => observer.observe(badge));
projectCards.forEach(card => observer.observe(card));

/* ============================================
   CURSOR GLOW EFFECT ON HOVER
   ============================================ */

document.addEventListener('mouseenter', () => {
    gsap.to(cursor, {
        duration: 0.3,
        scale: 1.5,
        boxShadow: '0 0 30px rgba(0, 217, 255, 0.8)',
        ease: 'power2.out'
    });
});

document.addEventListener('mouseleave', () => {
    gsap.to(cursor, {
        duration: 0.3,
        scale: 1,
        boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
        ease: 'power2.out'
    });
});

// Interactive button hover cursor effect
buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
        gsap.to(cursor, {
            duration: 0.2,
            scale: 2,
            boxShadow: '0 0 40px rgba(0, 217, 255, 1)',
            ease: 'power2.out'
        });
    });
    
    button.addEventListener('mouseleave', () => {
        gsap.to(cursor, {
            duration: 0.2,
            scale: 1,
            boxShadow: '0 0 20px rgba(0, 217, 255, 0.5)',
            ease: 'power2.out'
        });
    });
});

/* ============================================
   STAGGERED TEXT REVEAL (Optional Enhancement)
   ============================================ */

function staggerTextReveal(element) {
    if (!element) return;
    
    const text = element.innerText;
    const chars = text.split('').map(char => {
        const span = document.createElement('span');
        span.innerText = char;
        span.style.display = 'inline-block';
        span.style.opacity = '0';
        return span;
    });
    
    element.innerText = '';
    chars.forEach(char => element.appendChild(char));
    
    gsap.to(chars, {
        duration: 0.05,
        opacity: 1,
        stagger: 0.03,
        ease: 'power2.out'
    });
}

/* ============================================
   EXPORT FUNCTIONS FOR EXTERNAL USE
   ============================================ */

window.scrollToSection = function(sectionId) {
    const element = document.querySelector(sectionId);
    if (element) {
        gsap.to(window, {
            duration: 1,
            scrollTo: element,
            ease: 'power2.inOut'
        });
    }
};

/* ============================================
   CONSOLE MESSAGE (BRANDING)
   ============================================ */

console.log(
    '%cCreative Developer Portfolio',
    'color: #00d9ff; font-size: 24px; font-weight: bold; text-shadow: 0 0 10px #00d9ff;'
);
console.log(
    '%cBuilt with HTML5, Tailwind CSS, GSAP & Three.js',
    'color: #22ff88; font-size: 14px;'
);
