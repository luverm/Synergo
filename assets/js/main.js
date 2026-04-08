document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");

  body.classList.add("js-enhanced");
  body.classList.add(document.querySelector(".hero") ? "page-home" : "page-inner");

  if (nav && navLinks) {
    const toggle = document.createElement("button");
    toggle.className = "mobile-nav-toggle";
    toggle.type = "button";
    toggle.setAttribute("aria-label", "Open navigatie");
    toggle.setAttribute("aria-expanded", "false");
    toggle.innerHTML = "<span></span>";
    nav.appendChild(toggle);

    const closeNav = () => {
      body.classList.remove("nav-open");
      toggle.setAttribute("aria-expanded", "false");
    };

    toggle.addEventListener("click", () => {
      const isOpen = body.classList.toggle("nav-open");
      toggle.setAttribute("aria-expanded", String(isOpen));
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", closeNav);
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeNav();
      }
    });
  }

  const onScroll = () => {
    body.classList.toggle("scrolled", window.scrollY > 16);
  };

  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });

  const revealSelectors = [
    ".hero-content",
    ".page-hero",
    ".service-card",
    ".about-grid > *",
    ".stat-item",
    ".project-card",
    ".article > *",
    ".footer-inner > *",
    ".footer-bottom",
  ];

  const revealElements = new Set();
  revealSelectors.forEach((selector) => {
    document.querySelectorAll(selector).forEach((element) => {
      revealElements.add(element);
    });
  });

  revealElements.forEach((element, index) => {
    element.classList.add("reveal-on-scroll");
    element.style.transitionDelay = `${Math.min(index % 6, 5) * 70}ms`;
  });

  if ("IntersectionObserver" in window) {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.14,
        rootMargin: "0px 0px -8% 0px",
      }
    );

    revealElements.forEach((element) => observer.observe(element));
  } else {
    revealElements.forEach((element) => element.classList.add("is-visible"));
  }

  const filterForm = document.querySelector("[data-project-filters]");
  const projectCards = Array.from(document.querySelectorAll(".project-card[data-type]"));

  if (filterForm && projectCards.length) {
    const filterControls = Array.from(filterForm.querySelectorAll("[data-filter-control]"));
    const countElement = document.querySelector("[data-project-count]");
    const resetButton = document.querySelector("[data-filter-reset]");
    const emptyState = document.querySelector("[data-project-empty]");

    const getTokens = (value) =>
      (value || "")
        .split(",")
        .map((token) => token.trim())
        .filter(Boolean);

    const applyProjectFilters = () => {
      const filters = Object.fromEntries(
        filterControls.map((control) => [control.name, control.value.trim()])
      );

      let visibleCount = 0;

      projectCards.forEach((card) => {
        const matches = Object.entries(filters).every(([key, selectedValue]) => {
          if (!selectedValue) {
            return true;
          }

          return getTokens(card.dataset[key]).includes(selectedValue);
        });

        card.classList.toggle("is-hidden", !matches);

        if (matches) {
          visibleCount += 1;
        }
      });

      if (countElement) {
        countElement.textContent = `${visibleCount} project${visibleCount === 1 ? "" : "en"}`;
      }

      if (emptyState) {
        emptyState.classList.toggle("is-visible", visibleCount === 0);
      }
    };

    filterControls.forEach((control) => {
      control.addEventListener("change", applyProjectFilters);
    });

    if (resetButton) {
      resetButton.addEventListener("click", () => {
        filterForm.reset();
        applyProjectFilters();
      });
    }

    applyProjectFilters();
  }
});
