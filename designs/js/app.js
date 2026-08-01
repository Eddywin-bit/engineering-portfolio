import { GoogleGenAI } from "@google/genai";
import { GEMINI_API_KEY, LOGO_FILENAME, projects, blogPosts, vaultItems } from './data.js';

// =================================================================
// 3. ENGINE LOGIC (OPTIMIZED FOR SMOOTH SCROLL)
// =================================================================


// --- PARALLAX IMAGES COLLECTION ---
const parallaxImages = [];
window.enableProjectParallax = (img) => {
    parallaxImages.push(img);
};

// --- HISTORY API ---
window.pushModalState = (modalId) => {
    window.history.pushState({ modal: modalId }, '', `#${modalId}`);
}

// --- HISTORY API TRAFFIC CONTROLLER ---
window.addEventListener('popstate', (event) => {
    // 1. Is the Lightbox open? Close it and STOP.
    const lightbox = document.getElementById('lightbox');
    if (!lightbox.classList.contains('hidden')) {
        closeLightbox(true); 
        return; // <--- This prevents it from closing the Vault too!
    }

    // 2. Is the Blog Modal open? Close it and STOP.
    const blogModal = document.getElementById('blog-modal');
    if (!blogModal.classList.contains('hidden')) {
        document.getElementById('blog-modal').classList.add('hidden');
        document.body.style.overflow = 'auto';
        return;
    }

    // 3. Is the Project Modal open? Close it and STOP.
    const projectModal = document.getElementById('project-modal');
    if (!projectModal.classList.contains('hidden')) {
        closeProjectModal(true);
        return;
    }

    // 4. Is the Full Vault Overlay open? Close it and STOP.
    const vaultOverlay = document.getElementById('full-vault-overlay');
    if (!vaultOverlay.classList.contains('hidden')) {
        closeFullVault(true);
        return;
    }

    // 5. Is the Mobile Menu open? Close it.
    const mobileMenu = document.getElementById('mobile-menu');
    if (!mobileMenu.classList.contains('hidden')) {
        toggleMobileMenu(true);
    }
});

// Initialize
lucide.createIcons();
renderProjects();
renderBlogGrid();
renderVaultPreview(); 

// --- SMOOTH PARALLAX LOOP (NO SCROLL LAG) ---
let lastScrollY = window.scrollY;
let ticking = false;

function updateParallax() {
    const scrollY = window.scrollY;
    const heroBg = document.getElementById('hero-bg');
    const heroContent = document.getElementById('hero-content');
    
    if(scrollY < 1200) {
        // Background moves slower (0.15)
        heroBg.style.transform = `translate3d(0, ${scrollY * 0.15}px, 0)`;
        // Content moves faster (0.3)
        heroContent.style.transform = `translate3d(0, ${scrollY * 0.3}px, 0)`;
        // Fade out
        heroContent.style.opacity = Math.max(0, 1 - scrollY / 600);
    }
    
    // Project Images Parallax
    parallaxImages.forEach((img, i) => {
         const rect = img.parentElement.getBoundingClientRect();
         if(rect.top < window.innerHeight && rect.bottom > 0) {
             const speed = 0.05;
             const direction = i % 2 === 0 ? 1 : -1;
             // Using translate3d triggers hardware acceleration
             img.style.transform = `translate3d(0, ${(scrollY - img.parentElement.offsetTop) * speed * direction}px, 0)`;
         }
    });
    
    ticking = false;
}

window.addEventListener('scroll', () => {
    if (!ticking) {
        window.requestAnimationFrame(updateParallax);
        ticking = true;
    }
}, { passive: true });

       // --- PROJECTS RENDERER ---
