document.addEventListener('DOMContentLoaded', () => {
    // 1. Инициализация иконок (Lucide)
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }

    // 2. Хедер: изменение стиля при скролле
    const header = document.querySelector('.header');
    if (header) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 50) {
                header.classList.add('header--scrolled');
            } else {
                header.classList.remove('header--scrolled');
            }
        });
    }

    // 3. Мобильное меню (Бургер)
    const burger = document.getElementById('burger-toggle');
    const mobileMenu = document.getElementById('mobile-menu-overlay');
    
    if (burger && mobileMenu) {
        burger.onclick = () => {
            burger.classList.toggle('burger--active');
            mobileMenu.classList.toggle('mobile-menu--active');
            document.body.style.overflow = mobileMenu.classList.contains('mobile-menu--active') ? 'hidden' : '';
        };

        document.querySelectorAll('.mobile-menu__link').forEach(link => {
            link.onclick = () => {
                burger.classList.remove('burger--active');
                mobileMenu.classList.remove('mobile-menu--active');
                document.body.style.overflow = '';
            };
        });
    }

    // 4. Анимации GSAP + SplitType (Исправленный блок)
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        const heroTitle = document.querySelector('#hero-title');
        
        if (heroTitle && typeof SplitType !== 'undefined') {
            // Разбиваем текст на символы
            const text = new SplitType(heroTitle, { types: 'chars' });
            
            // Используем fromTo, чтобы избежать "исчезновения" заголовка
            gsap.fromTo(text.chars, 
                { 
                    opacity: 0, 
                    y: 20 
                }, 
                { 
                    opacity: 1, 
                    y: 0, 
                    stagger: 0.03, 
                    duration: 0.8, 
                    ease: "power4.out", 
                    delay: 0.3,
                    clearProps: "all" // Очищает инлайн-стили после анимации для стабильности
                }
            );
        }

        // Плавное появление остальных секций с классом .reveal
        document.querySelectorAll('.reveal').forEach(el => {
            gsap.from(el, {
                scrollTrigger: {
                    trigger: el,
                    start: "top 85%",
                },
                opacity: 0,
                y: 30,
                duration: 1,
                ease: "power2.out"
            });
        });
    }

    // 5. Валидация, Капча и Форма
    const mainForm = document.getElementById('main-form');
    const phoneInput = document.getElementById('phone-input');
    const captchaLabel = document.getElementById('captcha-question');
    const captchaInput = document.getElementById('captcha-answer');
    const successBox = document.getElementById('form-message');

    if (mainForm) {
        // Очистка телефона (только цифры и плюс)
        if (phoneInput) {
            phoneInput.oninput = (e) => {
                e.target.value = e.target.value.replace(/[^\d+]/g, '');
            };
        }

        // Логика капчи
        const n1 = Math.floor(Math.random() * 10);
        const n2 = Math.floor(Math.random() * 10);
        const captchaResult = n1 + n2;
        if (captchaLabel) captchaLabel.innerText = `${n1} + ${n2} = `;

        mainForm.onsubmit = (e) => {
            e.preventDefault();

            if (parseInt(captchaInput.value) !== captchaResult) {
                alert('Ошибка в капче! Пожалуйста, проверьте сумму.');
                return;
            }

            const btn = mainForm.querySelector('button[type="submit"]');
            if (btn) {
                btn.disabled = true;
                btn.innerText = 'Отправка...';
            }

            // Имитация отправки формы
            setTimeout(() => {
                mainForm.style.display = 'none';
                if (successBox) {
                    successBox.style.display = 'block';
                    successBox.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    gsap.from(successBox, { opacity: 0, scale: 0.9, duration: 0.5 });
                }
            }, 1500);
        };
    }

    // 6. Cookies Popup
    const cookiePopup = document.getElementById('cookie-popup');
    const cookieBtn = document.getElementById('cookie-accept');
    
    if (cookiePopup && !localStorage.getItem('cookies_ok')) {
        setTimeout(() => cookiePopup.classList.add('cookie-popup--show'), 2000);
        
        if (cookieBtn) {
            cookieBtn.onclick = () => {
                localStorage.setItem('cookies_ok', 'true');
                cookiePopup.classList.remove('cookie-popup--show');
            };
        }
    }
});