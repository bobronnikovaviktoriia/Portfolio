/* =========================================================
   PORTFOLIO SCRIPT
   Organized into small, focused functions.
   No global state beyond what's required for feature logic.
========================================================= */

document.addEventListener('DOMContentLoaded', () => {
  initThemeToggle();
  initMobileMenu();
  initStickyHeader();
  initSmoothScroll();
  initActiveNavOnScroll();
  initTypingAnimation();
  initScrollReveal();
  initProjectFilter();
  initProjectModal();
  initContactFormValidation();
  initBackToTop();
  setCurrentYear();
});

/* =========================================================
   1. THEME TOGGLE (dark / light, saved in localStorage)
========================================================= */
function initThemeToggle() {
  const toggleBtn = document.getElementById('theme-toggle');
  const root = document.documentElement;
  const STORAGE_KEY = 'portfolio-theme';

  // Apply saved theme, or fall back to system preference
  const savedTheme = localStorage.getItem(STORAGE_KEY);
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const initialTheme = savedTheme || (prefersLight ? 'light' : 'dark');

  applyTheme(initialTheme);

  toggleBtn.addEventListener('click', () => {
    const currentTheme = root.getAttribute('data-theme') === 'light' ? 'light' : 'dark';
    const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
    applyTheme(nextTheme);
    localStorage.setItem(STORAGE_KEY, nextTheme);
  });

  function applyTheme(theme) {
    if (theme === 'light') {
      root.setAttribute('data-theme', 'light');
      toggleBtn.setAttribute('aria-pressed', 'true');
      toggleBtn.setAttribute('aria-label', 'Switch to dark theme');
    } else {
      root.removeAttribute('data-theme');
      toggleBtn.setAttribute('aria-pressed', 'false');
      toggleBtn.setAttribute('aria-label', 'Switch to light theme');
    }
  }
}

/* =========================================================
   2. MOBILE NAVIGATION MENU
========================================================= */
function initMobileMenu() {
  const menuToggle = document.getElementById('menu-toggle');
  const navLinks = document.getElementById('nav-links');

  menuToggle.addEventListener('click', () => {
    const isOpen = navLinks.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
    menuToggle.setAttribute('aria-expanded', String(isOpen));
    menuToggle.setAttribute('aria-label', isOpen ? 'Close menu' : 'Open menu');
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });

  // Close mobile menu whenever a nav link is clicked
  navLinks.querySelectorAll('.nav-link').forEach((link) => {
    link.addEventListener('click', () => closeMobileMenu());
  });

  function closeMobileMenu() {
    navLinks.classList.remove('open');
    menuToggle.classList.remove('open');
    menuToggle.setAttribute('aria-expanded', 'false');
    menuToggle.setAttribute('aria-label', 'Open menu');
    document.body.style.overflow = '';
  }
}

/* =========================================================
   3. STICKY HEADER SCROLL EFFECT
========================================================= */
function initStickyHeader() {
  const header = document.getElementById('site-header');
  const SCROLL_THRESHOLD = 12;

  const handleScroll = () => {
    header.classList.toggle('scrolled', window.scrollY > SCROLL_THRESHOLD);
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();
}

/* =========================================================
   4. SMOOTH SCROLL FOR NAV LINKS
========================================================= */
function initSmoothScroll() {
  const links = document.querySelectorAll('a[href^="#"]');

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const targetId = link.getAttribute('href');
      if (targetId.length <= 1) return;

      const targetEl = document.querySelector(targetId);
      if (!targetEl) return;

      event.preventDefault();
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
      targetEl.setAttribute('tabindex', '-1');
      targetEl.focus({ preventScroll: true });
    });
  });
}

/* =========================================================
   5. ACTIVE NAV LINK BASED ON SCROLL POSITION
========================================================= */
function initActiveNavOnScroll() {
  const sections = document.querySelectorAll('main section[id]');
  const navLinkMap = new Map();

  document.querySelectorAll('.nav-link').forEach((link) => {
    navLinkMap.set(link.getAttribute('href').slice(1), link);
  });

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;

        navLinkMap.forEach((link) => link.classList.remove('active'));
        const activeLink = navLinkMap.get(entry.target.id);
        if (activeLink) activeLink.classList.add('active');
      });
    },
    { rootMargin: '-45% 0px -50% 0px', threshold: 0 }
  );

  sections.forEach((section) => observer.observe(section));
}

