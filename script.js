/* ============================================================
   SCRIPT - Template Quarta Informatica
   ============================================================
   
   Funzionalità:
   - Dark mode con salvataggio in localStorage
   - Animazioni allo scroll (Intersection Observer)
   - Navbar che cambia stile allo scroll
   - Menu mobile (hamburger)
   - Card stage con toggle apri/chiudi
   - Calcolatore presenze
   
   ============================================================ */

// === DARK MODE ===
// Legge la preferenza salvata o quella di sistema
function initDarkMode() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;

    // Controlla se c'è una preferenza salvata
    const saved = localStorage.getItem('dark-mode');
    if (saved === 'true') {
        document.documentElement.setAttribute('data-dark', '');
    } else if (saved === null) {
        // Se non c'è preferenza, segui il sistema operativo
        if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
            document.documentElement.setAttribute('data-dark', '');
        }
    }

    updateToggleIcon();

    toggle.addEventListener('click', function() {
        if (document.documentElement.hasAttribute('data-dark')) {
            document.documentElement.removeAttribute('data-dark');
            localStorage.setItem('dark-mode', 'false');
        } else {
            document.documentElement.setAttribute('data-dark', '');
            localStorage.setItem('dark-mode', 'true');
        }
        updateToggleIcon();
    });
}

function updateToggleIcon() {
    const toggle = document.getElementById('themeToggle');
    if (!toggle) return;
    const isDark = document.documentElement.hasAttribute('data-dark');
    toggle.textContent = isDark ? '☀️' : '🌙';
    toggle.setAttribute('aria-label', isDark ? 'Passa alla modalità chiara' : 'Passa alla modalità scura');
}


// === NAVBAR SCROLL ===
// Aggiunge un'ombra alla navbar quando si scrolla
function initNavScroll() {
    const nav = document.querySelector('.site-nav');
    if (!nav) return;

    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            nav.classList.add('scrolled');
        } else {
            nav.classList.remove('scrolled');
        }
    });
}


// === MOBILE NAV ===
function initMobileNav() {
    const burger = document.getElementById('navBurger');
    const links = document.getElementById('navLinks');
    if (!burger || !links) return;

    burger.addEventListener('click', function() {
        links.classList.toggle('open');
    });

    // Chiudi il menu quando si clicca un link
    links.querySelectorAll('a').forEach(function(link) {
        link.addEventListener('click', function() {
            links.classList.remove('open');
        });
    });
}


// === ANIMAZIONI SCROLL (Intersection Observer) ===
// Gli elementi con classe .reveal si animano quando entrano nel viewport
function initScrollReveal() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    if (reveals.length === 0) return;

    const observer = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Una volta animato, non serve più osservarlo
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.1,      // Si attiva quando il 10% è visibile
        rootMargin: '0px 0px -50px 0px'  // Un po' prima del bordo
    });

    reveals.forEach(function(el) {
        observer.observe(el);
    });
}


// === STAGE CARDS (toggle apri/chiudi) ===
function initStageCards() {
    const headers = document.querySelectorAll('.stage-card-header');
    
    headers.forEach(function(header) {
        header.addEventListener('click', function() {
            const card = header.closest('.stage-card');
            // Chiudi tutte le altre
            document.querySelectorAll('.stage-card.open').forEach(function(c) {
                if (c !== card) c.classList.remove('open');
            });
            // Toggle questa
            card.classList.toggle('open');
        });
    });
}


// === CALCOLATORE PRESENZE ===
// Ore totali del corso - MODIFICA questo numero
const ORE_TOTALI = 999;

function calcolaPresenze() {
    let input = document.getElementById('progresso');
    if (!input) return;
    
    let giorni = parseInt(input.value);
    if (isNaN(giorni) || giorni < 0) giorni = 0;

    let oreAssenza = giorni * 6;  // 6 ore al giorno
    let orePresente = ORE_TOTALI - oreAssenza;
    let percentuale = Math.max(0, Math.round((100 * orePresente) / ORE_TOTALI));

    // Aggiorna barra
    let barra = document.getElementById('barraFill');
    if (barra) barra.style.width = percentuale + '%';

    // Aggiorna testo
    let testo = document.getElementById('percentualeText');
    if (testo) testo.textContent = 'Presenze: ' + percentuale + '%';
}


// === AVVIA TUTTO ===
document.addEventListener('DOMContentLoaded', function() {
    initDarkMode();
    initNavScroll();
    initMobileNav();
    initScrollReveal();
    initStageCards();
});
