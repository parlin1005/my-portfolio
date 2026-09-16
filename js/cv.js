/**
 * LOGIKA INTERAKTIF UTAMA - PORTOFOLIO PARLIN SIANTURI
 */

document.addEventListener('DOMContentLoaded', () => {

    // ==========================================
    // 1. SISTEM TAB INTERAKTIF (WORK HISTORY)
    // ==========================================
    const tabButtons = document.querySelectorAll('.tab-btn-card');
    const tabContents = document.querySelectorAll('.tab-content');

    tabButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Reset seluruh tombol & ikon
            tabButtons.forEach(btn => {
                btn.classList.remove('active');
                const icon = btn.querySelector('.tab-icon');
                if (icon) {
                    icon.className = 'fa-solid fa-chevron-right tab-icon';
                }
            });

            // Sembunyikan seluruh konten tab
            tabContents.forEach(content => content.classList.remove('active'));

            // Aktifkan tombol yang diklik & ganti ikon ke chevron down
            button.classList.add('active');
            const currentIcon = button.querySelector('.tab-icon');
            if (currentIcon) {
                currentIcon.className = 'fa-solid fa-chevron-down tab-icon';
            }
            
            // Tampilkan konten target
            const targetId = button.getAttribute('data-target');
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });

    // ==========================================
    // 2. SISTEM FILTERING SKILLS (DENGAN EFEK ANIMASI)
    // ==========================================
    const filterButtons = document.querySelectorAll('.skill-filter-btn');
    const skillCards = document.querySelectorAll('.skill-modern-card');

    if (filterButtons.length > 0 && skillCards.length > 0) {
        filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                // Ubah status tombol aktif
                filterButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');

                const filterValue = btn.getAttribute('data-filter');

                // Terapkan animasi pada setiap kartu skill
                skillCards.forEach(card => {
                    const category = card.getAttribute('data-category');
                    const isMatch = (filterValue === 'all' || category === filterValue);

                    if (isMatch) {
                        card.classList.remove('hide');
                        card.classList.add('show');
                    } else {
                        card.classList.remove('show');
                        card.classList.add('hide');
                    }
                });
            });
        });
    }

    // ==========================================
    // 3. SISTEM MODAL POPUP (PROJECTS)
    // ==========================================
    const projectCards = document.querySelectorAll('.project-card');
    const modalCloseBtns = document.querySelectorAll('.modal-close-btn');
    const modalBackdrops = document.querySelectorAll('.modal-backdrop');

    // Buka Modal saat kartu diklik
    projectCards.forEach(card => {
        card.addEventListener('click', () => {
            const targetModalId = card.getAttribute('data-modal');
            const targetModal = document.getElementById(targetModalId);
            if (targetModal) {
                targetModal.classList.add('active');
                document.body.style.overflow = 'hidden'; // Mencegah scroll background
            }
        });
    });

    // Fungsi Tutup Modal
    const closeModal = () => {
        const activeModals = document.querySelectorAll('.project-modal.active');
        activeModals.forEach(modal => {
            modal.classList.remove('active');
        });
        document.body.style.overflow = ''; // Kembalikan scroll
    };

    // Pemicu Tutup lewat tombol X
    modalCloseBtns.forEach(btn => btn.addEventListener('click', closeModal));

    // Pemicu Tutup lewat klik luar (backdrop)
    modalBackdrops.forEach(backdrop => backdrop.addEventListener('click', closeModal));

    // Pemicu Tutup lewat tombol ESC keyboard
    document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            closeModal();
        }
    });

    // ==========================================
    // 3B. MODAL "LET'S CHAT" — PROFESSIONAL COLLABORATION OFFER
    // ==========================================
    const letsChatBtn  = document.getElementById('btn-lets-chat');
    const collabModal   = document.getElementById('modal-collab');

    if (letsChatBtn && collabModal) {
        letsChatBtn.addEventListener('click', () => {
            collabModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        });
    }

    // Pemilihan tab model kolaborasi (Full-Time / Contract / Freelance)
    const collabTabButtons = document.querySelectorAll('.collab-tab-btn');
    const collabModelInput = document.getElementById('collab-model-input');

    collabTabButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            collabTabButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (collabModelInput) {
                collabModelInput.value = btn.getAttribute('data-model');
            }
        });
    });

    // Link "Print Official Resume" di dalam modal -> pakai fungsi print yang sama
    const collabPrintLink = document.getElementById('collab-print-link');
    if (collabPrintLink) {
        collabPrintLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.print();
        });
    }

    // Submit form kolaborasi via Formspree
    const collabForm       = document.getElementById('collab-form');
    const collabFormStatus = document.getElementById('collab-form-status');
    const collabSubmitBtn  = document.getElementById('collab-submit-btn');

    function setCollabStatus(message, type) {
        if (!collabFormStatus) return;
        collabFormStatus.textContent = message;
        collabFormStatus.className = 'form-status ' + type;
    }

    if (collabForm) {
        collabForm.addEventListener('submit', (event) => {
            event.preventDefault();

            const honeypot = collabForm.querySelector('[name="_gotcha"]').value;
            if (honeypot) {
                setCollabStatus('Thank you! Your offer has been sent.', 'success');
                collabForm.reset();
                return;
            }

            setCollabStatus('Sending your offer...', 'loading');
            if (collabSubmitBtn) collabSubmitBtn.disabled = true;

            fetch(collabForm.action, {
                method: 'POST',
                body: new FormData(collabForm),
                headers: { 'Accept': 'application/json' }
            })
            .then((response) => {
                if (response.ok) {
                    setCollabStatus('Thank you! Your offer has been sent. Parlin will get back to you shortly.', 'success');
                    collabForm.reset();
                } else {
                    return response.json().then((data) => {
                        const errMsg = (data && data.errors)
                            ? data.errors.map((err) => err.message).join(', ')
                            : 'Something went wrong while sending your offer.';
                        setCollabStatus(errMsg + ' Please try again or contact directly by phone.', 'error');
                    });
                }
            })
            .catch(() => {
                setCollabStatus('Failed to send. Please check your connection and try again, or contact directly by phone.', 'error');
            })
            .finally(() => {
                if (collabSubmitBtn) collabSubmitBtn.disabled = false;
            });
        });
    }

    // ==========================================
    // 4. SISTEM EKSPOR DOKUMEN CETAK / PDF
    // ==========================================
    
    // Pemicu 1: Tombol Download CV di Navbar Atas
    const topPrintPill = document.getElementById('btn-print');
    if (topPrintPill) {
        topPrintPill.addEventListener('click', () => {
            window.print();
        });
    }

    // Pemicu 2: Link Download CV di Hero Section Kanan
    const bottomPrintLink = document.getElementById('btn-print-link');
    if (bottomPrintLink) {
        bottomPrintLink.addEventListener('click', (event) => {
            event.preventDefault();
            window.print();
        });
    }

    // ==========================================
    // 5. NAVBAR MOBILE — OVERLAY MENU FULLSCREEN
    // ==========================================
    const navToggle      = document.getElementById('nav-toggle');
    const mobileOverlay  = document.getElementById('mobile-menu-overlay');

    function openMobileOverlay() {
        mobileOverlay.classList.add('active');
        document.body.style.overflow = 'hidden'; // Cegah scroll background saat overlay terbuka
        const icon = navToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-bars', 'fa-xmark');
    }

    function closeMobileOverlay() {
        mobileOverlay.classList.remove('active');
        document.body.style.overflow = ''; // Kembalikan scroll
        const icon = navToggle.querySelector('i');
        if (icon) icon.classList.replace('fa-xmark', 'fa-bars');
    }

    if (navToggle && mobileOverlay) {

        // Buka/tutup saat tombol hamburger diklik
        navToggle.addEventListener('click', () => {
            if (mobileOverlay.classList.contains('active')) {
                closeMobileOverlay();
            } else {
                openMobileOverlay();
            }
        });

        // Tutup otomatis saat salah satu link/CTA di dalam overlay diklik
        mobileOverlay.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', closeMobileOverlay);
        });

        // Tutup dengan tombol ESC keyboard
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && mobileOverlay.classList.contains('active')) {
                closeMobileOverlay();
            }
        });
    }

    // ==========================================
    // 6. CONTACT FORM SUBMISSION (FORMSPREE)
    // ==========================================
    const contactForm      = document.getElementById('contact-form');
    const formStatus       = document.getElementById('form-status');
    const contactSubmitBtn = document.getElementById('contact-submit-btn');

    function setFormStatus(message, type) {
        if (!formStatus) return;
        formStatus.textContent = message;
        formStatus.className = 'form-status ' + type;
    }

    if (contactForm) {
        contactForm.addEventListener('submit', (event) => {
            event.preventDefault();

            // Honeypot: kalau field tersembunyi terisi, kemungkinan besar bot
            const honeypot = contactForm.querySelector('[name="_gotcha"]').value;
            if (honeypot) {
                setFormStatus('Thank you! Your message has been sent.', 'success');
                contactForm.reset();
                return;
            }

            setFormStatus('Sending your message...', 'loading');
            if (contactSubmitBtn) contactSubmitBtn.disabled = true;

            fetch(contactForm.action, {
                method: 'POST',
                body: new FormData(contactForm),
                headers: { 'Accept': 'application/json' }
            })
            .then((response) => {
                if (response.ok) {
                    setFormStatus('Thank you! Your message has been sent. Parlin will get back to you shortly.', 'success');
                    contactForm.reset();
                } else {
                    return response.json().then((data) => {
                        const errMsg = (data && data.errors)
                            ? data.errors.map((err) => err.message).join(', ')
                            : 'Something went wrong while sending your message.';
                        setFormStatus(errMsg + ' Please try again or email directly.', 'error');
                    });
                }
            })
            .catch(() => {
                setFormStatus('Failed to send. Please check your connection and try again, or email directly.', 'error');
            })
            .finally(() => {
                if (contactSubmitBtn) contactSubmitBtn.disabled = false;
            });
        });
    }

});