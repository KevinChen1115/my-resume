document.addEventListener('DOMContentLoaded', function () {

    console.log("IntersectionObserver 版本的 script.js 已執行！");

    // --- IntersectionObserver 動畫設定 ---
    const animatedElements = document.querySelectorAll('.fade-up');
    const isMobile = window.innerWidth <= 768;
    
    // 判斷滾動容器，桌面版是 .main-content，手機版是整個視窗 (null)
    const scrollRoot = isMobile ? null : document.querySelector('.main-content');

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // 當元素進入可視區域時
            if (entry.isIntersecting) {
                entry.target.classList.add('is-visible');
                // (可選) 讓動畫只觸發一次，觸發後就停止觀察
                observer.unobserve(entry.target);
            }
        });
    }, {
        root: scrollRoot, // 指定觀察的滾動區域
        rootMargin: '0px',
        threshold: 0.4 // 元素可見度達到 10% 時觸發
    });

    // 開始觀察每一個帶有 .fade-up 的元素
    animatedElements.forEach(el => {
        observer.observe(el);
    });


    // --- 以下是你原本的其他功能，保持不變 ---

    const scrollContainer = document.querySelector('.main-content');
    
    // 表單提交...
    const contactForm = document.getElementById("contact-form");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("感謝您的來信，我們將儘快回覆！");
            e.target.reset();
        });
    }

    // 漢堡選單...
    const toggleBtn = document.getElementById("menu-toggle");
    const sidebar = document.getElementById("sidebar");
    if(toggleBtn && sidebar) {
        toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
    }
    
    // 導覽列點擊...
    const navLinks = document.querySelectorAll("#nav-list a");
    navLinks.forEach(link => {
        link.addEventListener('click', (event) => {
            event.preventDefault();
            const targetSection = document.querySelector(link.getAttribute('href'));
            if (targetSection) {
                targetSection.scrollIntoView({ behavior: 'smooth' });
            }
            if (isMobile && sidebar && sidebar.classList.contains("open")) {
                sidebar.classList.remove("open");
            }
        });
    });
    
    // 回到頂端按鈕...
    const backToTop = document.getElementById("backToTop");
    if (backToTop) {
        const scrollTarget = isMobile ? window : scrollContainer;
        const scrollProperty = isMobile ? 'scrollY' : 'scrollTop';

        scrollTarget.addEventListener("scroll", () => {
            backToTop.style.display = scrollTarget[scrollProperty] > 300 ? "block" : "none";
        });

        backToTop.addEventListener("click", () => {
            (isMobile ? window : scrollContainer).scrollTo({ top: 0, behavior: "smooth" });
        });
    }

    // 最後，你也可以把引用 AOS.js 的那一行 <script> 刪掉了
});