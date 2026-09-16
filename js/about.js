// =========================================================
// about.js — JavaScript untuk Halaman About Parlin Sianturi
// =========================================================

const hamburgerAboutBtn = document.getElementById('hamburger-about-btn');
const mobileMenuAbout = document.getElementById('mobile-menu-about');

if (hamburgerAboutBtn && mobileMenuAbout) {
    hamburgerAboutBtn.addEventListener('click', function () {
        mobileMenuAbout.classList.toggle('open');
        const icon = hamburgerAboutBtn.querySelector('i');
        if (mobileMenuAbout.classList.contains('open')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    mobileMenuAbout.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenuAbout.classList.remove('open');
            const icon = hamburgerAboutBtn.querySelector('i');
            icon.classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // Reset menu & ikon saat window di-resize melewati breakpoint mobile (768px).
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileMenuAbout.classList.contains('open')) {
            mobileMenuAbout.classList.remove('open');
            const icon = hamburgerAboutBtn.querySelector('i');
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
}
