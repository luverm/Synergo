document.addEventListener("DOMContentLoaded", () => {
  const body = document.body;
  const nav = document.querySelector("nav");
  const navLinks = document.querySelector(".nav-links");
  const submenuConfig = {
    "wat-we-doen.html": [
      { href: "wat-we-doen.html#consultancy", label: "Consultancy" },
      { href: "wat-we-doen.html#engineering", label: "Engineering" },
      { href: "wat-we-doen.html#projectmanagement", label: "Projectmanagement" },
    ],
    "over-synergo.html": [
      { href: "over-synergo.html", label: "Over Synergo" },
      { href: "projecten.html", label: "Projecten" },
      { href: "actueel.html", label: "Actueel" },
      { href: "contact.html", label: "Contact" },
    ],
    "werken-bij.html": [
      { href: "werken-bij.html#vacatures", label: "Vacatures" },
      { href: "werken-bij.html", label: "Werken bij Synergo" },
      { href: "contact.html", label: "Open sollicitatie" },
    ],
  };

  body.classList.add("js-enhanced");
  body.classList.add(document.querySelector(".hero") ? "page-home" : "page-inner");

  const isHomePage = body.classList.contains("page-home");
  const introElement = document.querySelector(".home-intro");
  const introStorageKey = "synergo-home-intro-seen";
  let hasSeenIntro = false;

  try {
    hasSeenIntro = window.sessionStorage.getItem(introStorageKey) === "true";
  } catch (error) {
    hasSeenIntro = false;
  }

  if (
    isHomePage &&
    introElement &&
    !hasSeenIntro &&
    !window.matchMedia("(prefers-reduced-motion: reduce)").matches
  ) {
    body.classList.add("intro-active");

    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        body.classList.add("intro-ready");
      });
    });

    window.setTimeout(() => {
      body.classList.add("intro-complete");
      body.classList.remove("intro-active");
      try {
        window.sessionStorage.setItem(introStorageKey, "true");
      } catch (error) {
        // Ignore storage failures and keep the intro as a progressive enhancement.
      }
    }, 2550);
  } else if (introElement) {
    body.classList.add("intro-complete");
  }

  if (nav && navLinks) {
    navLinks.querySelectorAll("a.has-dropdown").forEach((link) => {
      const menuItems = submenuConfig[link.getAttribute("href")];
      const parentItem = link.closest("li");

      if (!menuItems || !parentItem || parentItem.querySelector(".nav-dropdown")) {
        return;
      }

      parentItem.classList.add("has-submenu");

      const dropdown = document.createElement("div");
      dropdown.className = "nav-dropdown";

      menuItems.forEach((item) => {
        const dropdownLink = document.createElement("a");
        dropdownLink.href = item.href;
        dropdownLink.textContent = item.label;
        dropdown.appendChild(dropdownLink);
      });

      parentItem.appendChild(dropdown);
    });

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

    navLinks.querySelectorAll("li.has-submenu > a.has-dropdown").forEach((link) => {
      link.addEventListener("click", (event) => {
        if (window.innerWidth > 768) {
          return;
        }

        event.preventDefault();
        const parentItem = link.closest("li.has-submenu");

        navLinks.querySelectorAll("li.has-submenu").forEach((item) => {
          if (item !== parentItem) {
            item.classList.remove("submenu-open");
          }
        });

        parentItem?.classList.toggle("submenu-open");
      });
    });

    navLinks.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        if (
          window.innerWidth <= 768 &&
          link.matches("li.has-submenu > a.has-dropdown, .has-submenu > a.has-dropdown")
        ) {
          return;
        }

        closeNav();
      });
    });

    window.addEventListener("resize", () => {
      if (window.innerWidth > 768) {
        closeNav();
        navLinks.querySelectorAll(".submenu-open").forEach((item) => {
          item.classList.remove("submenu-open");
        });
      }
    });
  }

  const scrollHero = document.querySelector("[data-scroll-hero]");
  const scrollIndicator = document.querySelector("[data-scroll-indicator]");
  let heroStart = 0;
  let heroDistance = 1;

  const clamp = (value, min, max) => Math.min(Math.max(value, min), max);

  const measureScrollHero = () => {
    if (!scrollHero) {
      return;
    }

    heroStart = window.scrollY + scrollHero.getBoundingClientRect().top;
    heroDistance = Math.max(scrollHero.offsetHeight - window.innerHeight, 1);
  };

  const updateScrollHero = () => {
    if (!scrollHero) {
      return;
    }

    const progress = clamp((window.scrollY - heroStart) / heroDistance, 0, 1);
    const easedProgress = 1 - Math.pow(1 - progress, 3);

    scrollHero.style.setProperty("--hero-progress", progress.toFixed(4));
    scrollHero.style.setProperty("--hero-ease", easedProgress.toFixed(4));

    if (scrollIndicator) {
      scrollIndicator.classList.toggle("is-hidden", progress > 0.16);
    }
  };

  const onScroll = () => {
    body.classList.toggle("scrolled", window.scrollY > 16);
    updateScrollHero();
  };

  measureScrollHero();
  onScroll();
  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", () => {
    measureScrollHero();
    updateScrollHero();
  });

  const revealSelectors = [
    ".hero-copy",
    ".hero-panel",
    ".page-hero",
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

  const operationsCarousel = document.querySelector("[data-operations-carousel]");

  if (operationsCarousel) {
    const track = operationsCarousel.querySelector("[data-carousel-track]");
    const viewport = operationsCarousel.querySelector(".operations-viewport");
    const originalSlides = Array.from(operationsCarousel.querySelectorAll("[data-carousel-slide]"));
    const dotsContainer = operationsCarousel.querySelector("[data-carousel-dots]");
    const prevButton = operationsCarousel.querySelector("[data-carousel-prev]");
    const nextButton = operationsCarousel.querySelector("[data-carousel-next]");
    let renderedSlides = [];
    let activeIndex = 0;
    let autoPlayId;
    let resetPending = false;
    let autoPlayPausedByUser = false;

    if (track && viewport && originalSlides.length) {
      const cloneSlides = () => {
        track.innerHTML = "";
        const prependClones = originalSlides.map((slide) => {
          const clone = slide.cloneNode(true);
          clone.setAttribute("data-carousel-clone", "true");
          return clone;
        });
        const appendClones = originalSlides.map((slide) => {
          const clone = slide.cloneNode(true);
          clone.setAttribute("data-carousel-clone", "true");
          return clone;
        });

        [...prependClones, ...originalSlides, ...appendClones].forEach((slide) => {
          track.appendChild(slide);
        });

        renderedSlides = Array.from(track.children);
      };

      const getRealIndex = (index = activeIndex) => {
        return ((index - originalSlides.length) % originalSlides.length + originalSlides.length) % originalSlides.length;
      };

      const dots = originalSlides.map((_, index) => {
        const dot = document.createElement("button");
        dot.className = "operations-dot";
        dot.type = "button";
        dot.setAttribute("aria-label", `Ga naar kaart ${index + 1}`);
        dot.addEventListener("click", () => {
          autoPlayPausedByUser = true;
          setActiveSlide(originalSlides.length + index);
          stopAutoPlay();
        });
        dotsContainer?.appendChild(dot);
        return dot;
      });

      const updateTrackPosition = (useTransition = true) => {
        const activeSlide = renderedSlides[activeIndex];
        if (!activeSlide) {
          return;
        }

        track.style.transition = useTransition ? "" : "none";
        const slideCenter = activeSlide.offsetLeft + (activeSlide.offsetWidth / 2);
        const viewportCenter = viewport.offsetWidth / 2;
        track.style.transform = `translateX(-${Math.max(0, slideCenter - viewportCenter)}px)`;

        if (!useTransition) {
          void track.offsetWidth;
          track.style.transition = "";
        }
      };

      const setActiveSlide = (index) => {
        activeIndex = index;
        updateTrackPosition(!resetPending);

        renderedSlides.forEach((slide, slideIndex) => {
          slide.classList.toggle("is-active", slideIndex === activeIndex);
        });

        dots.forEach((dot, dotIndex) => {
          dot.classList.toggle("is-active", dotIndex === getRealIndex());
        });
      };

      const goToNext = () => {
        setActiveSlide(activeIndex + 1);
      };

      const goToPrevious = () => {
        setActiveSlide(activeIndex - 1);
      };

      const stopAutoPlay = () => {
        if (autoPlayId) {
          window.clearInterval(autoPlayId);
        }
      };

      const startAutoPlay = () => {
        stopAutoPlay();
        if (originalSlides.length <= 1 || autoPlayPausedByUser) {
          return;
        }

        autoPlayId = window.setInterval(goToNext, 30000);
      };

      prevButton?.addEventListener("click", () => {
        autoPlayPausedByUser = true;
        goToPrevious();
        stopAutoPlay();
      });

      nextButton?.addEventListener("click", () => {
        autoPlayPausedByUser = true;
        goToNext();
        stopAutoPlay();
      });

      track.addEventListener("transitionend", () => {
        if (activeIndex >= originalSlides.length * 2) {
          resetPending = true;
          setActiveSlide(activeIndex - originalSlides.length);
          resetPending = false;
        } else if (activeIndex < originalSlides.length) {
          resetPending = true;
          setActiveSlide(activeIndex + originalSlides.length);
          resetPending = false;
        }
      });

      window.addEventListener("resize", () => {
        const currentRealIndex = getRealIndex();
        cloneSlides();
        activeIndex = originalSlides.length + currentRealIndex;
        setActiveSlide(activeIndex);
        startAutoPlay();
      });

      cloneSlides();
      activeIndex = originalSlides.length;
      setActiveSlide(activeIndex);
      startAutoPlay();
    }
  }

});
