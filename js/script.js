// =========================================================
// scripts.js — JavaScript untuk Portofolio Parlin Sianturi
// =========================================================

// =========================================================
// 1. HAMBURGER MENU (Menu Mobile)
//    Mengontrol buka/tutup menu navigasi di layar HP
// =========================================================
const hamburgerBtn = document.getElementById('hamburger-btn');
const mobileMenu = document.getElementById('mobile-menu');

if (hamburgerBtn && mobileMenu) {
    hamburgerBtn.addEventListener('click', function () {
        // Toggle class 'open' untuk menampilkan/menyembunyikan menu
        mobileMenu.classList.toggle('open');

        // Ganti ikon: bars (☰) ↔ xmark (✕)
        const icon = hamburgerBtn.querySelector('i');
        if (mobileMenu.classList.contains('open')) {
            icon.classList.replace('fa-bars', 'fa-xmark');
        } else {
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });

    // Tutup menu otomatis saat salah satu link di klik
    const mobileLinks = mobileMenu.querySelectorAll('a');
    mobileLinks.forEach(function (link) {
        link.addEventListener('click', function () {
            mobileMenu.classList.remove('open');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.replace('fa-xmark', 'fa-bars');
        });
    });

    // Reset menu & ikon saat window di-resize melewati breakpoint mobile (768px).
    // Mencegah menu "nyangkut" terbuka tanpa tombol close saat browser diperbesar ke lebar desktop.
    window.addEventListener('resize', function () {
        if (window.innerWidth > 768 && mobileMenu.classList.contains('open')) {
            mobileMenu.classList.remove('open');
            const icon = hamburgerBtn.querySelector('i');
            icon.classList.replace('fa-xmark', 'fa-bars');
        }
    });
}

// ============================================================
// FITUR BARU 1: Header berubah saat di-scroll
// Tambahkan kode ini di bawah kode hamburger menu
// ============================================================

// Tangkap elemen <header> dari HTML
const header = document.querySelector('header');

// Dengarkan event 'scroll' pada window (keseluruhan jendela browser)
window.addEventListener('scroll', function () {

    if (window.scrollY > 50) {
        // Sudah scroll lebih dari 50px dari atas → tambah class 'scrolled'
        header.classList.add('scrolled');
    } else {
        // Posisi kembali ke atas → hapus class 'scrolled'
        header.classList.remove('scrolled');
    }
});


// ============================================================
// FITUR BARU 2: Validasi form contact sebelum dikirim
// ============================================================

// Tangkap elemen form & elemen pendukung dari HTML
const contactForm     = document.getElementById('contact-form');
const formStatus      = document.getElementById('form-status');
const contactSubmitBtn = document.getElementById('contact-submit-btn');

// Fungsi kecil untuk menampilkan status ke pengguna (ganti alert())
function setFormStatus(message, type) {
    if (!formStatus) return;
    formStatus.textContent = message;
    // type: 'error' | 'success' | 'loading' -> dipakai untuk styling di CSS
    formStatus.className = 'form-status ' + type;
}

// Jalankan hanya kalau form ditemukan di halaman ini
if (contactForm) {

    contactForm.addEventListener('submit', function (e) {
        // Cegah form melakukan reload halaman (default browser)
        e.preventDefault();

        // Ambil nilai dari tiap field, .trim() untuk hapus spasi tidak perlu
        const nama  = document.getElementById('name').value.trim();
        const email = document.getElementById('email').value.trim();
        const pesan = document.getElementById('message').value.trim();

        // Honeypot: kalau field tersembunyi ini terisi, kemungkinan besar ini bot.
        // Diam-diam anggap "berhasil" tanpa benar-benar mengirim, supaya bot tidak tahu ditolak.
        const honeypot = contactForm.querySelector('[name="_gotcha"]').value;
        if (honeypot) {
            setFormStatus('Pesan berhasil dikirim! Terima kasih ' + nama + ' 🎉', 'success');
            contactForm.reset();
            return;
        }

        // Cek format email: harus ada '@' dan '.'
        const emailValid = email.includes('@') && email.includes('.');

        // Kalau ada yang tidak valid, hentikan dan tampilkan pesan error di halaman
        if (!nama) {
            setFormStatus('Nama tidak boleh kosong!', 'error');
            return; // Hentikan fungsi di sini, tidak lanjut ke bawah
        }
        if (!emailValid) {
            setFormStatus('Masukkan email yang valid, contoh: nama@email.com', 'error');
            return;
        }
        if (pesan.length < 10) {
            setFormStatus('Pesan terlalu pendek, minimal 10 karakter.', 'error');
            return;
        }

        // Semua validasi lolos -> kirim sungguhan ke Formspree via fetch
        setFormStatus('Mengirim pesan...', 'loading');
        if (contactSubmitBtn) contactSubmitBtn.disabled = true;

        fetch(contactForm.action, {
            method: 'POST',
            body: new FormData(contactForm),
            headers: {
                'Accept': 'application/json'
            }
        })
        .then(function (response) {
            if (response.ok) {
                setFormStatus('Pesan berhasil dikirim! Terima kasih ' + nama + ', saya akan segera membalas 🎉', 'success');
                contactForm.reset();
            } else {
                // Formspree biasanya mengirim detail error dalam JSON
                return response.json().then(function (data) {
                    const errMsg = (data && data.errors)
                        ? data.errors.map(function (err) { return err.message; }).join(', ')
                        : 'Terjadi kesalahan saat mengirim pesan.';
                    setFormStatus(errMsg + ' Coba lagi atau hubungi langsung via email.', 'error');
                });
            }
        })
        .catch(function () {
            setFormStatus('Gagal mengirim pesan. Periksa koneksi internet Anda dan coba lagi, atau hubungi langsung via email.', 'error');
        })
        .finally(function () {
            if (contactSubmitBtn) contactSubmitBtn.disabled = false;
        });
    });
}

// =========================================================
// 2. SMOOTH SCROLL
//    Membuat perpindahan antar section terasa halus
// =========================================================
document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
        const targetId = this.getAttribute('href');

        // Pastikan ini anchor internal (bukan link ke halaman lain)
        if (targetId === '#') return;

        const targetSection = document.querySelector(targetId);
        if (targetSection) {
            e.preventDefault();
            targetSection.scrollIntoView({
                behavior: 'smooth'
            });
        }
    });
});

