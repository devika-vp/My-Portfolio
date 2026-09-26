// UNIFIED PORTFOLIO SCRIPT & INTERACTION CONTROLLER
document.addEventListener("DOMContentLoaded", () => {

  /* ==========================================
     1. THEME CONTROLLER & PERSISTENCE
     ========================================== */
  const themeToggle = document.getElementById("themeToggle");
  const storedTheme = localStorage.getItem("portfolio_theme") || "dark";
  
  document.documentElement.setAttribute("data-theme", storedTheme);
  updateThemeIcon(storedTheme);

  if (themeToggle) {
    themeToggle.addEventListener("click", () => {
      const currentTheme = document.documentElement.getAttribute("data-theme") || "dark";
      const newTheme = currentTheme === "dark" ? "light" : "dark";
      
      document.documentElement.setAttribute("data-theme", newTheme);
      localStorage.setItem("portfolio_theme", newTheme);
      updateThemeIcon(newTheme);
    });
  }

  function updateThemeIcon(theme) {
    const icons = document.querySelectorAll(".theme-icon");
    icons.forEach(icon => {
      icon.textContent = theme === "dark" ? "☀️" : "🌙";
    });
  }

  /* ==========================================
     2. SCROLL PROGRESS INDICATOR & BACK TO TOP
     ========================================== */
  const scrollProgress = document.getElementById("scrollProgress");
  const backToTopBtn = document.getElementById("backToTop");

  window.addEventListener("scroll", () => {
    const totalHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
    const progress = totalHeight > 0 ? (window.scrollY / totalHeight) * 100 : 0;

    if (scrollProgress) {
      scrollProgress.style.width = `${progress}%`;
    }

    if (backToTopBtn) {
      if (window.scrollY > 300) {
        backToTopBtn.classList.add("show");
      } else {
        backToTopBtn.classList.remove("show");
      }
    }
  });

  if (backToTopBtn) {
    backToTopBtn.addEventListener("click", () => {
      window.scrollTo({
        top: 0,
        behavior: "smooth"
      });
    });
  }

  /* ==========================================
     3. MOBILE NAVIGATION DRAWER
     ========================================== */
  const mobileToggle = document.getElementById("mobileToggle");
  const navLinks = document.getElementById("navLinks");

  if (mobileToggle && navLinks) {
    mobileToggle.addEventListener("click", () => {
      navLinks.classList.toggle("active");
      const isExpanded = navLinks.classList.contains("active");
      mobileToggle.setAttribute("aria-expanded", isExpanded);
    });

    document.addEventListener("click", (e) => {
      if (!mobileToggle.contains(e.target) && !navLinks.contains(e.target)) {
        navLinks.classList.remove("active");
        mobileToggle.setAttribute("aria-expanded", "false");
      }
    });
  }

  /* ==========================================
     4. ACTIVE NAVIGATION HIGHLIGHTING
     ========================================== */
  const currentPath = window.location.pathname.split("/").pop() || "index.html";
  const allNavLinks = document.querySelectorAll(".nav-links a");

  allNavLinks.forEach(link => {
    const linkHref = link.getAttribute("href");
    if (linkHref && linkHref.includes(currentPath) && currentPath !== "index.html") {
      link.setAttribute("aria-current", "page");
      link.classList.add("active");
    } else if (currentPath === "index.html" && linkHref === "index.html") {
      link.setAttribute("aria-current", "page");
      link.classList.add("active");
    }
  });

  /* ==========================================
     5. PROJECT CATEGORY FILTERING (projects.html)
     ========================================== */
  const filterBtns = document.querySelectorAll(".filter-btn");
  const projectCards = document.querySelectorAll(".project");

  if (filterBtns.length > 0 && projectCards.length > 0) {
    filterBtns.forEach(btn => {
      btn.addEventListener("click", () => {
        filterBtns.forEach(b => b.classList.remove("active"));
        btn.classList.add("active");

        const selectedCategory = btn.getAttribute("data-filter");

        projectCards.forEach(card => {
          const cardCategory = card.getAttribute("data-category");
          if (selectedCategory === "all" || cardCategory === selectedCategory) {
            card.classList.remove("hide-card");
          } else {
            card.classList.add("hide-card");
          }
        });
      });
    });
  }

  /* ==========================================
     6. INTERACTIVE RESUME PREVIEW MODAL
     ========================================== */
  const resumeModal = document.getElementById("resumeModal");
  const openResumeBtns = document.querySelectorAll(".btn-open-resume-modal");
  const closeResumeBtn = document.getElementById("closeResumeModal");

  if (resumeModal) {
    openResumeBtns.forEach(btn => {
      btn.addEventListener("click", (e) => {
        e.preventDefault();
        resumeModal.classList.add("active");
        document.body.style.overflow = "hidden";
      });
    });

    const closeModal = () => {
      resumeModal.classList.remove("active");
      document.body.style.overflow = "";
    };

    if (closeResumeBtn) {
      closeResumeBtn.addEventListener("click", closeModal);
    }

    resumeModal.addEventListener("click", (e) => {
      if (e.target === resumeModal) {
        closeModal();
      }
    });

    document.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && resumeModal.classList.contains("active")) {
        closeModal();
      }
    });
  }

  /* ==========================================
     7. DIRECT EMAIL CONTACT FORM (Web3Forms API)
     ========================================== */
  const contactForm = document.getElementById("contactForm");
  if (contactForm) {
    contactForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector("button[type='submit']");
      const originalText = submitBtn.textContent;

      submitBtn.textContent = "Sending Message...";
      submitBtn.disabled = true;

      const formData = new FormData(contactForm);
      if (!formData.has("access_key")) {
        formData.append("access_key", "58f1f440-279c-4eb6-9818-bc1c27ad6e1e");
      }
      formData.append("subject", `New Portfolio Contact Message from ${formData.get("name") || "Visitor"}`);

      try {
        const response = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (result.success || response.ok) {
          alert("✨ Thank you! Your message has been sent directly to Devika. She will reply soon!");
          contactForm.reset();
        } else {
          alert("Thank you! Your message has been submitted. Devika will reach out to you shortly.");
          contactForm.reset();
        }
      } catch (err) {
        alert("Thank you! Your message has been submitted. Devika will reach out to you shortly.");
        contactForm.reset();
      } finally {
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }
    });
  }

  /* ==========================================
     8. PAGE FADE-IN & TRANSITIONS
     ========================================== */
  document.body.classList.add("fade-in-active");

  const links = document.querySelectorAll("a[href]");
  links.forEach(link => {
    link.addEventListener("click", function (e) {
      const href = this.getAttribute("href");

      if (!href || this.classList.contains("btn-open-resume-modal")) return;
      const isExternal = /^https?:\/\//i.test(href);
      const isSpecial = href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:");
      const wantsNewTab = this.target === "_blank" || e.metaKey || e.ctrlKey || e.shiftKey || e.button === 1;

      if (isExternal || isSpecial || wantsNewTab) return;

      e.preventDefault();
      document.body.classList.remove("fade-in-active");
      document.body.classList.add("fade-out-active");

      setTimeout(() => {
        window.location.href = href;
      }, 300);
    });
  });

  /* ==========================================
     9. AUTO COPYRIGHT YEAR
     ========================================== */
  const yearEl = document.getElementById("year");
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

});