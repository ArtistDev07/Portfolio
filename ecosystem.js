/**
 * ECOSYSTEM LOGIC (Extends Base Behavior)
 * Handles shared navigation, GSAP animations, and layout systems for the new pages.
 */

document.addEventListener("DOMContentLoaded", () => {
    initEcosystemNav();
    initGSAPAnimations();
    initThreeJS();
    initDVGallery();
    initBlogEngine();
    initMissionControl();
});

function initEcosystemNav() {
    // Inject the shared navigation into the current page
    const navHTML = `
        <nav id="eco-nav">
            <a href="index.html" class="eco-nav-logo">Y.S_ // SYSTEM</a>
            <button class="eco-mobile-toggle" aria-label="Toggle Navigation" onclick="this.nextElementSibling.classList.toggle('nav-active')">
                <i class="ri-menu-4-line"></i>
            </button>
            <div class="eco-nav-links">
                <a href="design-vault.html">Design Vault</a>
                <a href="content-lab.html">Content Lab</a>
                <a href="creative-studio.html">Creative Studio</a>
                <a href="journey.html">Journey</a>
            </div>
        </nav>
    `;
    
    // Insert nav at the beginning of the body
    document.body.insertAdjacentHTML('afterbegin', navHTML);
    
    // Highlight the active link based on current URL
    const currentPath = window.location.pathname.split('/').pop();
    const links = document.querySelectorAll('.eco-nav-links a');
    
    links.forEach(link => {
        const linkPath = link.getAttribute('href');
        if (currentPath === linkPath) {
            link.classList.add('active');
        }
    });

    // Hide/Show navbar on scroll
    let lastScroll = 0;
    const nav = document.getElementById('eco-nav');
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.scrollY;
        if (currentScroll <= 0) {
            nav.classList.remove('hidden');
        } else if (currentScroll > lastScroll && currentScroll > 100) {
            nav.classList.add('hidden');
        } else {
            nav.classList.remove('hidden');
        }
        lastScroll = currentScroll;
    });
}

function initGSAPAnimations() {
    // Ensure GSAP and ScrollTrigger are loaded
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        console.warn("GSAP or ScrollTrigger not loaded.");
        return;
    }
    
    gsap.registerPlugin(ScrollTrigger);
    
    // Generic scroll reveal for ecosystem elements
    const revealElements = document.querySelectorAll('.gsap-reveal');
    
    revealElements.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: "top 85%",
                toggleActions: "play none none reverse"
            },
            opacity: 1,
            y: 0,
            duration: 0.8,
            ease: "power3.out"
        });
    });

    // Animate timeline nodes progressively
    const timelineNodes = document.querySelectorAll('.eco-timeline-node');
    if (timelineNodes.length > 0) {
        gsap.from(timelineNodes, {
            scrollTrigger: {
                trigger: ".eco-timeline",
                start: "top 70%"
            },
            y: 50,
            opacity: 0,
            stagger: 0.2,
            duration: 0.8,
            ease: "back.out(1.7)"
        });
    }

    // Refresh ScrollTrigger on resize to prevent overlap/layout shifts on mobile rotation
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
            ScrollTrigger.refresh();
        }, 200);
    });
}

/* ==========================================================================
   ARCHITECTURAL UPDATES: Logic & 3D Elements
   ========================================================================== */

