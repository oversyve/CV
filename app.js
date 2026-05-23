document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // 1. INICIALIZACIONES GLOBALES
    // ==========================================================================
    initNavbar();
    initMobileNav();
    initTypedTitle();
    initCanvasBackground();
    initScrollReveal();
    initCertificates();
    initPhotoModal();
    initContactForm();
    initSpeedDial();
});

// ==========================================================================
// 2. NAV & MENÚ MÓVIL
// ==========================================================================
function initNavbar() {
    const navbar = document.getElementById('navbar');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    // Cambiar fondo de navbar al hacer scroll
    window.addEventListener('scroll', () => {
        if (window.scrollY > 55) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
        
        // Active state en links basado en scroll
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - 280)) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').slice(1) === current) {
                link.classList.add('active');
            }
        });
    });
}

function initMobileNav() {
    const toggle = document.getElementById('mobile-nav-toggle');
    const sidebar = document.getElementById('sidebar');
    const overlay = document.getElementById('sidebar-overlay');
    const links = document.querySelectorAll('.sidebar-links .nav-link');

    function openSidebar() {
        sidebar.classList.add('active');
        overlay.classList.add('active');
        toggle.innerHTML = '<i class="fa-solid fa-xmark"></i>';
        toggle.setAttribute('aria-expanded', 'true');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.remove('active');
        overlay.classList.remove('active');
        toggle.innerHTML = '<i class="fa-solid fa-bars"></i>';
        toggle.setAttribute('aria-expanded', 'false');
        document.body.style.overflow = '';
    }

    toggle.addEventListener('click', () => {
        if (sidebar.classList.contains('active')) {
            closeSidebar();
        } else {
            openSidebar();
        }
    });

    // Cerrar al hacer clic en overlay
    overlay.addEventListener('click', closeSidebar);

    // Cerrar al hacer clic en un enlace
    links.forEach(link => {
        link.addEventListener('click', () => {
            if (window.innerWidth <= 1024) {
                closeSidebar();
            }
        });
    });

    // Cerrar si se amplía la pantalla
    window.addEventListener('resize', () => {
        if (window.innerWidth > 1024) {
            closeSidebar();
            document.body.style.overflow = '';
        }
    });
}

// ==========================================================================
// 3. EFECTO DE ESCRITURA EN HERO (TYPED TITLE)
// ==========================================================================
function initTypedTitle() {
    const titleEl = document.getElementById('typed-title');
    if (!titleEl) return; // El elemento fue reemplazado por texto estático

    const words = [
        'Data Scientist',
        'Data Analyst',
        'Agentic AI Orchestrator'
    ];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    let delay = 150;

    function type() {
        const currentWord = words[wordIndex];
        
        if (isDeleting) {
            charIndex--;
            delay = 60;
        } else {
            charIndex++;
            delay = 140;
        }

        titleEl.textContent = currentWord.substring(0, charIndex);

        if (!isDeleting && charIndex === currentWord.length) {
            isDeleting = true;
            delay = 2500; 
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            wordIndex = (wordIndex + 1) % words.length;
            delay = 500;
        }

        setTimeout(type, delay);
    }

    type();
}