function renderProjects() {
    const container = document.getElementById('projects-container');
    container.innerHTML = projects.map((p, i) => `
        <div class="flex flex-col md:flex-row gap-8 md:gap-16 items-center ${i % 2 !== 0 ? 'md:flex-row-reverse' : ''}">
            
            <div class="w-full md:w-3/5 group cursor-pointer" onclick="openProjectModal(${p.id})">
                 
                 <div class="w-full relative aspect-[1500/1200] bg-black/5 border border-black/10 flex items-center justify-center overflow-hidden transition-colors hover:border-brand-500/50">
                    
                    <img src="${p.image}" onerror="this.src='${p.fallbackImage}'" class="max-w-full max-h-full w-auto h-auto object-contain transition-transform duration-500 ease-out group-hover:scale-105 will-change-transform" />
                    
                </div>

            </div>

            <div class="w-full md:w-2/5">
                <span class="text-brand-500 tracking-[0.2em] uppercase text-xs font-bold mb-4 block flex items-center gap-2">
                    <span class="w-8 h-[1px] bg-brand-500"></span> ${p.category}
                </span>
                <h3 class="text-3xl md:text-5xl font-display font-medium text-ink mb-4 md:mb-6 group cursor-pointer hover:text-brand-500 transition-colors" onclick="openProjectModal(${p.id})">${p.title}</h3>
                <p class="text-gray-400 mb-6 md:mb-8 font-light leading-relaxed text-base md:text-lg line-clamp-3 md:line-clamp-none">${p.description}</p>
                <button onclick="openProjectModal(${p.id})" class="text-ink border-b border-black/30 pb-2 hover:text-brand-500 hover:border-brand-500 uppercase text-xs tracking-widest flex items-center gap-2 group">
                    View Case Study <i data-lucide="arrow-up-right" class="w-4 h-4 group-hover:-translate-y-1 group-hover:translate-x-1 transition-transform"></i>
                </button>
            </div>
        </div>
    `).join('');
    lucide.createIcons();
}