function initThreeJS() {
    if (typeof THREE === 'undefined') return;
    
    // 1. Holographic Sphere (Design Vault)
    const dvCanvas = document.getElementById('canvas-dv-sphere');
    if (dvCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth/2 / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: dvCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth/2, window.innerHeight);
        
        const geometry = new THREE.IcosahedronGeometry(2, 2);
        const material = new THREE.MeshBasicMaterial({ color: 0xaaaaaa, wireframe: true, transparent: true, opacity: 0.3 });
        const sphere = new THREE.Mesh(geometry, material);
        
        // Inner solid sphere
        const innerGeo = new THREE.SphereGeometry(1.9, 32, 32);
        const innerMat = new THREE.MeshPhongMaterial({ color: 0x111111, shininess: 100 });
        const innerSphere = new THREE.Mesh(innerGeo, innerMat);
        
        scene.add(sphere);
        scene.add(innerSphere);
        
        const light = new THREE.DirectionalLight(0xffffff, 1);
        light.position.set(5, 5, 5);
        scene.add(light);
        scene.add(new THREE.AmbientLight(0x222222));
        
        camera.position.z = 6;
        
        function animateSphere() {
            requestAnimationFrame(animateSphere);
            sphere.rotation.y += 0.005;
            sphere.rotation.x += 0.002;
            innerSphere.rotation.y -= 0.002;
            renderer.render(scene, camera);
        }
        animateSphere();
        window.addEventListener('resize', () => {
            if(window.innerWidth > 900) {
                camera.aspect = (window.innerWidth/2) / window.innerHeight;
                renderer.setSize(window.innerWidth/2, window.innerHeight);
            } else {
                camera.aspect = window.innerWidth / window.innerHeight;
                renderer.setSize(window.innerWidth, window.innerHeight);
            }
            camera.updateProjectionMatrix();
        });
    }

    // 2. Knowledge Stream (Content Lab)
    const clCanvas = document.getElementById('canvas-cl-torus');
    if (clCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth/2 / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: clCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth/2, window.innerHeight);
        
        const particleCount = 100;
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const velocities = [];
        
        for (let i = 0; i < particleCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 10;
            velocities.push({
                x: (Math.random() - 0.5) * 0.015,
                y: (Math.random() - 0.5) * 0.015,
                z: (Math.random() - 0.5) * 0.015
            });
        }
        
        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        const material = new THREE.PointsMaterial({ color: 0xffffff, size: 0.06, transparent: true, opacity: 0.8 });
        const particles = new THREE.Points(geometry, material);
        scene.add(particles);
        
        const lineMaterial = new THREE.LineBasicMaterial({ color: 0xaaaaaa, transparent: true, opacity: 0.15 });
        let linesMesh = null;
        
        camera.position.z = 7;
        
        const mouse = new THREE.Vector2(9999, 9999);
        window.addEventListener('mousemove', (event) => {
            const rect = clCanvas.getBoundingClientRect();
            if (event.clientX > rect.left && event.clientX < rect.right && event.clientY > rect.top && event.clientY < rect.bottom) {
                mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
                mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
            } else {
                mouse.x = 9999;
                mouse.y = 9999;
            }
        });
        
        function animateKnowledgeStream() {
            requestAnimationFrame(animateKnowledgeStream);
            const posAttr = particles.geometry.attributes.position.array;
            const linePositions = [];
            
            for (let i = 0; i < particleCount; i++) {
                const idx = i * 3;
                posAttr[idx] += velocities[i].x;
                posAttr[idx+1] += velocities[i].y;
                posAttr[idx+2] += velocities[i].z;
                
                if (posAttr[idx] < -6 || posAttr[idx] > 6) velocities[i].x *= -1;
                if (posAttr[idx+1] < -6 || posAttr[idx+1] > 6) velocities[i].y *= -1;
                if (posAttr[idx+2] < -6 || posAttr[idx+2] > 6) velocities[i].z *= -1;
                
                if (mouse.x !== 9999) {
                    const vector = new THREE.Vector3(mouse.x * 6, mouse.y * 6, 0);
                    const pPos = new THREE.Vector3(posAttr[idx], posAttr[idx+1], posAttr[idx+2]);
                    if (pPos.distanceTo(vector) < 2) {
                        const repel = pPos.sub(vector).normalize().multiplyScalar(0.03);
                        posAttr[idx] += repel.x;
                        posAttr[idx+1] += repel.y;
                    }
                }
                
                for (let j = i + 1; j < particleCount; j++) {
                    const jdx = j * 3;
                    const dx = posAttr[idx] - posAttr[jdx];
                    const dy = posAttr[idx+1] - posAttr[jdx+1];
                    const dz = posAttr[idx+2] - posAttr[jdx+2];
                    const distSq = dx*dx + dy*dy + dz*dz;
                    
                    if (distSq < 4) {
                        linePositions.push(
                            posAttr[idx], posAttr[idx+1], posAttr[idx+2],
                            posAttr[jdx], posAttr[jdx+1], posAttr[jdx+2]
                        );
                    }
                }
            }
            
            particles.geometry.attributes.position.needsUpdate = true;
            
            if (linesMesh) {
                scene.remove(linesMesh);
                linesMesh.geometry.dispose();
            }
            if (linePositions.length > 0) {
                const lineGeo = new THREE.BufferGeometry();
                lineGeo.setAttribute('position', new THREE.Float32BufferAttribute(linePositions, 3));
                linesMesh = new THREE.LineSegments(lineGeo, lineMaterial);
                scene.add(linesMesh);
            }
            
            renderer.render(scene, camera);
        }
        animateKnowledgeStream();
    }

    // 3. Infinity Loop (Creative Studio)
    const csCanvas = document.getElementById('canvas-cs-infinity');
    if (csCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, window.innerWidth/2 / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: csCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth/2, window.innerHeight);
        
        const curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3( -2, 0, 1 ),
            new THREE.Vector3( -1, 1, -1 ),
            new THREE.Vector3( 0, 0, 1 ),
            new THREE.Vector3( 1, -1, -1 ),
            new THREE.Vector3( 2, 0, 1 ),
            new THREE.Vector3( 1, 1, -1 ),
            new THREE.Vector3( 0, 0, 1 ),
            new THREE.Vector3( -1, -1, -1 )
        ], true);
        
        const geometry = new THREE.TubeGeometry(curve, 100, 0.4, 16, true);
        const material = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.2, metalness: 1.0, wireframe: false });
        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);
        
        // Arrows / flowing lines simulated with a wireframe overlay
        const wireMat = new THREE.MeshBasicMaterial({ color: 0xffffff, wireframe: true, transparent: true, opacity: 0.1 });
        const wireMesh = new THREE.Mesh(geometry, wireMat);
        scene.add(wireMesh);

        const light = new THREE.DirectionalLight(0xffffff, 2);
        light.position.set(0, 10, 10);
        scene.add(light);
        
        camera.position.z = 8;
        
        function animateInfinity() {
            requestAnimationFrame(animateInfinity);
            mesh.rotation.y += 0.005;
            mesh.rotation.z += 0.002;
            wireMesh.rotation.y += 0.005;
            wireMesh.rotation.z += 0.002;
            renderer.render(scene, camera);
        }
        animateInfinity();
    }

    // 4. Mission Control Black Crystal (Journey Page)
    const mcCanvas = document.getElementById('canvas-mc-crystal');
    if (mcCanvas) {
        const scene = new THREE.Scene();
        const camera = new THREE.PerspectiveCamera(45, (window.innerWidth/2) / window.innerHeight, 0.1, 1000);
        const renderer = new THREE.WebGLRenderer({ canvas: mcCanvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth/2, window.innerHeight);
        
        const geometry = new THREE.IcosahedronGeometry(2.5, 0);
        const material = new THREE.MeshPhysicalMaterial({
            color: 0x050505, metalness: 0.9, roughness: 0.1, clearcoat: 1.0, clearcoatRoughness: 0.1, wireframe: false
        });
        
        const crystal = new THREE.Mesh(geometry, material);
        scene.add(crystal);
        
        const wireMat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true, transparent: true, opacity: 0.3 });
        const wireCrystal = new THREE.Mesh(geometry, wireMat);
        wireCrystal.scale.set(1.02, 1.02, 1.02);
        scene.add(wireCrystal);
        
        const pointLight1 = new THREE.PointLight(0xffffff, 2, 50);
        pointLight1.position.set(5, 5, 5);
        scene.add(pointLight1);
        
        const pointLight2 = new THREE.PointLight(0x555555, 5, 50);
        pointLight2.position.set(-5, -5, -5);
        scene.add(pointLight2);
        
        scene.add(new THREE.AmbientLight(0x111111));
        
        camera.position.z = 8;
        
        function animateCrystal() {
            requestAnimationFrame(animateCrystal);
            crystal.rotation.y += 0.003;
            crystal.rotation.x += 0.001;
            wireCrystal.rotation.y += 0.003;
            wireCrystal.rotation.x += 0.001;
            renderer.render(scene, camera);
        }
        animateCrystal();
        
        window.addEventListener('resize', () => {
            if(window.innerWidth > 900) {
                camera.aspect = (window.innerWidth/2) / window.innerHeight;
                renderer.setSize(window.innerWidth/2, window.innerHeight);
            } else {
                mcCanvas.style.display = 'none';
            }
            camera.updateProjectionMatrix();
        });
    }
}

