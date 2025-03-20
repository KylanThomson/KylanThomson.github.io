// Portfolio Website JavaScript
// Author: Kylan Thomson

document.addEventListener("DOMContentLoaded", () => {
  // Initialize all functions
  initNavigation();
  initThemeToggle();
  initProjectSliders();
  initContactForm();
  initScrollAnimations();
  initLazyLoading();
  initAccessibility();
  initAnalytics();
  initSEO();
});

// ===== Navigation Functions =====
function initNavigation() {
  const mobileMenu = document.getElementById("mobile-menu");
  const navbarMenu = document.querySelector(".navbar-menu");
  const navLinks = document.querySelectorAll(".navbar-link");
  const navbar = document.querySelector(".navbar");

  // Mobile menu toggle
  if (mobileMenu) {
    mobileMenu.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      navbarMenu.classList.toggle("active");
    });
  }

  // Close mobile menu when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      navbarMenu.classList.remove("active");
    });
  });

  // Smooth scrolling for navigation links
  navLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      e.preventDefault();
      const targetId = link.getAttribute("href");
      const targetSection = document.querySelector(targetId);

      if (targetSection) {
        const offsetTop = targetSection.offsetTop - navbar.offsetHeight;
        window.scrollTo({
          top: offsetTop,
          behavior: "smooth",
        });
      }
    });
  });

  // Highlight active section on scroll
  window.addEventListener("scroll", () => {
    // Add shadow to navbar on scroll
    if (window.scrollY > 50) {
      navbar.classList.add("scrolled");
    } else {
      navbar.classList.remove("scrolled");
    }

    // Highlight active section
    const sections = document.querySelectorAll("section");
    const scrollPosition = window.scrollY + navbar.offsetHeight + 100;

    sections.forEach((section) => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      const sectionId = section.getAttribute("id");

      if (
        scrollPosition >= sectionTop &&
        scrollPosition < sectionTop + sectionHeight
      ) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${sectionId}`) {
            link.classList.add("active");
          }
        });
      }
    });
  });
}

// ===== Theme Toggle =====
function initThemeToggle() {
  const themeToggle = document.getElementById("theme-toggle");
  const themeIcon = themeToggle.querySelector("i");

  // Check for saved theme preference or use device preference
  const savedTheme = localStorage.getItem("theme");
  const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;

  if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.classList.replace("fa-moon", "fa-sun");
  }

  // Toggle theme on button click
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let newTheme = "light";

    if (currentTheme !== "dark") {
      newTheme = "dark";
      themeIcon.classList.replace("fa-moon", "fa-sun");
    } else {
      themeIcon.classList.replace("fa-sun", "fa-moon");
    }

    document.documentElement.setAttribute("data-theme", newTheme);
    localStorage.setItem("theme", newTheme);
  });
}

// ===== Project Sliders =====
function initProjectSliders() {
  const sliders = document.querySelectorAll(".project-slider");

  sliders.forEach((slider) => {
    const slides = slider.querySelectorAll("img");
    const prevBtn = slider.querySelector(".slider-prev");
    const nextBtn = slider.querySelector(".slider-next");
    let currentIndex = 0;

    // Set up automatic slideshow
    let slideInterval = setInterval(nextSlide, 5000);

    // Reset interval on manual navigation
    function resetInterval() {
      clearInterval(slideInterval);
      slideInterval = setInterval(nextSlide, 5000);
    }

    // Next slide function
    function nextSlide() {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex + 1) % slides.length;
      slides[currentIndex].classList.add("active");
    }

    // Previous slide function
    function prevSlide() {
      slides[currentIndex].classList.remove("active");
      currentIndex = (currentIndex - 1 + slides.length) % slides.length;
      slides[currentIndex].classList.add("active");
    }

    // Event listeners for buttons
    if (prevBtn && nextBtn) {
      prevBtn.addEventListener("click", () => {
        prevSlide();
        resetInterval();
      });

      nextBtn.addEventListener("click", () => {
        nextSlide();
        resetInterval();
      });
    }

    // Pause slideshow on hover
    slider.addEventListener("mouseenter", () => {
      clearInterval(slideInterval);
    });

    slider.addEventListener("mouseleave", () => {
      slideInterval = setInterval(nextSlide, 5000);
    });
  });
}

// ===== Contact Form =====
function initContactForm() {
  const contactForm = document.getElementById("contact-form");

  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();

      // Get form data
      const name = document.getElementById("name").value;
      const email = document.getElementById("email").value;
      const message = document.getElementById("message").value;

      // Simple validation
      if (!name || !email || !message) {
        alert("Please fill in all fields");
        return;
      }

      // In a real implementation, you would send this data to a server
      // For now, we'll just show a success message
      alert(`Thank you for your message, ${name}! I'll get back to you soon.`);
      contactForm.reset();

      // Example of how you might send the form data to a server:
      /*
            fetch('your-api-endpoint', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, message }),
            })
            .then(response => response.json())
            .then(data => {
                alert('Message sent successfully!');
                contactForm.reset();
            })
            .catch(error => {
                console.error('Error:', error);
                alert('There was an error sending your message. Please try again later.');
            });
            */
    });
  }
}

