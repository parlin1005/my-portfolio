const hamburgerBtn = document.getElementById('hamburger-sejarah-btn');
        const mobileMenu = document.getElementById('mobile-menu-sejarah');

        if (hamburgerBtn && mobileMenu) {
            // Logika Klik Tombol Hamburger
            hamburgerBtn.addEventListener('click', function () {
                mobileMenu.classList.toggle('open'); // Buka/tutup menu dengan class 'open'
                
                // Animasi ganti ikon dari garis tiga (fa-bars) ke silang (fa-xmark)
                const icon = hamburgerBtn.querySelector('i');
                if (mobileMenu.classList.contains('open')) {
                    icon.classList.replace('fa-bars', 'fa-xmark');
                } else {
                    icon.classList.replace('fa-xmark', 'fa-bars');
                }
            });

            // Otomatis menutup menu mobile jika salah satu link di dalamnya diklik
            mobileMenu.querySelectorAll('a').forEach(function (link) {
                link.addEventListener('click', function () {
                    mobileMenu.classList.remove('open');
                    const icon = hamburgerBtn.querySelector('i');
                    icon.classList.replace('fa-xmark', 'fa-bars');
                });
            });
        }

        // ==========================================================================
        // LOGIKA TOMBOL KEMBALI KE ATAS (Opsi 3)
        // ==========================================================================
        const backToTopBtn = document.getElementById('back-to-top-btn');

        if (backToTopBtn) {
            // Pantau pergerakan scroll layar pengguna
            window.addEventListener('scroll', function () {
                // Jika layar digulir ke bawah lebih dari 300px, munculkan tombol
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('show');
                } else {
                    // Jika kembali ke atas, sembunyikan kembali
                    backToTopBtn.classList.remove('show');
                }
            });

            // Logika ketika tombol diklik
            backToTopBtn.addEventListener('click', function () {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth' /* Efek meluncur halus ke atas */
                });
            });
        }

        // ==========================================================================
        // LOGIKA PREMIUM PAGE LOADER (Opsi 1)
        // ==========================================================================
        window.addEventListener('load', function () {
            const pageLoader = document.getElementById('page-loader');
            
            if (pageLoader) {
                // Memberikan jeda sengaja 600ms (0.6 detik) agar animasi loader terlihat anggun
                // dan memastikan seluruh gambar/aset lokal sudah siap dirender browser
                setTimeout(function () {
                    pageLoader.classList.add('fade-out'); // Memicu transisi menghilang di CSS
                }, 600);
            }
        });