function initDVGallery() {
    const tabs = document.querySelectorAll('.dv-tab');
    tabs.forEach(tab => {
        tab.addEventListener('click', (e) => {
            const card = e.target.closest('.dv-component-card');
            const targetType = e.target.getAttribute('data-type');
            
            // Reset active states
            card.querySelectorAll('.dv-tab').forEach(t => t.classList.remove('active'));
            card.querySelectorAll('.dv-code-area').forEach(c => c.classList.remove('active'));
            card.querySelector('.dv-preview-area').style.display = 'none';
            
            e.target.classList.add('active');
            if (targetType === 'preview') {
                card.querySelector('.dv-preview-area').style.display = 'flex';
            } else {
                card.querySelector(`.dv-code-area[data-type="${targetType}"]`).classList.add('active');
            }
        });
    });

    const copyBtns = document.querySelectorAll('.dv-btn-copy');
    copyBtns.forEach(btn => {
        btn.addEventListener('click', (e) => {
            const card = e.target.closest('.dv-component-card');
            const activeCode = card.querySelector('.dv-code-area.active');
            if(activeCode) {
                navigator.clipboard.writeText(activeCode.textContent);
                e.target.style.color = '#0f0';
                setTimeout(() => e.target.style.color = '', 1000);
            }
        });
    });
}

