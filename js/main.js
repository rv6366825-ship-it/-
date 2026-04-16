/* общий скрипт — авторизация, корзина, слайдер, бургер */

(function () {

    // состояние
    window.currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;
    window.cart        = JSON.parse(localStorage.getItem('cart'))        || [];

    // ссылки на dom
    var userGreeting   = document.getElementById('userGreeting');
    var loginBtn       = document.getElementById('loginBtn');
    var mobileLoginBtn = document.getElementById('mobileLoginBtn');
    var cartCountSpan  = document.getElementById('cartCount');
    var authModal      = document.getElementById('authModal');
    var closeModal     = document.getElementById('closeModal');
    var authForm       = document.getElementById('authForm');
    var modalTitle     = document.getElementById('modalTitle');
    var nameGroup      = document.getElementById('nameGroup');
    var toggleAuth     = document.getElementById('toggleAuth');
    var authEmail      = document.getElementById('authEmail');
    var authPassword   = document.getElementById('authPassword');
    var regName        = document.getElementById('regName');
    var authError      = document.getElementById('authError');
    var toast          = document.getElementById('toast');
    var toastMsg       = document.getElementById('toastMsg');

    var isRegisterMode = false;
    var toastTimer;

    // ---------- toast ----------

    window.showToast = function (msg, icon) {
        icon = icon || '✅';
        var iconEl = document.querySelector('.toast__icon');
        if (iconEl) iconEl.textContent = icon;
        if (toastMsg) toastMsg.textContent = msg;
        if (toast) {
            toast.classList.add('show');
            clearTimeout(toastTimer);
            toastTimer = setTimeout(function () {
                toast.classList.remove('show');
            }, 2500);
        }
    };

    // ---------- бургер ----------

    var burger    = document.getElementById('burgerBtn');
    var mobileNav = document.getElementById('mobileNav');

    if (burger && mobileNav) {
        burger.addEventListener('click', function (e) {
            e.stopPropagation();
            mobileNav.classList.toggle('open');
        });
        document.addEventListener('click', function (e) {
            if (!mobileNav.contains(e.target) && !burger.contains(e.target)) {
                mobileNav.classList.remove('open');
            }
        });
    }

    // ---------- слайдер ----------

    var sliderEl = document.getElementById('mainSlider');

    if (sliderEl) {
        var slides        = sliderEl.querySelectorAll('.slider__slide');
        var dotsWrap      = sliderEl.querySelector('.slider__dots');
        var prevBtn       = sliderEl.querySelector('.slider__arrow--prev');
        var nextBtn       = sliderEl.querySelector('.slider__arrow--next');
        var currentSlide  = 0;
        var autoTimer     = null;

        // создаём точки
        slides.forEach(function (_, i) {
            var dot = document.createElement('span');
            dot.className = 'slider__dot' + (i === 0 ? ' active' : '');
            dot.addEventListener('click', function () {
                goTo(i);
                resetAuto(); // перезапускаем таймер при клике на точку
            });
            dotsWrap.appendChild(dot);
        });

        function goTo(index) {
            slides[currentSlide].classList.remove('active');
            dotsWrap.children[currentSlide].classList.remove('active');
            currentSlide = (index + slides.length) % slides.length;
            slides[currentSlide].classList.add('active');
            dotsWrap.children[currentSlide].classList.add('active');
        }

        function next() { goTo(currentSlide + 1); }
        function prev() { goTo(currentSlide - 1); }

        function startAuto() {
            autoTimer = setInterval(next, 5000);
        }

        function resetAuto() {
            clearInterval(autoTimer);
            startAuto();
        }

        prevBtn.addEventListener('click', function () { prev(); resetAuto(); });
        nextBtn.addEventListener('click', function () { next(); resetAuto(); });

        // пауза при наведении
        sliderEl.addEventListener('mouseenter', function () { clearInterval(autoTimer); });
        sliderEl.addEventListener('mouseleave', function () { startAuto(); });

        startAuto();
    }

    // ---------- корзина ----------

    window.updateCartUI = function () {
        var count = window.cart.reduce(function (s, i) { return s + i.quantity; }, 0);
        if (cartCountSpan) cartCountSpan.textContent = count;
        localStorage.setItem('cart', JSON.stringify(window.cart));
    };

    window.addToCart = function (product) {
        var found = window.cart.find(function (p) { return p.id === product.id; });
        if (found) {
            found.quantity += 1;
        } else {
            window.cart.push(Object.assign({}, product, { quantity: 1 }));
        }
        window.updateCartUI();
        window.showToast('«' + product.name + '» добавлено в корзину');
    };

    window.removeFromCart = function (id) {
        window.cart = window.cart.filter(function (p) { return p.id !== id; });
        window.updateCartUI();
    };

    window.updateCartItemQuantity = function (id, qty) {
        var item = window.cart.find(function (p) { return p.id === id; });
        if (item) {
            item.quantity = qty > 0 ? qty : 1;
            window.updateCartUI();
        }
    };

    // ---------- авторизация ----------

    function updateAuthUI() {
        if (window.currentUser) {
            if (userGreeting) userGreeting.textContent = 'Привет, ' + (window.currentUser.name || window.currentUser.email);
            if (loginBtn)       loginBtn.textContent       = 'Выйти';
            if (mobileLoginBtn) mobileLoginBtn.textContent = 'Выйти';
        } else {
            if (userGreeting) userGreeting.textContent = '';
            if (loginBtn)       loginBtn.textContent       = 'Войти';
            if (mobileLoginBtn) mobileLoginBtn.textContent = 'Войти';
        }
    }

    function openModal(register) {
        if (!authModal) return;
        isRegisterMode = register;
        modalTitle.textContent = register ? 'Регистрация' : 'Вход';
        nameGroup.style.display = register ? 'block' : 'none';
        authForm.querySelector('button[type=submit]').textContent = register ? 'Зарегистрироваться' : 'Войти';
        toggleAuth.textContent = register ? 'Уже есть аккаунт? Войти' : 'Нет аккаунта? Зарегистрироваться';
        authError.textContent = '';
        authModal.classList.add('active');
    }

    function closeModalFn() {
        if (authModal) authModal.classList.remove('active');
    }

    function submitAuth(e) {
        e.preventDefault();
        var email = authEmail.value.trim();
        var pass  = authPassword.value;
        if (!email || !pass) { authError.textContent = 'Заполните все поля'; return; }

        var users = JSON.parse(localStorage.getItem('users')) || [];

        if (isRegisterMode) {
            if (users.find(function (u) { return u.email === email; })) {
                authError.textContent = 'Пользователь уже существует'; return;
            }
            var newUser = { email: email, password: pass, name: regName.value.trim() || 'Гость' };
            users.push(newUser);
            localStorage.setItem('users', JSON.stringify(users));
            window.currentUser = newUser;
        } else {
            var user = users.find(function (u) { return u.email === email && u.password === pass; });
            if (!user) { authError.textContent = 'Неверный email или пароль'; return; }
            window.currentUser = user;
        }

        localStorage.setItem('currentUser', JSON.stringify(window.currentUser));
        closeModalFn();
        updateAuthUI();
    }

    function logout() {
        window.currentUser = null;
        localStorage.removeItem('currentUser');
        updateAuthUI();
    }

    if (loginBtn)       loginBtn.addEventListener('click',       function () { window.currentUser ? logout() : openModal(false); });
    if (mobileLoginBtn) mobileLoginBtn.addEventListener('click', function (e) { e.preventDefault(); window.currentUser ? logout() : openModal(false); });
    if (closeModal)     closeModal.addEventListener('click',     closeModalFn);
    if (toggleAuth)     toggleAuth.addEventListener('click',     function (e) { e.preventDefault(); openModal(!isRegisterMode); });
    if (authForm)       authForm.addEventListener('submit',      submitAuth);

    window.addEventListener('click', function (e) { if (e.target === authModal) closeModalFn(); });

    // ---------- калькулятор ----------

    var calcType   = document.getElementById('calcType');
    var calcHours  = document.getElementById('calcHours');
    var calcResult = document.getElementById('calcResult');
    var calcBtn    = document.getElementById('calcBtn');

    function calcPrice() {
        if (calcType && calcHours && calcResult) {
            var price = parseInt(calcType.value) * parseInt(calcHours.value || 1);
            calcResult.textContent = 'Примерная стоимость: ' + price.toLocaleString('ru') + ' ₽';
        }
    }

    if (calcBtn)   calcBtn.addEventListener('click',  calcPrice);
    if (calcType)  calcType.addEventListener('change', calcPrice);
    if (calcHours) calcHours.addEventListener('input', calcPrice);

    // ---------- инит ----------

    updateAuthUI();
    window.updateCartUI();

}());