// --- PROJECT MODAL LOGIC ---
let currentProjId = null;
window.openProjectModal = (id) => {
    pushModalState('project-modal');
    currentProjId = id;
    const p = projects.find(x => x.id === id);
    if (!p) return;
    
    // --- GALLERY RENDERER (FIXED SIZE) ---
    const galleryHtml = (p.gallery || []).map((img, idx) => `
        <div class="w-full flex flex-col items-center mb-12">
             <img src="${img}" class="max-h-[85vh] w-auto h-auto object-contain shadow-2xl rounded-sm hover:scale-[1.01] transition-transform duration-700" />
             
             <div class="w-full max-w-4xl mt-3 flex justify-end px-4 md:px-0">
                <p class="text-xs text-gray-600 font-mono">FIG ${idx+1}.0</p>
             </div>
        </div>
    `).join('');
    
    // OPAQUE BACKGROUND CONTENT + OPTIMIZED IMAGE SIZING (PINTEREST STYLE)
    const content = `
        <div class="w-full bg-dark-950 pt-20">
            <div class="w-full max-w-6xl mx-auto h-[50vh] md:h-[65vh] relative rounded-xl overflow-hidden shadow-2xl">
                <img src="${p.image}" onerror="this.src='${p.fallbackImage}'" class="w-full h-full object-cover" />
                <div class="absolute inset-0 bg-gradient-to-t from-dark-950/80 to-transparent"></div>
                <div class="absolute bottom-0 left-0 w-full p-6 md:p-12">
                    <span class="text-brand-500 tracking-[0.2em] uppercase text-sm font-medium mb-4 block animate-slide-up bg-black/50 backdrop-blur-md w-fit px-4 py-1 rounded-full border border-black/10">${p.category}</span>
                    <h1 class="text-3xl md:text-6xl font-display font-medium text-ink mb-2 animate-slide-up leading-tight" style="animation-delay:0.1s">${p.title}</h1>
                </div>
            </div>
        </div>

        <div class="max-w-7xl mx-auto px-6 py-12 md:py-20 bg-dark-950">
            <div class="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12 md:mb-20 border-b border-black/10 pb-12">
                 <div><span class="text-gray-500 text-xs uppercase tracking-wider block mb-2">CLIENT</span><span class="text-ink font-display text-base md:text-lg">${p.client}</span></div>
                 <div><span class="text-gray-500 text-xs uppercase tracking-wider block mb-2">YEAR</span><span class="text-ink font-display text-base md:text-lg">${p.year}</span></div>
                 <div><span class="text-gray-500 text-xs uppercase tracking-wider block mb-2">ROLE</span><span class="text-ink font-display text-base md:text-lg">${p.role}</span></div>
                 <div><span class="text-gray-500 text-xs uppercase tracking-wider block mb-2">DELIVERABLES</span><span class="text-ink font-display text-base md:text-lg">${p.category}</span></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-16 md:mb-24">
                <div class="md:col-span-1"><h3 class="text-xl md:text-2xl font-display font-medium text-ink">The Challenge</h3></div>
                <div class="md:col-span-2"><p class="text-gray-400 text-base md:text-lg leading-relaxed font-light">${p.challenge}</p></div>
            </div>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-16 mb-16 md:mb-24">
                <div class="md:col-span-1"><h3 class="text-xl md:text-2xl font-display font-medium text-ink">The Solution</h3></div>
                <div class="md:col-span-2"><p class="text-gray-400 text-base md:text-lg leading-relaxed font-light">${p.solution}</p></div>
            </div>
            <div class="space-y-12">
                ${galleryHtml}
            </div>
            <div class="mt-20 pt-10 border-t border-black/10 flex justify-end">
                <button onclick="nextProject()" class="text-2xl md:text-6xl font-display italic text-ink hover:text-brand-500 flex items-center gap-6 group transition-colors">
                    Next Project <i data-lucide="arrow-right" class="w-6 h-6 md:w-12 md:h-12 group-hover:translate-x-4 transition-transform"></i>
                </button>
            </div>
        </div>
    `;
    document.getElementById('modal-content').innerHTML = content;
    document.getElementById('project-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    lucide.createIcons();
}

window.closeProjectModal = (fromBackBtn = false) => {
    document.getElementById('project-modal').classList.add('hidden');
    document.body.style.overflow = 'auto';
    if(!fromBackBtn) window.history.back(); 
}

window.nextProject = () => {
    const idx = projects.findIndex(p => p.id === currentProjId);
    const next = projects[(idx + 1) % projects.length];
    window.history.replaceState({ modal: 'project-modal' }, '', `#project-modal`);
    openProjectModal(next.id); 
    document.getElementById('project-modal').scrollTop = 0;
}

// --- VAULT LOGIC (SORTING & OVERLAY) ---
function renderVaultPreview() {
    // Desktop: 3 items
    const preview = vaultItems.slice(0, 3);
    const desktopHTML = preview.map(item => `
        <div class="break-inside mb-6 group relative cursor-pointer" onclick="openLightbox('${item.full}', '${item.title}', '${item.category}')">
            <img src="${item.src}" loading="lazy" class="w-full h-auto object-cover opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                <p class="text-white font-display italic">${item.title}</p>
            </div>
        </div>
    `).join('');
    document.getElementById('vault-preview-grid').innerHTML = desktopHTML;

    // Mobile: 4 items
    const mobilePreview = vaultItems.slice(0, 4);
    const mobileHTML = mobilePreview.map(item => `
        <div class="group relative cursor-pointer overflow-hidden aspect-square" onclick="openLightbox('${item.full}', '${item.title}', '${item.category}')">
            <img src="${item.src}" loading="lazy" class="w-full h-full object-cover" />
        </div>
    `).join('');
    document.getElementById('vault-preview-grid-mobile').innerHTML = mobileHTML;
}

window.openFullVault = () => {
    pushModalState('full-vault');
    document.getElementById('full-vault-overlay').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    renderFilters();
    filterVault('All');
}

window.closeFullVault = (fromBackBtn = false) => {
    if (!fromBackBtn) {
        window.history.back();
    } else {
        document.getElementById('full-vault-overlay').classList.add('hidden');
        document.body.style.overflow = 'auto';
    }
}

function renderFilters() {
    const cats = ['All', ...new Set(vaultItems.map(i => i.category))];
    const container = document.getElementById('vault-filters');
    container.innerHTML = cats.map(c => `
        <button onclick="filterVault('${c}')" class="filter-btn px-4 py-2 md:px-6 md:py-2 border border-black/10 text-[10px] uppercase tracking-[0.2em] text-gray-400 hover:border-brand-500 hover:text-ink transition-all duration-300 ${c === 'All' ? 'bg-brand-500 text-black border-brand-500' : ''}" data-cat="${c}">
            ${c}
        </button>
    `).join('');
}

window.filterVault = (category) => {
    document.querySelectorAll('.filter-btn').forEach(b => {
        if(b.dataset.cat === category) {
            b.classList.add('bg-brand-500', 'text-black', 'border-brand-500');
            b.classList.remove('text-gray-400');
        } else {
            b.classList.remove('bg-brand-500', 'text-black', 'border-brand-500');
            b.classList.add('text-gray-400');
        }
    });

    const filtered = category === 'All' ? vaultItems : vaultItems.filter(i => i.category === category);
    const countEl = document.getElementById('artifact-count');
    countEl.innerText = filtered.length;
    countEl.classList.remove('invisible');

    const grid = document.getElementById('full-vault-grid');
    grid.innerHTML = filtered.map((item, idx) => `
        <div class="break-inside mb-6 group relative cursor-pointer animate-fade-in" style="animation-delay: ${Math.min(idx * 0.05, 0.5)}s" onclick="openLightbox('${item.full}', '${item.title}', '${item.category}')">
            <img src="${item.src}" loading="lazy" class="w-full h-auto object-cover opacity-90 hover:opacity-100 transition-all duration-700" />
            <div class="absolute top-2 right-2 bg-black/60 px-3 py-1 text-[10px] text-white uppercase tracking-wider opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-sm">${item.category}</div>
        </div>
    `).join('');
}

window.openLightbox = (src, title, cat) => {
    pushModalState('lightbox');
    const lb = document.getElementById('lightbox');
    lb.classList.remove('hidden');
    document.getElementById('lightbox-img').src = src;
    document.getElementById('lightbox-title').innerText = title;
    document.getElementById('lightbox-cat').innerText = cat;
}
window.closeLightbox = (fromBackBtn = false) => {
    if (!fromBackBtn) {
        // User clicked "X" button -> Just go back in history.
        // The 'popstate' listener above will handle the actual hiding.
        window.history.back();
    } else {
        // Called by history (popstate) -> Actually hide the UI.
        document.getElementById('lightbox').classList.add('hidden');
    }
}

// --- BLOG READER LOGIC ---
function renderBlogGrid() {
    document.getElementById('blog-grid').innerHTML = blogPosts.map(post => `
        <article class="group cursor-pointer" onclick="openBlogModal(${post.id})">
            <div class="overflow-hidden mb-6 aspect-video relative">
                <img src="${post.image}" onerror="this.src='Assets/logo.webp'; this.classList.add('object-contain','p-8','opacity-40')" class="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-700" />
                <div class="absolute inset-0 bg-black/20 group-hover:bg-transparent transition-colors"></div>
            </div>
            <div class="flex items-center gap-4 text-[10px] uppercase tracking-wider text-gray-500 mb-3 font-mono">
                <span>${post.date}</span>
            </div>
            <h3 class="text-xl md:text-2xl font-display font-medium text-ink mb-3 group-hover:text-brand-500 transition-colors">${post.title}</h3>
            <p class="text-gray-500 text-sm leading-relaxed font-light line-clamp-3">${post.excerpt}</p>
            <span class="inline-block mt-4 text-xs text-brand-500 border-b border-brand-500 pb-1">Read Article</span>
        </article>
    `).join('');
}

window.openBlogModal = (id) => {
    pushModalState('blog-modal');
    const post = blogPosts.find(p => p.id === id);
    if (!post) return;
    document.getElementById('blog-modal-date').innerText = post.date;
    document.getElementById('blog-modal-title').innerText = post.title;
    document.getElementById('blog-modal-img').src = post.image;
    document.getElementById('blog-modal-body').innerHTML = post.content;
    document.getElementById('blog-modal').classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    document.getElementById('blog-modal').scrollTop = 0;
}

// --- UTILS ---
window.scrollToSection = (id) => document.getElementById(id).scrollIntoView({ behavior: 'smooth' });

window.toggleMobileMenu = (fromBackBtn = false) => {
    const menu = document.getElementById('mobile-menu');
    const isHidden = menu.classList.contains('hidden');
    
    if (isHidden) {
        if(!fromBackBtn) pushModalState('mobile-menu');
        menu.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    } else {
        menu.classList.add('hidden');
        document.body.style.overflow = 'auto';
        if(!fromBackBtn) window.history.back();
    }
};

window.handleFormSubmit = async (e) => {
    e.preventDefault();
    const btn = document.getElementById('submit-btn');
    const form = e.target;
    const originalText = btn.innerText;

    btn.innerText = 'Sending...';
    btn.disabled = true;

    try {
        const response = await fetch('https://formsubmit.co/ajax/gyasiedwin14@gmail.com', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
            body: JSON.stringify({
                name: form.querySelector('[name="name"]').value,
                email: form.querySelector('[name="email"]').value,
                message: form.querySelector('[name="message"]').value,
                _subject: 'New Portfolio Inquiry — Eon Designs',
                _captcha: 'false'
            })
        });

        if (!response.ok) throw new Error('Server error');

        btn.innerText = 'Message Sent ✓';
        btn.classList.add('bg-green-500', 'text-white');
        form.reset();
    } catch (err) {
        btn.innerText = 'Failed — Try Email Instead';
        btn.classList.add('bg-red-500/20', 'text-red-300', 'border-red-500');
    } finally {
        setTimeout(() => {
            btn.innerText = originalText;
            btn.classList.remove('bg-green-500', 'text-white', 'bg-red-500/20', 'text-red-300', 'border-red-500');
            btn.disabled = false;
        }, 4000);
    }
}