// ============================================================
// UPGRADE: Scroll Reveal Animation
// Cara kerja: IntersectionObserver "mengawasi" elemen-elemen
// bertanda .reveal. Saat elemen masuk ke area layar yang terlihat,
// observer menambahkan class .visible → CSS animasi berjalan
// ============================================================

// Buat "pengamat" yang memantau elemen masuk/keluar layar
const revealObserver = new IntersectionObserver(

    function(entries) {
        // 'entries' = daftar semua elemen yang sedang dipantau
        entries.forEach(function(entry) {

            if (entry.isIntersecting) {
                // Elemen sudah masuk ke area yang terlihat di layar
                entry.target.classList.add('visible');
                // ↑ Tambahkan class .visible → CSS animasi berjalan

                // Setelah terlihat, berhenti pantau elemen ini
                // (animasi cukup sekali, tidak perlu diulang)
                revealObserver.unobserve(entry.target);
            }
        });
    },

    {
        threshold: 0.15
        // ↑ Animasi mulai saat 15% dari elemen sudah terlihat di layar
        // Nilai 0 = begitu sedikit saja masuk, 1 = harus terlihat penuh
    }
);

// Daftarkan semua elemen dengan class .reveal untuk dipantau
document.querySelectorAll('.reveal').forEach(function(el) {
    revealObserver.observe(el);
    // ↑ "Hai pengamat, tolong pantau elemen ini!"
});

// ============================================================
// UPGRADE: Active Navigation saat Scroll
// Cara kerja: Saat scroll, cek section mana yang sedang terlihat
// di layar. Link nav yang sesuai diberi class .active
// ============================================================

// Kumpulkan semua section yang punya id
const sections = document.querySelectorAll('main section[id]');
// ↑ Ambil semua <section> yang punya atribut id di dalam <main>

const navLinks = document.querySelectorAll('.nav-links a');
// ↑ Ambil semua link di navigasi desktop