function initBlogEngine() {
    const blogSection = document.getElementById('blog-section');
    if(!blogSection) return;

    let blogs = JSON.parse(localStorage.getItem('eco_blogs')) || [];
    let isAdmin = sessionStorage.getItem('eco_admin') === 'true';

    // DOM Elements
    const visitorView = document.getElementById('blog-visitor-view');
    const dashboardContainer = document.getElementById('blog-dashboard-container');
    const loginModal = document.getElementById('admin-login-modal');
    const btnTriggerLogin = document.getElementById('btn-trigger-login');
    const overlay = document.getElementById('full-blog-overlay');
    const overlayContent = document.getElementById('full-blog-content-area');
    const overlayRelated = document.getElementById('related-posts-container');
    const btnCloseBlog = document.getElementById('btn-close-blog');
    const progressBar = document.getElementById('blog-progress-bar');

    // State Initialization
    if(isAdmin) {
        btnTriggerLogin.innerHTML = '<i class="ri-dashboard-line"></i> Dashboard';
        visitorView.style.display = 'none';
        dashboardContainer.style.display = 'flex';
        initAdminDashboard();
    } else {
        visitorView.style.display = 'grid';
        dashboardContainer.style.display = 'none';
        renderVisitorGrid();
    }

    // Login Flow
    btnTriggerLogin.addEventListener('click', () => {
        if(isAdmin) {
            visitorView.style.display = 'none';
            dashboardContainer.style.display = 'flex';
        } else {
            loginModal.style.display = 'flex';
        }
    });

    document.getElementById('admin-cancel-btn').addEventListener('click', () => {
        loginModal.style.display = 'none';
    });

    document.getElementById('admin-submit-btn').addEventListener('click', () => {
        const pass = document.getElementById('admin-password').value;
        if(pass === 'admin2026') {
            sessionStorage.setItem('eco_admin', 'true');
            isAdmin = true;
            loginModal.style.display = 'none';
            btnTriggerLogin.innerHTML = '<i class="ri-dashboard-line"></i> Dashboard';
            visitorView.style.display = 'none';
            dashboardContainer.style.display = 'flex';
            initAdminDashboard();
        } else {
            alert('Authentication Failed');
        }
    });

    // Visitor Rendering
    function renderVisitorGrid() {
        const published = blogs.filter(b => b.status === 'published');
        if(published.length === 0) {
            visitorView.innerHTML = '<p style="color: #666; font-family: var(--font-code);">No transmissions available yet.</p>';
            return;
        }

        visitorView.innerHTML = published.map(b => `
            <div class="visitor-blog-card" onclick="window.openFullPost('${b.id}')">
                <img src="${b.cover || 'https://via.placeholder.com/800x400?text=NO+IMAGE'}" class="visitor-blog-cover" alt="Cover">
                <div class="visitor-blog-content">
                    <div>
                        <div style="font-family: var(--font-code); font-size: 0.7rem; color: #888; margin-bottom: 0.5rem;">[ ${b.category || 'GENERAL'} ] • ${b.readTime} MIN READ</div>
                        <h4 style="font-family: var(--font-heading); font-size: 1.4rem; color: #fff; margin-bottom: 1rem;">${b.title}</h4>
                    </div>
                    <div style="font-size: 0.8rem; color: var(--eco-text-muted); border-top: 1px dashed var(--eco-border); padding-top: 1rem; display: flex; justify-content: space-between;">
                        <span>${b.date}</span>
                        <span>Read More <i class="ri-arrow-right-line"></i></span>
                    </div>
                </div>
            </div>
        `).join('');
    }

    // Expose openFullPost globally for inline onclick
    window.openFullPost = function(id) {
        const post = blogs.find(b => b.id === id);
        if(!post) return;

        overlayContent.innerHTML = `
            <div style="font-family: var(--font-code); color: var(--eco-text-muted); margin-bottom: 1rem;">[ ${post.category || 'GENERAL'} ] • ${post.date} • ${post.readTime} MIN READ</div>
            <h1 style="font-family: var(--font-heading); font-size: 3rem; color: #fff; margin-bottom: 2rem;">${post.title}</h1>
            <img src="${post.cover || 'https://via.placeholder.com/1200x600?text=NO+IMAGE'}" style="width: 100%; max-height: 500px; object-fit: cover; border-radius: 8px; margin-bottom: 3rem;">
            <div class="ql-editor" style="padding: 0; color: #ccc;">
                ${post.content}
            </div>
        `;

        // Render Related
        const related = blogs.filter(b => b.status === 'published' && b.id !== id).slice(0, 2);
        if(related.length > 0) {
            overlayRelated.innerHTML = related.map(b => `
                <div style="background: #111; padding: 1rem; border: 1px solid var(--eco-border); border-radius: 4px; cursor: pointer;" onclick="window.openFullPost('${b.id}')">
                    <h5 style="font-family: var(--font-heading); color: #fff;">${b.title}</h5>
                    <span style="font-size: 0.8rem; color: #888;">${b.date}</span>
                </div>
            `).join('');
        } else {
            overlayRelated.innerHTML = '<span style="color:#666;">No related posts.</span>';
        }

        overlay.style.display = 'block';
        document.body.style.overflow = 'hidden'; // prevent bg scroll
    };

    btnCloseBlog.addEventListener('click', () => {
        overlay.style.display = 'none';
        document.body.style.overflow = '';
    });

    // Reading Progress Indicator
    overlay.addEventListener('scroll', () => {
        const scrollTop = overlay.scrollTop;
        const docHeight = overlay.scrollHeight - overlay.clientHeight;
        const scrollPercent = (scrollTop / docHeight) * 100;
        progressBar.style.width = scrollPercent + '%';
    });

    // Admin Dashboard Logic
    function initAdminDashboard() {
        if(window.quill) return; // already initialized

        // Init Quill
        window.quill = new Quill('#quill-editor', {
            theme: 'snow',
            modules: {
                toolbar: [
                    [{ 'header': [1, 2, 3, 4, 5, 6, false] }],
                    ['bold', 'italic', 'underline', 'strike'],
                    [{ 'color': [] }, { 'background': [] }],
                    [{ 'align': [] }],
                    [{ 'list': 'ordered'}, { 'list': 'bullet' }],
                    ['blockquote', 'code-block'],
                    ['link', 'image'],
                    ['clean']
                ]
            }
        });

        const navWrite = document.getElementById('blog-nav-write');
        const navManage = document.getElementById('blog-nav-manage');
        const navLogout = document.getElementById('blog-nav-logout');
        const viewWrite = document.getElementById('blog-view-write');
        const viewList = document.getElementById('blog-view-list');

        navWrite.addEventListener('click', () => {
            navWrite.classList.add('active'); navManage.classList.remove('active');
            viewWrite.classList.add('active'); viewList.classList.remove('active');
            document.getElementById('blog-form').reset();
            document.getElementById('blog-id').value = '';
            document.getElementById('blog-cover-base64').value = '';
            document.getElementById('blog-cover-preview').style.display = 'none';
            window.quill.root.innerHTML = '';
        });

        navManage.addEventListener('click', () => {
            navManage.classList.add('active'); navWrite.classList.remove('active');
            viewList.classList.add('active'); viewWrite.classList.remove('active');
            renderAdminList();
        });

        navLogout.addEventListener('click', () => {
            sessionStorage.removeItem('eco_admin');
            location.reload();
        });

        // Image to Base64
        document.getElementById('blog-cover-file').addEventListener('change', function() {
            const file = this.files[0];
            if(file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    document.getElementById('blog-cover-base64').value = e.target.result;
                    const preview = document.getElementById('blog-cover-preview');
                    preview.src = e.target.result;
                    preview.style.display = 'block';
                };
                reader.readAsDataURL(file);
            }
        });

        // Save & Publish
        const saveHandler = (status) => {
            const idInput = document.getElementById('blog-id').value;
            const content = window.quill.root.innerHTML;
            const textContent = window.quill.getText();
            const readTime = Math.ceil(textContent.split(/\\s+/).length / 200) || 1;

            const newBlog = {
                id: idInput ? idInput : Date.now().toString(),
                title: document.getElementById('blog-title').value,
                category: document.getElementById('blog-category').value,
                tags: document.getElementById('blog-tags').value,
                cover: document.getElementById('blog-cover-base64').value,
                content: content,
                readTime: readTime,
                status: status,
                date: new Date().toLocaleDateString()
            };

            if(idInput) {
                blogs = blogs.map(b => b.id === idInput ? newBlog : b);
            } else {
                blogs.push(newBlog);
            }
            localStorage.setItem('eco_blogs', JSON.stringify(blogs));
            alert(status === 'published' ? 'Blog Published!' : 'Draft Saved!');
            navManage.click();
        };

        document.getElementById('btn-save-draft').addEventListener('click', () => saveHandler('draft'));
        document.getElementById('btn-publish-post').addEventListener('click', () => saveHandler('published'));

        function renderAdminList() {
            const listContainer = document.getElementById('blog-list-container');
            if(blogs.length === 0) {
                listContainer.innerHTML = '<p style="color:#888;">No articles found.</p>';
                return;
            }
            listContainer.innerHTML = blogs.map(b => `
                <div style="background:#111; border:1px solid var(--eco-border); padding:1rem; border-radius:8px; margin-bottom:1rem; display:flex; justify-content:space-between; align-items:center;">
                    <div>
                        <h4 style="font-family:var(--font-heading); margin-bottom:0.5rem; color:#fff;">${b.title}</h4>
                        <span style="font-size:0.8rem; color:#888;">[${b.status.toUpperCase()}] • ${b.date}</span>
                    </div>
                    <div style="display:flex; gap:1rem;">
                        <button class="eco-btn edit-blog" data-id="${b.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem;">Edit</button>
                        <button class="eco-btn delete-blog" data-id="${b.id}" style="padding:0.3rem 0.6rem; font-size:0.8rem; border-color:#f33; color:#f33;">Delete</button>
                    </div>
                </div>
            `).join('');

            document.querySelectorAll('.edit-blog').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const id = e.target.dataset.id;
                    const b = blogs.find(x => x.id === id);
                    if(b) {
                        document.getElementById('blog-id').value = b.id;
                        document.getElementById('blog-title').value = b.title;
                        document.getElementById('blog-category').value = b.category || '';
                        document.getElementById('blog-tags').value = b.tags || '';
                        document.getElementById('blog-cover-base64').value = b.cover || '';
                        if(b.cover) {
                            const preview = document.getElementById('blog-cover-preview');
                            preview.src = b.cover;
                            preview.style.display = 'block';
                        }
                        window.quill.root.innerHTML = b.content;
                        navWrite.click();
                    }
                });
            });

            document.querySelectorAll('.delete-blog').forEach(btn => {
                btn.addEventListener('click', (e) => {
                    if(confirm("Delete this post?")) {
                        const id = e.target.dataset.id;
                        blogs = blogs.filter(x => x.id !== id);
                        localStorage.setItem('eco_blogs', JSON.stringify(blogs));
                        renderAdminList();
                    }
                });
            });
        }
        
        renderAdminList();
    }
}

