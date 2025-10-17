// ===== 全域變數和函數（必須在最外層）=====
let lightboxImages = [];
let currentLightboxIndex = 0;
let currentCarouselIndex = 0; // ← 加入這個變數

// 開啟 Lightbox（全域函數）
function openLightbox(index) {
  currentLightboxIndex = index;
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightboxImg");

  lightboxImg.src = lightboxImages[index].src;
  lightbox.classList.add("active");
  document.body.style.overflow = "hidden";
}

// 關閉 Lightbox（全域函數）
function closeLightbox() {
  const lightbox = document.getElementById("lightbox");
  lightbox.classList.remove("active");
  document.body.style.overflow = "";
}

// Lightbox 左右切換（全域函數）
function lightboxNav(direction) {
  currentLightboxIndex += direction;

  // 循環切換
  if (currentLightboxIndex < 0) {
    currentLightboxIndex = lightboxImages.length - 1;
  } else if (currentLightboxIndex >= lightboxImages.length) {
    currentLightboxIndex = 0;
  }

  const lightboxImg = document.getElementById("lightboxImg");
  lightboxImg.src = lightboxImages[currentLightboxIndex].src;
}

// ===== Carousel 函數（新增）=====
function moveCarousel(direction) {
  const track = document.getElementById("carouselTrack");
  const slides = document.querySelectorAll(".photo-slide");
  
  if (!track || slides.length === 0) return;
  
  const slideWidth = slides[0].offsetWidth + 13.333; // 包含 margin

  currentCarouselIndex += direction;

  // 循環邏輯
  if (currentCarouselIndex < 0) {
    currentCarouselIndex = slides.length - 3; // 因為一次顯示 3 張
  } else if (currentCarouselIndex > slides.length - 3) {
    currentCarouselIndex = 0;
  }

  track.style.transform = `translateX(-${currentCarouselIndex * slideWidth}px)`;
  updateCarouselDots();
}

function updateCarouselDots() {
  const dots = document.querySelectorAll(".dot");
  dots.forEach((dot, index) => {
    dot.classList.toggle("active", index === currentCarouselIndex);
  });
}

// ===== DOMContentLoaded - 只需要一次 =====
document.addEventListener("DOMContentLoaded", function () {
  console.log("IntersectionObserver 版本的 script.js 已執行！");

  // --- IntersectionObserver 動畫設定 ---
  const animatedElements = document.querySelectorAll(".fade-up");
  const isMobile = window.innerWidth <= 768;

  // 判斷滾動容器，桌面版是 .main-content，手機版是整個視窗 (null)
  const scrollRoot = isMobile ? null : document.querySelector(".main-content");

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        // 當元素進入可視區域時
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // 讓動畫只觸發一次，觸發後就停止觀察
          observer.unobserve(entry.target);
        }
      });
    },
    {
      root: scrollRoot, // 指定觀察的滾動區域
      rootMargin: "0px",
      threshold: 0.4, // 元素可見度達到 40% 時觸發
    }
  );

  // 開始觀察每一個帶有 .fade-up 的元素
  animatedElements.forEach((el) => {
    observer.observe(el);
  });

  // --- 滾動容器 ---
  const scrollContainer = document.querySelector(".main-content");

  // --- 表單提交 ---
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      alert("感謝您的來信，我們將儘快回覆！");
      e.target.reset();
    });
  }

  // --- 漢堡選單 ---
  const toggleBtn = document.getElementById("menu-toggle");
  const sidebar = document.getElementById("sidebar");
  if (toggleBtn && sidebar) {
    toggleBtn.addEventListener("click", () => sidebar.classList.toggle("open"));
  }

  // --- 導覽列點擊 ---
  const navLinks = document.querySelectorAll("#nav-list a");
  navLinks.forEach((link) => {
    link.addEventListener("click", (event) => {
      event.preventDefault();
      const targetSection = document.querySelector(link.getAttribute("href"));
      if (targetSection) {
        targetSection.scrollIntoView({ behavior: "smooth" });
      }
      if (isMobile && sidebar && sidebar.classList.contains("open")) {
        sidebar.classList.remove("open");
      }
    });
  });

  // --- 回到頂端按鈕 ---
  const backToTop = document.getElementById("backToTop");
  if (backToTop) {
    const scrollTarget = isMobile ? window : scrollContainer;
    const scrollProperty = isMobile ? "scrollY" : "scrollTop";

    scrollTarget.addEventListener("scroll", () => {
      backToTop.style.display =
        scrollTarget[scrollProperty] > 300 ? "block" : "none";
    });

    backToTop.addEventListener("click", () => {
      (isMobile ? window : scrollContainer).scrollTo({
        top: 0,
        behavior: "smooth",
      });
    });
  }

  // ===== Lightbox 初始化 =====
  function initLightbox() {
    const photoSlides = document.querySelectorAll(".photo-slide img");
    lightboxImages = Array.from(photoSlides);

    photoSlides.forEach((img, index) => {
      img.addEventListener("click", () => openLightbox(index));
    });
  }

  initLightbox();

  // ===== 初始化 Carousel Dots =====
  const slides = document.querySelectorAll(".photo-slide");
  const dotsContainer = document.getElementById("carouselDots");
  if (dotsContainer && slides.length > 0) {
    // 計算需要的點數（假設一次顯示 3 張）
    const numDots = Math.max(1, slides.length - 2);
    
    for (let i = 0; i < numDots; i++) {
      const dot = document.createElement("div");
      dot.classList.add("dot");
      if (i === 0) dot.classList.add("active");
      
      dot.addEventListener("click", () => {
        currentCarouselIndex = i;
        moveCarousel(0); // 移動到指定位置
      });
      
      dotsContainer.appendChild(dot);
    }
  }

  // --- 點擊背景關閉 Lightbox ---
  document.getElementById("lightbox")?.addEventListener("click", (e) => {
    if (e.target.id === "lightbox") {
      closeLightbox();
    }
  });

  // --- ESC 鍵關閉 Lightbox ---
  document.addEventListener("keydown", (e) => {
    const lightbox = document.getElementById("lightbox");
    if (lightbox && lightbox.classList.contains("active")) {
      if (e.key === "Escape") {
        closeLightbox();
      } else if (e.key === "ArrowLeft") {
        lightboxNav(-1);
      } else if (e.key === "ArrowRight") {
        lightboxNav(1);
      }
    }
  });
});