window.addEventListener('scroll', function () {

    // Cari tahu posisi scroll saat ini
    const scrollPosition = window.scrollY + 200;
    // ↑ +200 = offset supaya nav aktif sedikit lebih awal
    //   sebelum section benar-benar di paling atas

    sections.forEach(function (section) {

        // Ambil posisi atas dan tinggi section ini
        const sectionTop    = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId     = section.getAttribute('id');

        // Cek apakah posisi scroll sedang berada di dalam section ini
        if (scrollPosition >= sectionTop &&
            scrollPosition < sectionTop + sectionHeight) {

            // Hapus class .active dari SEMUA link nav dulu
            navLinks.forEach(function (link) {
                link.classList.remove('active');
            });

            // Tambahkan .active hanya ke link yang href-nya cocok
            const activeLink = document.querySelector(
                '.nav-links a[href="#' + sectionId + '"]'
            );
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    });
});
// ============================================================
// MODAL PENDIDIKAN — Vertical Timeline
// ============================================================

const eduOpenBtn  = document.getElementById('edu-open-btn');
const eduModal    = document.getElementById('edu-modal');
const eduCloseBtn = document.getElementById('edu-close-btn');

// Fungsi generik buka/tutup modal — menerima parameter elemen modal
function openModal(modalEl) {
    modalEl.classList.remove('hidden');
    document.body.style.overflow = 'hidden'; /* Cegah scroll background */
}

function closeModal(modalEl) {
    modalEl.classList.add('hidden');
    document.body.style.overflow = '';       /* Kembalikan scroll background */
}

// Pasang event untuk modal Pendidikan
if (eduOpenBtn && eduModal && eduCloseBtn) {

    // Buka saat tombol "Selengkapnya" diklik
    eduOpenBtn.addEventListener('click', function () {
        openModal(eduModal);
    });

    // Tutup saat tombol × diklik
    eduCloseBtn.addEventListener('click', function () {
        closeModal(eduModal);
    });

    // Tutup saat klik area gelap di luar kotak modal
    eduModal.addEventListener('click', function (e) {
        if (e.target === eduModal) closeModal(eduModal);
    });
}

// ============================================================
// MODAL PENGALAMAN KERJA — Interactive Accordion
// ============================================================

const expOpenBtn  = document.getElementById('exp-open-btn');
const expModal    = document.getElementById('exp-modal');
const expCloseBtn = document.getElementById('exp-close-btn');

// Pasang event untuk modal Pengalaman
if (expOpenBtn && expModal && expCloseBtn) {

    expOpenBtn.addEventListener('click', function () {
        openModal(expModal);
    });

    expCloseBtn.addEventListener('click', function () {
        closeModal(expModal);
    });

    expModal.addEventListener('click', function (e) {
        if (e.target === expModal) closeModal(expModal);
    });

    // --- Logika Accordion ---
    // querySelectorAll mengembalikan semua tombol trigger dalam modal ini
    const accTriggers = expModal.querySelectorAll('.acc-trigger');

    accTriggers.forEach(function (trigger) {
        trigger.addEventListener('click', function () {

            // Ambil konten (.acc-body) yang ada tepat setelah trigger ini
            const body = this.nextElementSibling;
            // 'this' = trigger yang diklik, nextElementSibling = elemen HTML berikutnya

            const isOpen = body.classList.contains('open');
            // Cek apakah accordion ini sedang terbuka atau tertutup

            // Langkah 1: Tutup SEMUA accordion yang sedang terbuka
            // (hanya satu yang boleh terbuka di satu waktu)
            accTriggers.forEach(function (t) {
                t.classList.remove('active');
                t.setAttribute('aria-expanded', 'false');
                t.nextElementSibling.classList.remove('open');
            });

            // Langkah 2: Kalau accordion ini sebelumnya TERTUTUP → buka
            // Kalau sebelumnya TERBUKA → biarkan tertutup (sudah ditutup di langkah 1)
            if (!isOpen) {
                this.classList.add('active');
                this.setAttribute('aria-expanded', 'true');
                body.classList.add('open');
            }
        });
    });
}

// ============================================================
// TUTUP SEMUA MODAL SAAT TOMBOL ESCAPE DITEKAN
// Berlaku untuk modal Pendidikan maupun Pengalaman
// ============================================================
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        // Tutup modal manapun yang sedang terbuka (tidak punya class 'hidden')
        [eduModal, expModal].forEach(function (modal) {
            if (modal && !modal.classList.contains('hidden')) {
                closeModal(modal);
            }
        });
    }
});