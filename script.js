// DOM要素の取得
const themeToggle = document.getElementById('themeToggle');
const navToggle = document.querySelector('.nav-toggle');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');
const contactForm = document.querySelector('.contact-form');

// スライドショー関連
const slides = document.querySelectorAll('.hero-slide');
const slideDots = document.querySelectorAll('.slide-dot');
let currentSlide = 0;
let slideInterval;

// 円形サービスカルーセル関連
let currentServiceIndex = 0;
let rotationAngle = 0;
const serviceContents = document.querySelectorAll('.service-content');
const serviceNumbers = ['01', '02', '03', '04'];

// ケーススタディカルーセル関連
let currentCaseSlide = 0;
const caseSlides = document.querySelectorAll('.case-slide');
const caseIndicators = document.querySelectorAll('.case-indicator');

// テーマ切り替え機能
let isDarkMode = false;

function toggleTheme() {
    isDarkMode = !isDarkMode;
    const body = document.body;
    const themeIcon = document.querySelector('.theme-icon');
    
    if (isDarkMode) {
        body.setAttribute('data-theme', 'dark');
        themeIcon.textContent = '☀️';
        localStorage.setItem('theme', 'dark');
    } else {
        body.setAttribute('data-theme', 'light');
        themeIcon.textContent = '🌙';
        localStorage.setItem('theme', 'light');
    }
}

// 保存されたテーマの読み込み
function loadTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark') {
        isDarkMode = true;
        document.body.setAttribute('data-theme', 'dark');
        document.querySelector('.theme-icon').textContent = '☀️';
    }
}

// モバイルメニュー切り替え
function toggleMobileMenu() {
    navMenu.classList.toggle('active');
    navToggle.classList.toggle('active');
}

// スムーススクロール
function smoothScroll(target) {
    const element = document.querySelector(target);
    if (element) {
        const offsetTop = element.offsetTop - 80;
        window.scrollTo({
            top: offsetTop,
            behavior: 'smooth'
        });
    }
}

// スライドショー機能
function initSlideshow() {
    // 自動スライド切り替え（3秒間隔）
    slideInterval = setInterval(() => {
        nextSlide();
    }, 3000);
    
    // ドットクリックイベント
    slideDots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
    });
}

function goToSlide(index) {
    // 現在のスライドを非アクティブに
    slides[currentSlide].classList.remove('active');
    slideDots[currentSlide].classList.remove('active');
    
    // 新しいスライドをアクティブに
    currentSlide = index;
    slides[currentSlide].classList.add('active');
    slideDots[currentSlide].classList.add('active');
    
    // 自動スライドをリセット
    clearInterval(slideInterval);
    slideInterval = setInterval(() => {
        nextSlide();
    }, 3000);
}

function nextSlide() {
    const nextIndex = (currentSlide + 1) % slides.length;
    goToSlide(nextIndex);
}

// スクロール時のヘッダー効果
function handleScroll() {
    const header = document.querySelector('.header');
    const scrollPosition = window.scrollY;
    
    if (scrollPosition > 100) {
        header.style.background = 'rgba(255, 255, 255, 0.98)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = '0 2px 20px rgba(0, 0, 0, 0.1)';
    } else {
        header.style.background = 'rgba(255, 255, 255, 0.95)';
        header.style.backdropFilter = 'blur(10px)';
        header.style.boxShadow = 'none';
    }
}

// サービスカードのホバー効果
function initServiceCards() {
    const serviceCards = document.querySelectorAll('.service-card');
    
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transform = 'translateY(-15px) scale(1.02)';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// カウンターアニメーション
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;
    
    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.textContent.replace(/\D/g, ''));
            const count = parseInt(counter.getAttribute('data-count') || 0);
            const increment = target / speed;
            
            if (count < target) {
                counter.setAttribute('data-count', Math.ceil(count + increment));
                counter.textContent = Math.ceil(count + increment) + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('年') ? '年' : '');
                setTimeout(updateCount, 1);
            } else {
                counter.textContent = target + (counter.textContent.includes('+') ? '+' : '') + (counter.textContent.includes('年') ? '年' : '');
            }
        };
        
        // Intersection Observer for triggering animation when in view
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCount();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// フォーム送信処理
function handleFormSubmit(e) {
    e.preventDefault();
    
    const formData = new FormData(contactForm);
    const name = formData.get('name');
    const email = formData.get('email');
    const message = formData.get('message');
    
    // 簡単なバリデーション
    if (!name || !email || !message) {
        alert('すべての項目を入力してください。');
        return;
    }
    
    // メール形式のチェック
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('正しいメールアドレスを入力してください。');
        return;
    }
    
    // 送信アニメーション
    const submitButton = contactForm.querySelector('button[type="submit"]');
    const originalText = submitButton.textContent;
    submitButton.textContent = '送信中...';
    submitButton.disabled = true;
    
    // 実際の送信処理をシミュレート
    setTimeout(() => {
        alert('メッセージが送信されました！ありがとうございます。');
        contactForm.reset();
        submitButton.textContent = originalText;
        submitButton.disabled = false;
    }, 2000);
}