/* =========================================================
   6. TYPING ANIMATION IN HERO
========================================================= */
function initTypingAnimation() {
  const typingEl = document.getElementById('typing-text');
  if (!typingEl) return;

  const phrases = ['Frontend Developer', 'Web Designer', 'JavaScript Developer'];
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion) {
    typingEl.textContent = phrases[0];
    return;
  }

  let phraseIndex = 0;
  let charIndex = 0;
  let isDeleting = false;

  const TYPE_SPEED = 70;
  const DELETE_SPEED = 40;
  const PAUSE_AFTER_TYPE = 1600;
  const PAUSE_AFTER_DELETE = 300;

  function tick() {
    const currentPhrase = phrases[phraseIndex];

    if (isDeleting) {
      charIndex -= 1;
    } else {
      charIndex += 1;
    }

    typingEl.textContent = currentPhrase.slice(0, charIndex);

    let delay = isDeleting ? DELETE_SPEED : TYPE_SPEED;

    if (!isDeleting && charIndex === currentPhrase.length) {
      isDeleting = true;
      delay = PAUSE_AFTER_TYPE;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      phraseIndex = (phraseIndex + 1) % phrases.length;
      delay = PAUSE_AFTER_DELETE;
    }

    setTimeout(tick, delay);
  }

  tick();
}

/* =========================================================
   7. SCROLL REVEAL ANIMATIONS
========================================================= */
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');

  const observer = new IntersectionObserver(
    (entries, obs) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          obs.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  revealEls.forEach((el) => observer.observe(el));
}

/* =========================================================
   8. PROJECT FILTERING
========================================================= */
function initProjectFilter() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  const projectCards = document.querySelectorAll('.project-card');
  const noResultsEl = document.getElementById('no-results');

  filterButtons.forEach((button) => {
    button.addEventListener('click', () => {
      filterButtons.forEach((btn) => btn.classList.remove('active'));
      button.classList.add('active');

      const filter = button.getAttribute('data-filter');
      let visibleCount = 0;

      projectCards.forEach((card) => {
        const categories = card.getAttribute('data-category').split(' ');
        const matches = filter === 'all' || categories.includes(filter);

        card.classList.toggle('hidden-card', !matches);
        if (matches) visibleCount += 1;
      });

      noResultsEl.hidden = visibleCount !== 0;
    });
  });
}