// ===== Scroll Animations =====
function initScrollAnimations() {
  // Add fade-in animation to sections as they come into view
  const sections = document.querySelectorAll("section");
  const options = {
    root: null,
    rootMargin: "0px",
    threshold: 0.1,
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, options);

  sections.forEach((section) => {
    section.style.opacity = 0;
    section.style.transform = "translateY(20px)";
    section.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    observer.observe(section);
  });

  // Add animation to timeline items
  const timelineItems = document.querySelectorAll(".timeline-item");
  const timelineObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateX(0)";
        observer.unobserve(entry.target);
      }
    });
  }, options);

  timelineItems.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform =
      index % 2 === 0 ? "translateX(-20px)" : "translateX(20px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    item.style.transitionDelay = `${index * 0.2}s`;
    timelineObserver.observe(item);
  });

  // Add animation to skill items
  const skillItems = document.querySelectorAll(".skill-item");
  const skillObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = 1;
        entry.target.style.transform = "translateY(0)";
        observer.unobserve(entry.target);
      }
    });
  }, options);

  skillItems.forEach((item, index) => {
    item.style.opacity = 0;
    item.style.transform = "translateY(20px)";
    item.style.transition = "opacity 0.6s ease, transform 0.6s ease";
    item.style.transitionDelay = `${index * 0.1}s`;
    skillObserver.observe(item);
  });
}

// ===== Lazy Loading =====
function initLazyLoading() {
  // Lazy load images to improve page load performance
  if ("loading" in HTMLImageElement.prototype) {
    // Browser supports native lazy loading
    const images = document.querySelectorAll("img:not(.profile-image)");
    images.forEach((img) => {
      img.setAttribute("loading", "lazy");
    });
  } else {
    // Fallback for browsers that don't support native lazy loading
    const lazyImages = document.querySelectorAll(
      "img:not(.profile-image):not(.active)"
    );
    const imageObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const img = entry.target;
          img.src = img.dataset.src;
          img.classList.remove("lazy");
          imageObserver.unobserve(img);
        }
      });
    });

    lazyImages.forEach((img) => {
      imageObserver.observe(img);
    });
  }
}

// ===== Accessibility Improvements =====
function initAccessibility() {
  // Add ARIA labels and roles for better screen reader support
  const navLinks = document.querySelectorAll(".navbar-link");
  navLinks.forEach((link) => {
    link.setAttribute("aria-label", `Navigate to ${link.textContent} section`);
  });

  // Make sure all interactive elements are keyboard accessible
  const allInteractiveElements = document.querySelectorAll(
    "a, button, input, textarea, [tabindex]"
  );
  allInteractiveElements.forEach((el) => {
    if (
      el.getAttribute("tabindex") === "-1" &&
      !el.hasAttribute("aria-hidden")
    ) {
      el.setAttribute("tabindex", "0");
    }
  });

  // Add skip to content link for keyboard users
  const skipLink = document.createElement("a");
  skipLink.setAttribute("class", "skip-link");
  skipLink.setAttribute("href", "#home");
  skipLink.textContent = "Skip to content";
  document.body.insertBefore(skipLink, document.body.firstChild);

  // Add styles for the skip link
  const style = document.createElement("style");
  style.textContent = `
    .skip-link {
      position: absolute;
      top: -40px;
      left: 0;
      background: var(--primary);
      color: white;
      padding: 8px;
      z-index: 1001;
      transition: top 0.3s;
    }
    .skip-link:focus {
      top: 0;
    }
  `;
  document.head.appendChild(style);
}

// ===== Analytics Tracking =====
function initAnalytics() {
  // This is a placeholder for analytics tracking
  // In a real implementation, you would add your analytics code here
  // For example, Google Analytics, Plausible, Fathom, etc.

  // Track page views
  trackPageView();

  // Track outbound links
  const outboundLinks = document.querySelectorAll('a[href^="http"]');
  outboundLinks.forEach((link) => {
    link.addEventListener("click", (e) => {
      trackOutboundLink(link.href);
    });
  });

  // Track resume downloads
  const resumeLink = document.querySelector('a[href$=".pdf"]');
  if (resumeLink) {
    resumeLink.addEventListener("click", (e) => {
      trackEvent("download", "resume", resumeLink.href);
    });
  }

  // Track form submissions
  const contactForm = document.getElementById("contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      trackEvent("form", "submit", "contact");
    });
  }
}

// Analytics helper functions
function trackPageView() {
  // Placeholder for page view tracking
  console.log("Page viewed:", window.location.pathname);
}

function trackOutboundLink(url) {
  // Placeholder for outbound link tracking
  console.log("Outbound link clicked:", url);
}

function trackEvent(category, action, label) {
  // Placeholder for event tracking
  console.log("Event tracked:", category, action, label);
}

// ===== SEO Enhancements =====
function initSEO() {
  // Add structured data dynamically if needed

  // Improve page load time by deferring non-critical resources
  document
    .querySelectorAll('script:not([src*="main.js"])')
    .forEach((script) => {
      script.setAttribute("defer", "");
    });

  // Add canonical URL dynamically if needed
  if (!document.querySelector('link[rel="canonical"]')) {
    const canonicalLink = document.createElement("link");
    canonicalLink.rel = "canonical";
    canonicalLink.href = window.location.href.split("?")[0].split("#")[0];
    document.head.appendChild(canonicalLink);
  }

  // Add meta description dynamically if needed
  if (!document.querySelector('meta[name="description"]')) {
    const metaDesc = document.createElement("meta");
    metaDesc.name = "description";
    metaDesc.content =
      "Kylan Thomson is a Machine Learning Experimentation Engineer with expertise in Python, Spark, and PySpark.";
    document.head.appendChild(metaDesc);
  }
}