// --- AI CHAT LOGIC ---
window.toggleChat = () => document.getElementById('chat-window').classList.toggle('hidden');
window.sendChatMessage = async () => {
    const input = document.getElementById('chat-input');
    const msg = input.value.trim();
    if(!msg) return;
    
    const container = document.getElementById('chat-messages');
    container.innerHTML += `<div class="flex justify-end"><div class="bg-ink text-white max-w-[85%] p-4 text-sm font-light mb-4 rounded-tl-xl rounded-bl-xl rounded-br-xl shadow-lg">${msg}</div></div>`;
    input.value = '';
    
    // Loading Animation
    const loadId = 'loading-' + Date.now();
    container.innerHTML += `
        <div id="${loadId}" class="flex justify-start">
            <div class="bg-dark-900 border border-black/10 p-4 flex gap-1 rounded-tr-xl rounded-bl-xl rounded-br-xl">
                <span class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce"></span>
                <span class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style="animation-delay:0.1s"></span>
                <span class="w-1.5 h-1.5 bg-brand-500 rounded-full animate-bounce" style="animation-delay:0.2s"></span>
            </div>
        </div>`;
    container.scrollTop = container.scrollHeight;

    try {
        if(!GEMINI_API_KEY) {
            throw new Error("Missing Key"); 
        }
        const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
        const model = ai.models.generateContent({ 
            model: "gemini-2.5-flash", 
            contents: [{ role: 'user', parts: [{ text: msg }]}],
            config: {
                systemInstruction: "You are Eon AI, the digital assistant for Edwin Gyasi Owusu. You are helpful, professional, and concise."
            }
        });
        const result = await model;
        
        document.getElementById(loadId).remove();
        container.innerHTML += `<div class="flex justify-start"><div class="bg-dark-900 text-gray-200 border border-black/10 max-w-[85%] p-4 text-sm font-light mb-4 rounded-tr-xl rounded-bl-xl rounded-br-xl leading-relaxed shadow-lg">${result.response.text}</div></div>`;
    } catch (e) {
        document.getElementById(loadId).remove();
        const errText = e.message === "Missing Key" 
            ? "I'm currently offline (API Key missing in code). Please email Edwin directly!" 
            : "I'm having trouble connecting. Please try again.";
        
        container.innerHTML += `<div class="flex justify-start"><div class="bg-red-900/20 text-red-200 border border-red-500/30 p-4 text-sm mb-4 rounded-tr-xl rounded-bl-xl rounded-br-xl">${errText}</div></div>`;
    }
    container.scrollTop = container.scrollHeight;
}