/* =========================================================
   9. PROJECT DETAIL MODAL
========================================================= */
function initProjectModal() {
  const overlay = document.getElementById('modal-overlay');
  const modal = document.getElementById('project-modal');
  const closeBtn = document.getElementById('modal-close');
  const triggers = document.querySelectorAll('[data-modal-trigger]');

  let lastFocusedElement = null;

  // Extended project details, keyed by the same index used in data-modal-trigger
  const projectDetails = [
    {
      title: 'Serenity Massage Center',
      description: 'A responsive business website for a fictional massage center, featuring service information, an image gallery, and an appointment booking system.',
      problem: 'Wellness businesses need a calm, trustworthy online presence that makes it easy for clients to learn about services and book a visit.',
      features: ['Service menu with descriptions and pricing', 'Image gallery of the studio and treatments', 'Online appointment booking flow', 'Fully responsive layout for mobile clients'],
      challenges: 'Designing a soothing, image-rich layout that still loads quickly and stays fully responsive across devices.',
      lessons: 'Practiced building booking flows with vanilla JavaScript and structuring a calm, content-first layout with CSS.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      demoUrl: 'https://bobronnikovaviktoriia.github.io/Massage-Center/#home',
      githubUrl: 'https://github.com/bobronnikovaviktoriia/Massage-Center',
    },
    {
      title: 'Paws & Groom Pet Salon',
      description: 'A responsive pet grooming salon website with service listings, a photo gallery, a contact form, and online appointment booking.',
      problem: 'Pet owners need a friendly, easy-to-navigate site to compare grooming services and book appointments without calling in.',
      features: ['Service listings with pricing tiers', 'Photo gallery of grooming results', 'Validated contact form', 'Online appointment booking system'],
      challenges: 'Keeping the booking and contact forms simple and error-tolerant for a wide range of users, without a backend.',
      lessons: 'Strengthened my form validation patterns and practiced organizing JavaScript into small, reusable functions.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      demoUrl: 'https://bobronnikovaviktoriia.github.io/Paws-Style-Dog-Grooming-Salon-Site/index.html',
      githubUrl: 'https://github.com/bobronnikovaviktoriia/Paws-Style-Dog-Grooming-Salon-Site',
    },
    {
      title: 'Weather App',
      description: 'A weather application that displays real-time weather information for any city using a public weather API.',
      problem: 'People want a fast, no-clutter way to check current conditions for a city without installing a dedicated app.',
      features: ['City search with live API requests', 'Current temperature, conditions, and forecast display', 'Error handling for invalid city names', 'Loading state while data is being fetched'],
      challenges: 'Handling asynchronous requests, network errors, and empty states gracefully using the Fetch API.',
      lessons: 'Practiced working with fetch(), async/await, and parsing real-world JSON responses from a public REST API.',
      tech: ['JavaScript', 'REST API', 'Fetch API', 'Async/Await'],
      demoUrl: 'https://bobronnikovaviktoriia.github.io/Weather-App/',
      githubUrl: 'https://github.com/bobronnikovaviktoriia/Weather-App',
    },
    {
      title: 'LocalVibe',
      description: 'A responsive location discovery web app that helps users find nearby cafés, restaurants, parks, entertainment venues, and other local attractions.',
      problem: 'People exploring a new area need a fast way to discover nearby places by category, without digging through cluttered map apps.',
      features: ['Real-time place search powered by the Foursquare API', 'Category filtering (cafés, restaurants, parks, entertainment)', '"Near Me" search using the Geolocation API', 'Favorites management', 'Detailed place pages with a modern, responsive interface'],
      challenges: 'Managing API rate limits and asynchronous state across search, filtering, and favorites while keeping the UI responsive.',
      lessons: 'Learned to build a component-based UI with React and Vite, style efficiently with Tailwind CSS, and integrate a real third-party location API.',
      tech: ['React', 'Vite', 'JavaScript', 'Tailwind CSS'],
      demoUrl: 'https://local-vibe-liart.vercel.app/',
      githubUrl: 'https://github.com/bobronnikovaviktoriia/local-vibe',
    },
    {
      title: 'Bella Italia Restaurant',
      description: 'A responsive restaurant website with an interactive menu, image gallery with lightbox, customer reviews, maps, and table reservations.',
      problem: 'Restaurants need an inviting site where visitors can browse the menu by category, see the space, and reserve a table easily.',
      features: ['Interactive menu with category filtering', 'Image gallery with a JavaScript lightbox', 'Customer reviews section', 'Google Maps integration', 'Online table reservation system'],
      challenges: 'Building a smooth lightbox and filtering system in vanilla JavaScript without relying on any external libraries.',
      lessons: 'Improved my skills in DOM manipulation, event delegation, and integrating third-party embeds like Google Maps.',
      tech: ['HTML5', 'CSS3', 'JavaScript'],
      demoUrl: 'https://bobronnikovaviktoriia.github.io/bella-italia/#',
      githubUrl: 'https://github.com/bobronnikovaviktoriia/bella-italia',
    },
  ];

  triggers.forEach((trigger) => {
    trigger.addEventListener('click', () => {
      const index = Number(trigger.getAttribute('data-modal-trigger'));
      const data = projectDetails[index];
      if (!data) return;

      lastFocusedElement = trigger;
      populateModal(data);
      openModal();
    });
  });

  closeBtn.addEventListener('click', closeModal);

  overlay.addEventListener('click', (event) => {
    if (event.target === overlay) closeModal();
  });

  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !overlay.hidden) closeModal();
  });

  function populateModal(data) {
    document.getElementById('modal-title').textContent = data.title;
    document.getElementById('modal-description').textContent = data.description;
    document.getElementById('modal-problem').textContent = data.problem;
    document.getElementById('modal-challenges').textContent = data.challenges;
    document.getElementById('modal-lessons').textContent = data.lessons;

    const featuresList = document.getElementById('modal-features');
    featuresList.innerHTML = '';
    data.features.forEach((feature) => {
      const li = document.createElement('li');
      li.textContent = feature;
      featuresList.appendChild(li);
    });

    const techList = document.getElementById('modal-tech');
    techList.innerHTML = '';
    data.tech.forEach((tech) => {
      const li = document.createElement('li');
      li.className = 'tag';
      li.textContent = tech;
      techList.appendChild(li);
    });

    document.getElementById('modal-image').textContent = '';

    const demoLink = document.getElementById('modal-demo-link');
    const githubLink = document.getElementById('modal-github-link');
    demoLink.href = data.demoUrl || '#';
    githubLink.href = data.githubUrl || '#';
  }

  function openModal() {
    overlay.hidden = false;
    document.body.style.overflow = 'hidden';

    // Allow the browser to register the hidden -> visible change before animating
    requestAnimationFrame(() => {
      overlay.classList.add('visible');
    });

    modal.focus();
  }

  function closeModal() {
    overlay.classList.remove('visible');
    document.body.style.overflow = '';

    const handleTransitionEnd = () => {
      overlay.hidden = true;
      overlay.removeEventListener('transitionend', handleTransitionEnd);
    };
    overlay.addEventListener('transitionend', handleTransitionEnd);

    if (lastFocusedElement) {
      lastFocusedElement.focus();
    }
  }
}

