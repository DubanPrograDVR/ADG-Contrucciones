// ===== NAVEGACIÓN =====
const navbar = document.getElementById("navbar");
const navToggle = document.getElementById("navToggle");
const navMenu = document.getElementById("navMenu");
const navLinks = document.querySelectorAll(".nav-link");

// ===== ANIMACIÓN LOGO (letra por letra) =====
(function animateLogo() {
  const logoText = document.querySelector(".nav-logo .logo-text");
  if (!logoText) return;

  const reduceMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)",
  ).matches;
  let delay = 180; // tras icono

  const wrapNode = (node) => {
    const text = node.nodeValue;
    const frag = document.createDocumentFragment();
    for (const ch of text) {
      const span = document.createElement("span");
      span.className = "letter" + (ch === " " ? " space" : "");
      span.textContent = ch;
      if (!reduceMotion) {
        span.style.animationDelay = delay + "ms";
        delay += 55;
      }
      frag.appendChild(span);
    }
    node.parentNode.replaceChild(frag, node);
  };

  const processChildren = (el) => {
    const children = Array.from(el.childNodes);
    for (const node of children) {
      if (node.nodeType === Node.TEXT_NODE) {
        wrapNode(node);
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        processChildren(node);
      }
    }
  };

  processChildren(logoText);
})();

// Navbar scroll effect
window.addEventListener("scroll", () => {
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

// Mobile menu toggle
navToggle.addEventListener("click", () => {
  navToggle.classList.toggle("active");
  navMenu.classList.toggle("active");
  document.body.style.overflow = navMenu.classList.contains("active")
    ? "hidden"
    : "";
});

// Close mobile menu on link click
navLinks.forEach((link) => {
  link.addEventListener("click", () => {
    navToggle.classList.remove("active");
    navMenu.classList.remove("active");
    document.body.style.overflow = "";
  });
});

// Active nav link on scroll
const sections = document.querySelectorAll("section[id]");

window.addEventListener("scroll", () => {
  let current = "";
  const scrollPos = window.scrollY + 100;

  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    const sectionHeight = section.offsetHeight;
    if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach((link) => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// ===== CONTADOR ANIMADO =====
const statNumbers = document.querySelectorAll(".stat-number");
let countersStarted = false;

function startCounters() {
  if (countersStarted) return;
  countersStarted = true;

  statNumbers.forEach((counter) => {
    const target = parseInt(counter.getAttribute("data-target"));
    const duration = 2000;
    const increment = target / (duration / 16);
    let current = 0;

    const updateCounter = () => {
      current += increment;
      if (current < target) {
        counter.textContent = Math.floor(current);
        requestAnimationFrame(updateCounter);
      } else {
        counter.textContent = target;
      }
    };

    updateCounter();
  });
}

// ===== SCROLL REVEAL =====
const revealElements = document.querySelectorAll(
  ".servicio-card, .proyecto-card, .feature, .contacto-item",
);

const revealObserver = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("active");
        // Trigger counters when hero stats are visible
        if (entry.target.closest(".hero-stats")) {
          startCounters();
        }
      }
    });
  },
  { threshold: 0.1 },
);

revealElements.forEach((el) => {
  el.classList.add("reveal");
  revealObserver.observe(el);
});

// Observer for hero stats
const heroStats = document.querySelector(".hero-stats");
if (heroStats) {
  const statsObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          startCounters();
        }
      });
    },
    { threshold: 0.3 },
  );
  statsObserver.observe(heroStats);
}

// ===== MODAL =====
const modal = document.getElementById("proyectoModal");
const modalImg = document.getElementById("modalImg");
const modalTitle = document.getElementById("modalTitle");
const modalDesc = document.getElementById("modalDesc");

function openModal(title, description, image) {
  modalImg.src = image;
  modalImg.alt = title;
  modalTitle.textContent = title;
  modalDesc.textContent = description;
  modal.classList.add("active");
  document.body.style.overflow = "hidden";
}

function closeModal() {
  modal.classList.remove("active");
  document.body.style.overflow = "";
}

// Close modal on backdrop click
modal.addEventListener("click", (e) => {
  if (e.target === modal) {
    closeModal();
  }
});

// Close modal on Escape key
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && modal.classList.contains("active")) {
    closeModal();
  }
});

// ===== FORMULARIO =====
const contactForm = document.getElementById("contactForm");
const notification = document.getElementById("notification");
const notificationText = document.getElementById("notificationText");

function showNotification(message, type = "success") {
  notificationText.textContent = message;
  notification.querySelector("i").className =
    type === "success" ? "fas fa-check-circle" : "fas fa-exclamation-circle";
  notification.querySelector("i").style.color =
    type === "success" ? "var(--whatsapp)" : "#dc3545";
  notification.classList.add("show");

  setTimeout(() => {
    notification.classList.remove("show");
  }, 4000);
}

function validateEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

contactForm.addEventListener("submit", (e) => {
  e.preventDefault();

  let isValid = true;
  const nombre = document.getElementById("nombre");
  const email = document.getElementById("email");
  const tipo = document.getElementById("tipo");
  const mensaje = document.getElementById("mensaje");

  // Reset errors
  document
    .querySelectorAll(".form-group")
    .forEach((group) => group.classList.remove("error"));

  // Validate nombre
  if (!nombre.value.trim()) {
    nombre.closest(".form-group").classList.add("error");
    isValid = false;
  }

  // Validate email
  if (!email.value.trim() || !validateEmail(email.value)) {
    email.closest(".form-group").classList.add("error");
    isValid = false;
  }

  // Validate tipo
  if (!tipo.value) {
    tipo.closest(".form-group").classList.add("error");
    isValid = false;
  }

  // Validate mensaje
  if (!mensaje.value.trim()) {
    mensaje.closest(".form-group").classList.add("error");
    isValid = false;
  }

  if (isValid) {
    // Simulate form submission
    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalText = submitBtn.innerHTML;
    submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...';
    submitBtn.disabled = true;

    setTimeout(() => {
      showNotification("¡Mensaje enviado! Te contactaremos pronto.");
      contactForm.reset();
      submitBtn.innerHTML = originalText;
      submitBtn.disabled = false;
    }, 1500);
  } else {
    showNotification(
      "Por favor completa todos los campos obligatorios.",
      "error",
    );
  }
});

// Real-time validation
["nombre", "email", "tipo", "mensaje"].forEach((id) => {
  const element = document.getElementById(id);
  element.addEventListener("input", () => {
    element.closest(".form-group").classList.remove("error");
  });
});

// ===== SMOOTH SCROLL FOR ANCHOR LINKS =====
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute("href"));
    if (target) {
      const offset = 80;
      const targetPosition = target.offsetTop - offset;
      window.scrollTo({
        top: targetPosition,
        behavior: "smooth",
      });
    }
  });
});

// ===== LAZY LOADING PARA IMÁGENES =====
if ("IntersectionObserver" in window) {
  const imgObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target;
        if (img.dataset.src) {
          img.src = img.dataset.src;
          img.removeAttribute("data-src");
        }
        observer.unobserve(img);
      }
    });
  });

  document.querySelectorAll("img[data-src]").forEach((img) => {
    imgObserver.observe(img);
  });
}

// ===== PERFORMANCE: PREVENT ANIMATIONS ON REDUCED MOTION =====
if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
  document.querySelectorAll(".reveal").forEach((el) => {
    el.style.transition = "none";
    el.style.opacity = "1";
    el.style.transform = "none";
  });
}