// ==========================================================================
// 4. FONDO INTERACTIVO DE PARTICULAS (CANVAS EJECUTIVO Y SUTIL)
// ==========================================================================
function initCanvasBackground() {
    const canvas = document.getElementById('canvas-bg');
    const ctx = canvas.getContext('2d');
    
    let particlesArray = [];
    let numberOfParticles = 35; // Menos partículas para mayor sobriedad
    
    if (window.innerWidth < 768) {
        numberOfParticles = 15;
    }

    const mouse = {
        x: null,
        y: null,
        radius: 100
    };

    function resizeCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    resizeCanvas();
    window.addEventListener('resize', () => {
        resizeCanvas();
        particlesArray = [];
        initParticles();
    });

    window.addEventListener('mousemove', (e) => {
        mouse.x = e.clientX;
        mouse.y = e.clientY;
    });

    window.addEventListener('mouseout', () => {
        mouse.x = null;
        mouse.y = null;
    });

    class Particle {
        constructor(x, y, directionX, directionY, size, color) {
            this.x = x;
            this.y = y;
            this.directionX = directionX;
            this.directionY = directionY;
            this.size = size;
            this.color = color;
        }

        draw() {
            ctx.beginPath();
            ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2, false);
            ctx.fillStyle = this.color;
            ctx.fill();
        }

        update() {
            if (this.x > canvas.width || this.x < 0) {
                this.directionX = -this.directionX;
            }
            if (this.y > canvas.height || this.y < 0) {
                this.directionY = -this.directionY;
            }

            // Movimiento respecto al mouse (muy suave)
            if (mouse.x !== null && mouse.y !== null) {
                let dx = mouse.x - this.x;
                let dy = mouse.y - this.y;
                let distance = Math.sqrt(dx * dx + dy * dy);
                if (distance < mouse.radius + this.size) {
                    if (mouse.x < this.x && this.x < canvas.width - this.size * 5) {
                        this.x += 0.5;
                    }
                    if (mouse.x > this.x && this.x > this.size * 5) {
                        this.x -= 0.5;
                    }
                    if (mouse.y < this.y && this.y < canvas.height - this.size * 5) {
                        this.y += 0.5;
                    }
                    if (mouse.y > this.y && this.y > this.size * 5) {
                        this.y -= 0.5;
                    }
                }
            }

            // Mover partícula (muy lento)
            this.x += this.directionX;
            this.y += this.directionY;

            this.draw();
        }
    }

    function initParticles() {
        for (let i = 0; i < numberOfParticles; i++) {
            let size = (Math.random() * 1.5) + 0.8;
            let x = (Math.random() * ((canvas.width - size * 2) - (size * 2)) + size * 2);
            let y = (Math.random() * ((canvas.height - size * 2) - (size * 2)) + size * 2);
            
            // Velocidades sumamente lentas
            let directionX = (Math.random() * 0.1) - 0.05;
            let directionY = (Math.random() * 0.1) - 0.05;
            
            // Colores muy atenuados (gris plata y oro oscuro)
            let color = i % 2 === 0 ? 'rgba(255, 255, 255, 0.15)' : 'rgba(197, 168, 128, 0.15)';

            particlesArray.push(new Particle(x, y, directionX, directionY, size, color));
        }
    }

    function connect() {
        let opacityValue = 1;
        for (let a = 0; a < particlesArray.length; a++) {
            for (let b = a; b < particlesArray.length; b++) {
                let dx = particlesArray[a].x - particlesArray[b].x;
                let dy = particlesArray[a].y - particlesArray[b].y;
                let distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < 90) {
                    opacityValue = 1 - (distance / 90);
                    ctx.strokeStyle = `rgba(197, 168, 128, ${opacityValue * 0.05})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(particlesArray[b].x, particlesArray[b].y);
                    ctx.stroke();
                }
            }
            
            if (mouse.x !== null && mouse.y !== null) {
                let dxMouse = particlesArray[a].x - mouse.x;
                let dyMouse = particlesArray[a].y - mouse.y;
                let distMouse = Math.sqrt(dxMouse * dxMouse + dyMouse * dyMouse);
                if (distMouse < mouse.radius) {
                    opacityValue = 1 - (distMouse / mouse.radius);
                    ctx.strokeStyle = `rgba(197, 168, 128, ${opacityValue * 0.08})`;
                    ctx.lineWidth = 0.8;
                    ctx.beginPath();
                    ctx.moveTo(particlesArray[a].x, particlesArray[a].y);
                    ctx.lineTo(mouse.x, mouse.y);
                    ctx.stroke();
                }
            }
        }
    }

    function animate() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        for (let i = 0; i < particlesArray.length; i++) {
            particlesArray[i].update();
        }
        connect();
        requestAnimationFrame(animate);
    }

    initParticles();
    animate();
}

// ==========================================================================
// 5. ANIMACIONES AL HACER SCROLL (SCROLL REVEAL & STATS COUNTER)
// ==========================================================================
function initScrollReveal() {
    const revealedElements = document.querySelectorAll('.scroll-reveal');
    const statsElements = document.querySelectorAll('.stat-number');
    let animatedStats = false;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
                
                // Si es el panel de stats, animar contadores
                if (entry.target.classList.contains('about-stats-grid') && !animatedStats) {
                    animateStats();
                    animatedStats = true;
                }
            }
        });
    }, {
        threshold: 0.12
    });

    revealedElements.forEach(el => observer.observe(el));
    
    const statsGrid = document.querySelector('.about-stats-grid');
    if (statsGrid) observer.observe(statsGrid);

    function animateStats() {
        statsElements.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            const duration = 1200; // ms
            const stepTime = Math.max(Math.floor(duration / target), 30);
            let current = 0;
            
            const timer = setInterval(() => {
                current += 1;
                stat.textContent = current;
                if (current >= target) {
                    stat.textContent = target + (target === 3 ? ' +' : ''); // sufijo estético
                    clearInterval(timer);
                }
            }, stepTime);
        });
    }
}

// ==========================================================================
// 6. CONTROLADOR DE CERTIFICADOS (DATOS, BUSQUEDA Y FILTRADO)
// ==========================================================================
const CERTIFICADOS_DATA = [
    {
        title: "IBM Data Science Professional Certificate",
        category: "data-science",
        date: "28 Mar 2026",
        verifyUrl: "https://coursera.org/verify/professional-cert/VH2PN9Q6TDVF",
        isProfessionalCert: true
    },
    {
        title: "IBM Data Analyst Professional Certificate",
        category: "data-analysis",
        date: "14 Mar 2026",
        verifyUrl: "https://coursera.org/verify/professional-cert/Y5HAIIVNU7AA",
        isProfessionalCert: true
    },
    {
        title: "Applied Data Science Capstone",
        category: "data-science",
        date: "27 Mar 2026",
        verifyUrl: "https://coursera.org/verify/HXK6ZT0ZC43C",
        isProfessionalCert: false
    },
    {
        title: "Data Scientist Career Guide and Interview Preparation",
        category: "data-science",
        date: "28 Mar 2026",
        verifyUrl: "https://coursera.org/verify/DC674W33F5HK",
        isProfessionalCert: false
    },
    {
        title: "Machine Learning with Python",
        category: "data-science",
        date: "25 Mar 2026",
        verifyUrl: "https://coursera.org/verify/8L649OBSLRPD",
        isProfessionalCert: false
    },
    {
        title: "Data Science Methodology",
        category: "data-science",
        date: "24 Mar 2026",
        verifyUrl: "https://coursera.org/verify/AVBSEDAWIDK5",
        isProfessionalCert: false
    },
    {
        title: "Tools for Data Science",
        category: "data-science",
        date: "22 Mar 2026",
        verifyUrl: "https://coursera.org/verify/V3H0I48VDYEQ",
        isProfessionalCert: false
    },
    {
        title: "What is Data Science?",
        category: "data-science",
        date: "19 Mar 2026",
        verifyUrl: "https://coursera.org/verify/HYEWIIA1HTR4",
        isProfessionalCert: false
    },
    {
        title: "Databases and SQL for Data Science with Python",
        category: "data-science",
        date: "26 Feb 2026",
        verifyUrl: "https://coursera.org/verify/Z7EA3KKZ2Q1W",
        isProfessionalCert: false
    },
    {
        title: "IBM Data Analyst Capstone Project",
        category: "data-analysis",
        date: "12 Mar 2026",
        verifyUrl: "https://coursera.org/verify/M748WE84K42K",
        isProfessionalCert: false
    },
    {
        title: "Data Analyst Career Guide and Interview Preparation",
        category: "data-analysis",
        date: "14 Mar 2026",
        verifyUrl: "https://coursera.org/verify/B7UMSTXAIUUMX",
        isProfessionalCert: false
    },
    {
        title: "Data Visualization with Python",
        category: "data-analysis",
        date: "4 Mar 2026",
        verifyUrl: "https://coursera.org/verify/Q5RPM3ENZHMY",
        isProfessionalCert: false
    },
    {
        title: "Data Analysis with Python",
        category: "data-analysis",
        date: "2 Mar 2026",
        verifyUrl: "https://coursera.org/verify/7U2OWPKRJRLA",
        isProfessionalCert: false
    },
    {
        title: "Data Visualization and Dashboards with Excel and Cognos",
        category: "data-analysis",
        date: "12 Feb 2026",
        verifyUrl: "https://coursera.org/verify/8GRULYSTH4EU",
        isProfessionalCert: false
    },
    {
        title: "Excel Basics for Data Analysis",
        category: "data-analysis",
        date: "4 Feb 2026",
        verifyUrl: "https://coursera.org/verify/WQAG7PH79L4J",
        isProfessionalCert: false
    },
    {
        title: "Introduction to Data Analytics",
        category: "data-analysis",
        date: "2 Feb 2026",
        verifyUrl: "https://coursera.org/verify/C2PVRMEW8WSO",
        isProfessionalCert: false
    },
    {
        title: "Generative AI: Elevate Your Data Science Career",
        category: "ai-dev",
        date: "28 Mar 2026",
        verifyUrl: "https://coursera.org/verify/1ZGGTCROF992",
        isProfessionalCert: false
    },
    {
        title: "Generative AI: Enhance your Data Analytics Career",
        category: "ai-dev",
        date: "13 Mar 2026",
        verifyUrl: "https://coursera.org/verify/VRRBHYBVVVYS",
        isProfessionalCert: false
    },
    {
        title: "Python Project for Data Science",
        category: "ai-dev",
        date: "20 Feb 2026",
        verifyUrl: "https://coursera.org/verify/1LL94PJJQT4Y",
        isProfessionalCert: false
    },
    {
        title: "Python for Data Science, AI & Development",
        category: "ai-dev",
        date: "19 Feb 2026",
        verifyUrl: "https://coursera.org/verify/24VANF5D8V0O",
        isProfessionalCert: false
    },
    {
        title: "Introduction to Agile Development and Scrum",
        category: "agile",
        date: "2 Apr 2026",
        verifyUrl: "https://coursera.org/verify/V6O3ZGD82567",
        isProfessionalCert: false
    }
];

function initCertificates() {
    const grid = document.getElementById('certs-grid');
    const searchInput = document.getElementById('certs-search');
    const filterButtons = document.querySelectorAll('.filter-btn');
    
    let activeFilter = 'all';
    let searchQuery = '';

    renderCerts(CERTIFICADOS_DATA);

    searchInput.addEventListener('input', (e) => {
        searchQuery = e.target.value.toLowerCase().trim();
        filterAndRender();
    });

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            activeFilter = btn.getAttribute('data-filter');
            filterAndRender();
        });
    });

    function filterAndRender() {
        const filtered = CERTIFICADOS_DATA.filter(cert => {
            const matchesFilter = activeFilter === 'all' || cert.category === activeFilter;
            const matchesSearch = cert.title.toLowerCase().includes(searchQuery);
            return matchesFilter && matchesSearch;
        });
        renderCerts(filtered);
    }

    function renderCerts(list) {
        grid.innerHTML = '';
        
        if (list.length === 0) {
            grid.innerHTML = `<div class="certs-empty"><i class="fa-solid fa-folder-open"></i><p>No se encontraron certificados coincidentes.</p></div>`;
            return;
        }

        list.forEach((cert, index) => {
            const card = document.createElement('div');
            card.className = 'cert-card glass-panel';
            card.style.animationDelay = `${index * 0.02}s`;
            
            const badgesHtml = `
                <div class="cert-badges">
                    <span class="cert-badge-ibm">IBM</span>
                    ${cert.isProfessionalCert ? '<span class="cert-badge-type">PROFESIONAL</span>' : ''}
                </div>
            `;

            card.innerHTML = `
                <div class="cert-header">
                    ${badgesHtml}
                    <div class="cert-icon"><i class="fa-solid fa-award"></i></div>
                </div>
                <h3 class="cert-title">${cert.title}</h3>
                <div class="cert-meta">
                    <span><i class="fa-solid fa-calendar-alt"></i> Emitido: ${cert.date}</span>
                    <span><i class="fa-solid fa-circle-check"></i> Oficial / Verificable</span>
                </div>
                <div class="cert-action">
                    <a href="${cert.verifyUrl}" target="_blank" class="btn-cert-verify">
                        <span>Verificar Credencial</span>
                        <i class="fa-solid fa-arrow-up-right-from-square"></i>
                    </a>
                </div>
            `;
            grid.appendChild(card);
        });
    }
}

// ==========================================================================
// 7. FORMULARIO DE CONTACTO (ENVÍO REAL CON FORMDATA)
// ==========================================================================
function initContactForm() {
    const form = document.getElementById('contact-form');
    const feedback = document.getElementById('form-feedback');
    const submitBtn = document.getElementById('btn-submit-form');
    const submitBtnText = submitBtn.querySelector('.btn-text');
    const submitBtnIcon = submitBtn.querySelector('i');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        submitBtn.disabled = true;
        submitBtnText.textContent = 'Enviando...';
        submitBtnIcon.className = 'fa-solid fa-circle-notch fa-spin';
        feedback.classList.add('hidden');

        try {
            const response = await fetch(form.action, {
                method: 'POST',
                body: new FormData(form),
                headers: { 'Accept': 'application/json' }
            });

            if (response.ok) {
                feedback.className = 'form-feedback success';
                feedback.innerHTML = '<strong>¡Mensaje Enviado!</strong> Gracias por tu contacto. Te responderé en menos de 24 horas.';
                form.reset();
            } else {
                const data = await response.json();
                throw new Error(data.error || 'Error del servidor');
            }
        } catch (err) {
            feedback.className = 'form-feedback error';
            feedback.innerHTML = '<strong>Error al enviar.</strong> Intenta de nuevo o escribe directamente a <a href="mailto:hoswarramirez.24@gmail.com" style="color:inherit;text-decoration:underline;">hoswarramirez.24@gmail.com</a>';
        }

        feedback.classList.remove('hidden');
        submitBtn.disabled = false;
        submitBtnText.textContent = 'Enviar Mensaje';
        submitBtnIcon.className = 'fa-solid fa-paper-plane';

        setTimeout(() => {
            feedback.classList.add('hidden');
        }, 8000);
    });
}

// ==========================================================================
// 8. BOTÓN FLOTANTE DESPLEGABLE (SPEED DIAL)
// ==========================================================================
function initSpeedDial() {
    const dialContainer = document.getElementById('speed-dial-container');
    const dialMain = document.getElementById('speed-dial-main');

    dialMain.addEventListener('click', (e) => {
        e.stopPropagation();
        dialContainer.classList.toggle('active');
        const isActive = dialContainer.classList.contains('active');
        dialMain.setAttribute('aria-expanded', isActive);
        
        const icon = dialMain.querySelector('i');
        if (isActive) {
            icon.className = 'fa-solid fa-xmark';
        } else {
            icon.className = 'fa-solid fa-comments';
        }
    });

    const dialOptions = document.querySelectorAll('.speed-dial-btn');
    dialOptions.forEach(opt => {
        opt.addEventListener('click', () => {
            dialContainer.classList.remove('active');
            dialMain.setAttribute('aria-expanded', 'false');
            dialMain.querySelector('i').className = 'fa-solid fa-comments';
        });
    });

    document.addEventListener('click', (e) => {
        if (!dialContainer.contains(e.target)) {
            dialContainer.classList.remove('active');
            dialMain.setAttribute('aria-expanded', 'false');
            dialMain.querySelector('i').className = 'fa-solid fa-comments';
        }
    });
}

// ==========================================================================
// 9. MODAL DE FOTO A PANTALLA COMPLETA
// ==========================================================================
function initPhotoModal() {
    const photo = document.querySelector('.sidebar-photo');
    const modal = document.getElementById('photo-modal');
    const mobilePhoto = document.querySelector('.mobile-logo-photo');

    function openModal() {
        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    }

    function closeModal() {
        modal.classList.remove('active');
        document.body.style.overflow = '';
    }

    photo.addEventListener('click', openModal);
    if (mobilePhoto) {
        mobilePhoto.addEventListener('click', openModal);
    }
    modal.addEventListener('click', closeModal);
}