/* =========================================================
   10. CONTACT FORM VALIDATION
========================================================= */
function initContactFormValidation() {
  const form = document.getElementById('contact-form');
  if (!form) return;

  const successMessage = document.getElementById('form-success');
  const MIN_MESSAGE_LENGTH = 20;

  const fields = {
    name: {
      input: document.getElementById('name'),
      errorEl: document.getElementById('name-error'),
      validate: (value) => (value.trim() ? '' : 'Please enter your name.'),
    },
    email: {
      input: document.getElementById('email'),
      errorEl: document.getElementById('email-error'),
      validate: (value) => {
        if (!value.trim()) return 'Please enter your email address.';
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(value) ? '' : 'Please enter a valid email address.';
      },
    },
    subject: {
      input: document.getElementById('subject'),
      errorEl: document.getElementById('subject-error'),
      validate: (value) => (value.trim() ? '' : 'Please enter a subject.'),
    },
    message: {
      input: document.getElementById('message'),
      errorEl: document.getElementById('message-error'),
      validate: (value) => {
        if (!value.trim()) return 'Please enter a message.';
        if (value.trim().length < MIN_MESSAGE_LENGTH) {
          return `Message should be at least ${MIN_MESSAGE_LENGTH} characters long.`;
        }
        return '';
      },
    },
  };

  // Validate on blur for immediate feedback
  Object.values(fields).forEach(({ input, errorEl, validate }) => {
    input.addEventListener('blur', () => {
      showFieldError(input, errorEl, validate(input.value));
    });
  });

  form.addEventListener('submit', (event) => {
    event.preventDefault();
    successMessage.hidden = true;

    let isFormValid = true;

    Object.values(fields).forEach(({ input, errorEl, validate }) => {
      const errorText = validate(input.value);
      showFieldError(input, errorEl, errorText);
      if (errorText) isFormValid = false;
    });

    if (!isFormValid) {
      const firstInvalid = form.querySelector('.has-error input, .has-error textarea');
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    // NOTE: No backend is connected. To send this form for real, integrate
    // a service like Formspree (https://formspree.io) or EmailJS
    // (https://www.emailjs.com) here, then submit the data to it.

    successMessage.hidden = false;
    form.reset();
  });

  function showFieldError(input, errorEl, message) {
    const formGroup = input.closest('.form-group');
    formGroup.classList.toggle('has-error', Boolean(message));
    errorEl.textContent = message;
  }
}

/* =========================================================
   11. BACK TO TOP BUTTON
========================================================= */
function initBackToTop() {
  const button = document.getElementById('back-to-top');
  const SHOW_AFTER_PX = 400;

  window.addEventListener(
    'scroll',
    () => {
      button.hidden = window.scrollY <= SHOW_AFTER_PX;
    },
    { passive: true }
  );

  button.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* =========================================================
   12. AUTOMATIC CURRENT YEAR
========================================================= */
function setCurrentYear() {
  const yearEl = document.getElementById('current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}
