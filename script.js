document.addEventListener("DOMContentLoaded", () => {
    // Register GSAP plugins
    gsap.registerPlugin(ScrollTrigger);

    // ==========================================
    // PRELOADER ANIMATION
    // ==========================================
    const ticker = document.getElementById('ticker');
    let progress = 0;
    
    // Simulate loading
    const interval = setInterval(() => {
        progress += Math.floor(Math.random() * 10) + 1;
        if (progress >= 100) {
            progress = 100;
            clearInterval(interval);
            ticker.textContent = `SYS.INIT // 100%`;
            completePreload();
        } else {
            ticker.textContent = `SYS.INIT // ${progress.toString().padStart(2, '0')}%`;
        }
    }, 100);

    function completePreload() {
        const tl = gsap.timeline();
        
        tl.to(".morph-logo", {
            scale: 0,
            opacity: 0,
            duration: 0.8,
            ease: "power3.inOut"
        })
        .to(".preloader-name span", {
            y: "0%",
            opacity: 1,
            stagger: 0.05,
            duration: 0.8,
            ease: "power4.out"
        })
        .to(".preloader-name span", {
            y: "-100%",
            opacity: 0,
            stagger: 0.03,
            duration: 0.6,
            ease: "power3.in",
            delay: 0.5
        })
        .to("#preloader", {
            yPercent: -100,
            duration: 1.2,
            ease: "expo.inOut",
            onComplete: () => {
                document.body.classList.remove('loading');
                initMainAnimations();
            }
        });
    }

    // ==========================================
    // MAIN ANIMATIONS & SCROLL TRIGGERS
    // ==========================================
    function initMainAnimations() {
        // Hero Intro
        gsap.from(".hero-title", {
            y: 100,
            opacity: 0,
            duration: 1.5,
            ease: "power4.out"
        });
        
        gsap.from(".hero-subtitle", {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.5,
            ease: "power3.out"
        });

        gsap.from("#hero-action-group", {
            y: 50,
            opacity: 0,
            duration: 1,
            delay: 0.7,
            ease: "power3.out"
        });

        // Marquee Infinite Loop
        gsap.to(".marquee", {
            xPercent: -50,
            ease: "none",
            duration: 20,
            repeat: -1
        });

        // Section Headers Fade & Slide
        gsap.utils.toArray('.section-title').forEach(title => {
            gsap.from(title, {
                scrollTrigger: {
                    trigger: title,
                    start: "top 80%",
                    once: true
                },
                y: 50,
                opacity: 0,
                duration: 1,
                ease: "power3.out"
            });
        });

        // About Typography Animation
        gsap.to('.animate-text', {
            scrollTrigger: {
                trigger: '.about-typography-anim',
                start: "top 80%",
                once: true
            },
            y: 0,
            opacity: 1,
            stagger: 0.15,
            duration: 1,
            ease: "power3.out"
        });

        // Bento Grid Stagger
        gsap.from(".bento-box", {
            scrollTrigger: {
                trigger: ".bento-grid",
                start: "top 85%",
                once: true
            },
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 1,
            ease: "power3.out",
            clearProps: "transform,opacity"
        });

        // Developer Dashboard Reveal
        gsap.from(".hub-panel", {
            scrollTrigger: {
                trigger: ".hub-dashboard",
                start: "top 75%",
                once: true,
                onEnter: () => startTerminalTyping()
            },
            y: 50,
            opacity: 0,
            duration: 1,
            ease: "power2.out"
        });

        // Certifications Stats Stagger
        gsap.from(".stat-item", {
            scrollTrigger: {
                trigger: ".cert-stats",
                start: "top 80%",
                once: true
            },
            scale: 0.8,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "back.out(1.7)"
        });

        // Certifications List Lines
        gsap.from(".cert-item", {
            scrollTrigger: {
                trigger: ".cert-list",
                start: "top 85%",
                once: true
            },
            x: -30,
            opacity: 0,
            stagger: 0.1,
            duration: 0.8,
            ease: "power3.out",
            clearProps: "transform,opacity"
        });
    }

    // ==========================================
    // MAGNETIC LINKS EFFECT
    // ==========================================
    const magneticElements = document.querySelectorAll('.magnetic-link');
    
    magneticElements.forEach((elem) => {
        elem.addEventListener('mousemove', (e) => {
            const rect = elem.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            gsap.to(elem, {
                x: x * 0.4,
                y: y * 0.4,
                duration: 0.5,
                ease: "power3.out"
            });
        });

        elem.addEventListener('mouseleave', () => {
            gsap.to(elem, {
                x: 0,
                y: 0,
                duration: 0.8,
                ease: "elastic.out(1, 0.3)"
            });
        });
    });

    // ==========================================
    // CONTACT FORM SUBMISSION (FormSubmit AJAX)
    // ==========================================
    const form = document.getElementById('contact-form');
    const statusDiv = document.getElementById('form-status');

    if (form) {
        form.addEventListener('submit', async (e) => {
            e.preventDefault();
            
            const btn = form.querySelector('.btn-submit');
            const originalText = btn.textContent;
            btn.textContent = "TRANSMITTING...";
            statusDiv.innerHTML = '';
            
            const formData = new FormData(form);
            
            // NOTE: Modify this destination email before final deployment if needed
            const emailDestination = "Yogeshsharma9425903357@gmail.com"; 

            try {
                const response = await fetch(`https://formsubmit.co/ajax/${emailDestination}`, {
                    method: "POST",
                    body: formData,
                    headers: {
                        'Accept': 'application/json'
                    }
                });

                if (response.ok) {
                    btn.textContent = "HANDSHAKE SUCCESS";
                    btn.style.backgroundColor = "#000";
                    btn.style.color = "#fff";
                    
                    statusDiv.innerHTML = `<span style="color: #10b981; font-weight: bold; display: block; margin-top: 1rem;">Thank you for connecting with us. We will reach out to you soon.</span>`;
                    
                    form.reset();
                    
                    setTimeout(() => {
                        btn.textContent = originalText;
                        btn.style.backgroundColor = "transparent";
                        btn.style.color = "#000";
                        statusDiv.innerHTML = '';
                    }, 4000);
                } else {
                    throw new Error("Transmission Failed");
                }
            } catch (error) {
                btn.textContent = "TRANSMISSION FAILED";
                statusDiv.innerHTML = `<span style="color: #ff5f56; font-weight: bold; display: block; margin-top: 1rem;">// LOG: Error connecting to server. Please try again.</span>`;
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    statusDiv.innerHTML = '';
                }, 4000);
            }
        });
    }

    // ==========================================
    // EXTENSION: PROFILE INTERSECTION OBSERVER
    // ==========================================
    const genesisObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                gsap.to(entry.target, {
                    opacity: 1,
                    y: 0,
                    duration: 0.8,
                    ease: "power3.out",
                    stagger: 0.2
                });
                genesisObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });

    document.querySelectorAll('.genesis-item').forEach(el => {
        genesisObserver.observe(el);
    });

    // ==========================================
    // EXTENSION: CREDENTIAL FILTERING
    // ==========================================
    const filterTags = document.querySelectorAll('.filter-tag');
    const certItems = document.querySelectorAll('.cert-item-enhanced');

    filterTags.forEach(tag => {
        tag.addEventListener('click', () => {
            // Update active state
            filterTags.forEach(t => t.classList.remove('active'));
            tag.classList.add('active');

            const filterValue = tag.getAttribute('data-filter');

            certItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'flex';
                    // small delay to allow display to apply before opacity transition
                    setTimeout(() => {
                        item.style.opacity = '1';
                        item.style.transform = 'translateY(0)';
                    }, 10);
                } else {
                    item.style.opacity = '0';
                    item.style.transform = 'translateY(10px)';
                    // wait for transition to finish before hiding
                    setTimeout(() => {
                        if(tag.classList.contains('active')) {
                            item.style.display = 'none';
                        }
                    }, 400);
                }
            });
        });
    });

    // ==========================================
    // EXTENSION: VERIFICATION MODAL
    // ==========================================
    const verifyModal = document.getElementById('verify-modal');
    const modalCloseBtn = document.querySelector('.modal-close');
    const modalTitle = document.getElementById('modal-title');
    const modalDesc = document.getElementById('modal-desc');
    const modalLink = document.getElementById('modal-link');

    if (verifyModal) {
        document.querySelectorAll('.cert-item-enhanced').forEach(item => {
            item.addEventListener('click', (e) => {
                // Prevent trigger if they somehow click something else inside
                const title = item.querySelector('.cert-title').innerText;
                const org = item.querySelector('.cert-org').innerText;
                const metrics = item.querySelector('.cert-metrics') ? item.querySelector('.cert-metrics').innerText : '';
                const url = item.getAttribute('data-url');

                modalTitle.innerText = title;
                modalDesc.innerHTML = `${org}<br><br><span class="major-mono">${metrics}</span>`;
                modalLink.href = url;

                verifyModal.classList.add('active');
            });
        });

        modalCloseBtn.addEventListener('click', () => {
            verifyModal.classList.remove('active');
        });

        // Close on outside click
        verifyModal.addEventListener('click', (e) => {
            if (e.target === verifyModal) {
                verifyModal.classList.remove('active');
            }
        });
    }

    // ==========================================
    // EXTENSION: TERMINAL TYPING EFFECT
    // ==========================================
    let typingStarted = false;
    window.startTerminalTyping = function() {
        if(typingStarted) return;
        typingStarted = true;
        const container = document.getElementById('typewriter-text');
        if(!container) return;

        const commands = [
            { text: "// initializing neural network core...", cls: "comment" },
            { text: "import { AI_Engine, SysProtocols } from 'sys_core';", cls: "keyword" },
            { text: " ", cls: "" },
            { text: "// establishing secure connection", cls: "comment" },
            { text: "const connection = await sys.connect('wss://dev.local');", cls: "function" },
            { text: "if(connection.status === 'OK') {", cls: "keyword" },
            { text: "  AI_Engine.boot();", cls: "function" },
            { text: "}", cls: "keyword" },
            { text: " ", cls: "" },
            { text: "> SYSTEM ONLINE. WELCOME, DEVELOPER.", cls: "string" }
        ];

        let cIdx = 0;
        let tIdx = 0;
        let currentElement = null;

        function typeWriter() {
            if (cIdx < commands.length) {
                if(tIdx === 0) {
                    currentElement = document.createElement('div');
                    if(commands[cIdx].cls) currentElement.className = commands[cIdx].cls;
                    if(!commands[cIdx].text.trim()) currentElement.innerHTML = '<br>';
                    container.appendChild(currentElement);
                }
                
                if (tIdx < commands[cIdx].text.length && commands[cIdx].text.trim()) {
                    let char = commands[cIdx].text.charAt(tIdx);
                    if(char === ' ') char = '&nbsp;';
                    currentElement.innerHTML += char;
                    tIdx++;
                    setTimeout(typeWriter, Math.random() * 20 + 10);
                } else {
                    tIdx = 0;
                    cIdx++;
                    setTimeout(typeWriter, 300);
                }
            }
        }
        setTimeout(typeWriter, 500);
    };

    // ==========================================
    // EXTENSION: 3D HOLOGRAM CANVAS
    // ==========================================
    const canvas = document.getElementById('hologram-canvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        let width, height;
        let particles = [];
        
        function initHologram() {
            width = canvas.width = canvas.offsetWidth;
            height = canvas.height = canvas.offsetHeight;
            particles = [];
            
            // Generate sphere particles
            const numParticles = 300;
            const radius = Math.min(width, height) * 0.35;
            
            for (let i = 0; i < numParticles; i++) {
                // Fibonacci sphere distribution
                const phi = Math.acos(-1 + (2 * i) / numParticles);
                const theta = Math.sqrt(numParticles * Math.PI) * phi;
                
                particles.push({
                    x: radius * Math.cos(theta) * Math.sin(phi),
                    y: radius * Math.sin(theta) * Math.sin(phi),
                    z: radius * Math.cos(phi),
                    baseRadius: Math.random() * 2 + 0.5
                });
            }
        }
        
        let angleX = 0;
        let angleY = 0;
        
        function drawHologram() {
            ctx.clearRect(0, 0, width, height);
            
            angleX += 0.005;
            angleY += 0.01;
            
            const centerX = width / 2;
            const centerY = height / 2;
            
            // Sort by Z for depth rendering
            const projected = particles.map(p => {
                // Rotate Y
                let x = p.x * Math.cos(angleY) - p.z * Math.sin(angleY);
                let z = p.z * Math.cos(angleY) + p.x * Math.sin(angleY);
                
                // Rotate X
                let y = p.y * Math.cos(angleX) - z * Math.sin(angleX);
                z = z * Math.cos(angleX) + p.y * Math.sin(angleX);
                
                // Perspective projection
                const fov = 350;
                const scale = fov / (fov + z);
                
                return {
                    x: centerX + x * scale,
                    y: centerY + y * scale,
                    z: z,
                    r: p.baseRadius * scale
                };
            });
            
            projected.sort((a, b) => b.z - a.z);
            
            // Draw particles and connecting lines
            ctx.lineWidth = 0.5;
            for (let i = 0; i < projected.length; i++) {
                const p = projected[i];
                
                // Opacity based on Z depth
                const depthAlpha = Math.max(0.1, (200 - p.z) / 400);
                
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
                ctx.fillStyle = `rgba(255, 255, 255, ${depthAlpha})`;
                ctx.fill();
                
                // Draw connecting lines to nearby particles
                if (i % 3 === 0 && i < projected.length - 1) {
                    const nextP = projected[i + 1];
                    const dist = Math.hypot(p.x - nextP.x, p.y - nextP.y);
                    if (dist < 40) {
                        ctx.beginPath();
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(nextP.x, nextP.y);
                        ctx.strokeStyle = `rgba(255, 255, 255, ${depthAlpha * 0.5})`;
                        ctx.stroke();
                    }
                }
            }
            
            if (isHologramVisible) {
                requestAnimationFrame(drawHologram);
            }
        }
        
        let isHologramVisible = false;
        const hologramObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (!isHologramVisible) {
                    isHologramVisible = true;
                    drawHologram();
                }
            } else {
                isHologramVisible = false;
            }
        });
        
        initHologram();
        hologramObserver.observe(canvas);
        
        let resizeTimerHologram;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimerHologram);
            resizeTimerHologram = setTimeout(initHologram, 250);
        });
    }

    // ==========================================
    // EXTENSION: INFINITE RUNNER (CANVAS)
    // ==========================================
    const runnerCanvas = document.getElementById('runner-canvas');
    if (runnerCanvas) {
        const ctx = runnerCanvas.getContext('2d');
        let width, height;
        let groundLevel;
        let gridLines = [];
        let particles = [];
        
        // Developer "Node" Character
        const node = {
            x: 50,
            y: 0,
            width: 20,
            height: 20,
            vy: 0,
            gravity: 0.6,
            jumpPower: -10,
            isJumping: false
        };
        
        function initRunner() {
            width = runnerCanvas.width = runnerCanvas.offsetWidth;
            height = runnerCanvas.height = runnerCanvas.offsetHeight;
            groundLevel = height - 40;
            node.y = groundLevel - node.height;
            
            // Grid background
            gridLines = [];
            for(let i=0; i<width/40 + 2; i++) {
                gridLines.push({ x: i * 40 });
            }
            
            // Particles
            particles = [];
            for(let i=0; i<30; i++) {
                particles.push({
                    x: Math.random() * width,
                    y: Math.random() * groundLevel,
                    size: Math.random() * 2 + 1,
                    speed: Math.random() * 2 + 1
                });
            }
        }
        
        let frameCount = 0;
        
        function drawRunner() {
            ctx.clearRect(0, 0, width, height);
            
            // Draw Ground Line
            ctx.beginPath();
            ctx.moveTo(0, groundLevel);
            ctx.lineTo(width, groundLevel);
            ctx.strokeStyle = "rgba(255, 255, 255, 0.2)";
            ctx.lineWidth = 1;
            ctx.stroke();
            
            // Update & Draw Background Grid (parallax)
            ctx.strokeStyle = "rgba(255, 255, 255, 0.05)";
            for(let i=0; i<gridLines.length; i++) {
                gridLines[i].x -= 2; // move left
                if(gridLines[i].x < -40) gridLines[i].x += (gridLines.length * 40);
                
                ctx.beginPath();
                ctx.moveTo(gridLines[i].x, groundLevel);
                ctx.lineTo(gridLines[i].x + 40, groundLevel + 40);
                ctx.stroke();
            }
            
            // Update & Draw Parallax Particles
            ctx.fillStyle = "rgba(255, 255, 255, 0.3)";
            for(let i=0; i<particles.length; i++) {
                particles[i].x -= particles[i].speed;
                if(particles[i].x < -10) {
                    particles[i].x = width + 10;
                    particles[i].y = Math.random() * groundLevel;
                }
                ctx.fillRect(particles[i].x, particles[i].y, particles[i].size, particles[i].size);
            }
            
            // Update Node Physics (Subtle Auto-Jump occasionally to simulate game loop)
            frameCount++;
            if(!node.isJumping && Math.random() < 0.005) {
                node.vy = node.jumpPower;
                node.isJumping = true;
            }
            
            node.vy += node.gravity;
            node.y += node.vy;
            
            if(node.y > groundLevel - node.height) {
                node.y = groundLevel - node.height;
                node.vy = 0;
                node.isJumping = false;
            }
            
            // Draw Node (Minimal Geometric Block with Trail)
            ctx.fillStyle = "#fff";
            ctx.shadowColor = "#fff";
            ctx.shadowBlur = 10;
            ctx.fillRect(node.x, node.y, node.width, node.height);
            ctx.shadowBlur = 0;
            
            // Node Trail
            ctx.fillStyle = "rgba(255, 255, 255, 0.1)";
            ctx.fillRect(node.x - 20, node.y + (node.height/2) - 2, 20, 4);
            ctx.fillStyle = "rgba(255, 255, 255, 0.05)";
            ctx.fillRect(node.x - 40, node.y + (node.height/2) - 1, 20, 2);
            
            if (isRunnerVisible) {
                requestAnimationFrame(drawRunner);
            }
        }
        
        let isRunnerVisible = false;
        const runnerObserver = new IntersectionObserver((entries) => {
            if (entries[0].isIntersecting) {
                if (!isRunnerVisible) {
                    isRunnerVisible = true;
                    drawRunner();
                }
            } else {
                isRunnerVisible = false;
            }
        });
        
        initRunner();
        runnerObserver.observe(runnerCanvas);
        
        let resizeTimerRunner;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimerRunner);
            resizeTimerRunner = setTimeout(initRunner, 250);
        });
    }

});