// 要素の遅延表示アニメーション
function initFadeInAnimation() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);
    
    // アニメーション対象要素
    const animatedElements = document.querySelectorAll(
        '.service-card, .team-member, .about-text, .contact-info, .contact-form'
    );
    
    animatedElements.forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
        observer.observe(el);
    });
}

// スライドショーの一時停止/再開（ホバー時）
function initSlideshowPause() {
    const hero = document.querySelector('.hero');
    
    hero.addEventListener('mouseenter', () => {
        clearInterval(slideInterval);
    });
    
    hero.addEventListener('mouseleave', () => {
        slideInterval = setInterval(() => {
            nextSlide();
        }, 3000);
    });
}

// スムーズなスクロール効果
function initSmoothScrolling() {
    // すでにCSS scroll-behavior: smooth があるため、
    // 追加のスムーズスクロール処理は必要最小限に
}

// イベントリスナーの設定
function initEventListeners() {
    // テーマ切り替え
    themeToggle.addEventListener('click', toggleTheme);
    
    // モバイルメニュー
    navToggle.addEventListener('click', toggleMobileMenu);
    
    // ナビゲーションリンク
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const target = link.getAttribute('href');
            smoothScroll(target);
            
            // モバイルメニューを閉じる
            if (navMenu.classList.contains('active')) {
                toggleMobileMenu();
            }
        });
    });
    
    // スクロールイベント
    window.addEventListener('scroll', handleScroll);
    
    // フォーム送信
    if (contactForm) {
        contactForm.addEventListener('submit', handleFormSubmit);
    }
    
    // ウィンドウリサイズ対応
    window.addEventListener('resize', () => {
        // モバイルメニューが開いている場合は閉じる
        if (window.innerWidth > 768 && navMenu.classList.contains('active')) {
            toggleMobileMenu();
        }
    });
}

// フォント読み込み確認機能
function checkFontLoading() {
    // フォントファミリーを確実に適用
    const testElement = document.createElement('div');
    testElement.style.fontFamily = 'Noto Sans JP, Roboto, sans-serif';
    testElement.style.fontSize = '16px';
    testElement.textContent = 'テストフォント';
    testElement.style.position = 'absolute';
    testElement.style.visibility = 'hidden';
    document.body.appendChild(testElement);
    
    // フォント読み込み待機
    if (document.fonts) {
        document.fonts.ready.then(() => {
            console.log('フォント読み込み完了');
            document.body.style.fontFamily = 'Noto Sans JP, Roboto, SF Pro Display, SF Pro Text, Segoe UI, Helvetica Neue, Arial, system-ui, sans-serif';
        });
    }
    
    document.body.removeChild(testElement);
}

// フォント強制適用機能
function forceApplyFonts() {
    const elementsToUpdate = [
        'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 
        'p', 'span', 'div', 'a', 'button', 
        'input', 'textarea', 'label'
    ];
    
    elementsToUpdate.forEach(tag => {
        const elements = document.getElementsByTagName(tag);
        for (let i = 0; i < elements.length; i++) {
            elements[i].style.fontFamily = 'Noto Sans JP, Roboto, SF Pro Display, SF Pro Text, Segoe UI, Helvetica Neue, Arial, system-ui, sans-serif';
        }
    });
}

// ページ読み込み時の初期化
document.addEventListener('DOMContentLoaded', function() {
    // フォント確認・適用
    checkFontLoading();
    forceApplyFonts();
    
    // 初期化関数の実行
    loadTheme();
    initEventListeners();
    initServiceCards();
    animateCounters();
    initFadeInAnimation();
    initSlideshow();
    initSlideshowPause();
    initSmoothScrolling();
    
    // ページローディング完了後の処理
    window.addEventListener('load', function() {
        // フォント再適用
        setTimeout(() => {
            forceApplyFonts();
        }, 100);
        
        // ローディングアニメーションがある場合の処理
        document.body.classList.add('loaded');
    });
});

// パフォーマンス最適化
// スクロールイベントのスロットリング
let ticking = false;
function optimizedScroll() {
    if (!ticking) {
        requestAnimationFrame(handleScroll);
        ticking = true;
        setTimeout(() => { ticking = false; }, 16);
    }
}

// 最適化されたスクロールイベントに置き換え
window.removeEventListener('scroll', handleScroll);
window.addEventListener('scroll', optimizedScroll, { passive: true });

