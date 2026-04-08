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