function initMissionControl() {
    // 1. Preloader
    const lines = ["Tracking Growth...", "Loading Ideas...", "Loading Experiments...", "Loading Innovations...", "SYSTEM.READY"];
    const termBoxes = document.querySelectorAll('.pl-line');
    
    let delay = 0.5;
    termBoxes.forEach((box, i) => {
        if(lines[i]) {
            setTimeout(() => { box.textContent = '> ' + lines[i]; }, delay * 1000);
            delay += 0.4;
        }
    });
    
    const tl = gsap.timeline();
    tl.to('#pl-title', { opacity: 1, duration: 1, delay: 0.5 })
      .to('#mc-preloader', { yPercent: -100, duration: 1, delay: 2.5, ease: "power3.inOut" });

    // 2. ScrollTriggers
    gsap.utils.toArray('.gsap-up').forEach(el => {
        gsap.fromTo(el, { y: 50, opacity: 0 }, { scrollTrigger: { trigger: el, start: "top 85%" }, y: 0, opacity: 1, duration: 0.8 });
    });
    
    gsap.utils.toArray('.gsap-fade').forEach(el => {
        gsap.fromTo(el, { opacity: 0, scale: 0.9 }, { scrollTrigger: { trigger: el, start: "top 85%" }, opacity: 1, scale: 1, duration: 1 });
    });

    gsap.utils.toArray('.vault-anim').forEach((el, i) => {
        gsap.to(el, { scrollTrigger: { trigger: '.mc-vault', start: "top 70%" }, x: 0, opacity: 1, duration: 0.6, delay: i * 0.15, ease: "back.out(1.2)" });
    });

    // 3. Signal Card Expansion
    document.querySelectorAll('.mc-signal-card').forEach(card => {
        card.addEventListener('click', () => {
            card.classList.toggle('expanded');
        });
    });
}