// 円形サービスカルーセル機能
function rotateServices(direction) {
    // 新しいサービスインデックスを計算
    currentServiceIndex += direction;
    
    if (currentServiceIndex >= serviceNumbers.length) {
        currentServiceIndex = 0;
    } else if (currentServiceIndex < 0) {
        currentServiceIndex = serviceNumbers.length - 1;
    }
    
    // 回転角度を更新（90度ずつ回転）
    rotationAngle += direction * 90;
    
    // アイコンを回転
    const orbitIcons = document.querySelector('.orbit-icons');
    if (orbitIcons) {
        orbitIcons.style.transform = `rotate(${rotationAngle}deg)`;
    }
    
    // サービスコンテンツを切り替え
    updateServiceContent();
    
    // サービス番号を更新
    updateServiceNumber();
}

function updateServiceContent() {
    // 全てのコンテンツを非アクティブに
    serviceContents.forEach(content => {
        content.classList.remove('active');
    });
    
    // 現在のコンテンツをアクティブに
    if (serviceContents[currentServiceIndex]) {
        serviceContents[currentServiceIndex].classList.add('active');
    }
}

function updateServiceNumber() {
    const serviceNumberElement = document.querySelector('.service-number');
    if (serviceNumberElement) {
        // アニメーション付きで番号を更新
        serviceNumberElement.style.transform = 'scale(0.8)';
        serviceNumberElement.style.opacity = '0.5';
        
        setTimeout(() => {
            serviceNumberElement.textContent = serviceNumbers[currentServiceIndex];
            serviceNumberElement.style.transform = 'scale(1)';
            serviceNumberElement.style.opacity = '1';
        }, 150);
    }
}

// 円形カルーセルの初期化
function initCircularCarousel() {
    // 初期状態を設定
    updateServiceContent();
    updateServiceNumber();
    
    // 自動回転（8秒間隔）
    setInterval(() => {
        rotateServices(1);
    }, 8000);
    
    // アイコンにホバーエフェクトを追加
    const iconWrappers = document.querySelectorAll('.icon-wrapper');
    iconWrappers.forEach(wrapper => {
        wrapper.addEventListener('mouseenter', () => {
            wrapper.style.transform = 'scale(1.2)';
        });
        
        wrapper.addEventListener('mouseleave', () => {
            wrapper.style.transform = 'scale(1)';
        });
    });
}

// ケーススタディカルーセル機能
function changeCaseSlide(direction) {
    if (caseSlides.length === 0) return;
    
    // 現在のスライドを非アクティブに
    caseSlides[currentCaseSlide].classList.remove('active');
    caseIndicators[currentCaseSlide].classList.remove('active');
    
    // 新しいスライドインデックスを計算
    currentCaseSlide += direction;
    
    if (currentCaseSlide >= caseSlides.length) {
        currentCaseSlide = 0;
    } else if (currentCaseSlide < 0) {
        currentCaseSlide = caseSlides.length - 1;
    }
    
    // 新しいスライドをアクティブに
    caseSlides[currentCaseSlide].classList.add('active');
    caseIndicators[currentCaseSlide].classList.add('active');
    
    // スライドコンテナを移動
    const caseSlidesContainer = document.querySelector('.case-slides');
    if (caseSlidesContainer) {
        caseSlidesContainer.style.transform = `translateX(-${currentCaseSlide * 100}%)`;
    }
}

function goToCaseSlide(index) {
    if (caseSlides.length === 0 || index >= caseSlides.length) return;
    
    // 現在のスライドを非アクティブに
    caseSlides[currentCaseSlide].classList.remove('active');
    caseIndicators[currentCaseSlide].classList.remove('active');
    
    // 指定されたスライドをアクティブに
    currentCaseSlide = index;
    caseSlides[currentCaseSlide].classList.add('active');
    caseIndicators[currentCaseSlide].classList.add('active');
    
    // スライドコンテナを移動
    const caseSlidesContainer = document.querySelector('.case-slides');
    if (caseSlidesContainer) {
        caseSlidesContainer.style.transform = `translateX(-${currentCaseSlide * 100}%)`;
    }
}

// ケーススタディカルーセルの自動再生
function initCaseCarousel() {
    // 自動スライド切り替え（7秒間隔）
    setInterval(() => {
        changeCaseSlide(1);
    }, 7000);
}

// 初期化にカルーセルを追加
document.addEventListener('DOMContentLoaded', function() {
    // 既存の初期化
    checkFontLoading();
    forceApplyFonts();
    loadTheme();
    initEventListeners();
    initServiceCards();
    animateCounters();
    initFadeInAnimation();
    initSlideshow();
    initSlideshowPause();
    initSmoothScrolling();
    
    // カルーセル初期化を追加
    initCircularCarousel();
    initCaseCarousel();
    
    window.addEventListener('load', function() {
        setTimeout(() => {
            forceApplyFonts();
        }, 100);
        document.body.classList.add('loaded');
    });
});