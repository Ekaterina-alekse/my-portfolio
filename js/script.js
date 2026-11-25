document.addEventListener('DOMContentLoaded', () => {
  initBurgerMenu();
  initHeaderShadow();
  initRevealOnScroll();
  initActiveNavHighlight();
  initTypingEffect();
  initFormValidation();
  initFooterYear();
});

/* ------------------------------------------------------------
   1. Бургер-меню
   ------------------------------------------------------------ */
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  const closeMenu = () => {
    nav.classList.remove('is-open');
    burger.classList.remove('is-open');
    burger.setAttribute('aria-expanded', 'false');
  };

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('is-open');
    burger.classList.toggle('is-open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      closeMenu();
      link.blur();
    });
  });

  document.addEventListener('click', (event) => {
    if (nav.classList.contains('is-open') &&
      !nav.contains(event.target) &&
      !burger.contains(event.target)) {
      closeMenu();
    }
  });
}

/* ------------------------------------------------------------
   2. Тень шапки при прокрутке
   ------------------------------------------------------------ */
function initHeaderShadow() {
  const header = document.getElementById('header');
  if (!header) return;

  const onScroll = () => {
    header.classList.toggle('header--scrolled', window.scrollY > 10);
  };

  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
}

/* ------------------------------------------------------------
   3. Плавное появление секций при скролле
   ------------------------------------------------------------ */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.15 }
  );

  items.forEach((el) => observer.observe(el));
}

/* ------------------------------------------------------------
   4. Подсветка активного пункта меню при прокрутке
   ------------------------------------------------------------ */
function initActiveNavHighlight() {
  const sections = Array.from(document.querySelectorAll('main section[id]'));
  const links = Array.from(document.querySelectorAll('.nav__link'));
  if (!sections.length || !links.length) return;

  const setActive = () => {
    const offset = 140;
    let currentId = sections[0].id;

    sections.forEach((section) => {
      if (window.scrollY + offset >= section.offsetTop) {
        currentId = section.id;
      }
    });

    links.forEach((link) => {
      link.classList.toggle(
        'is-active',
        link.getAttribute('href') === `#${currentId}`
      );
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
  window.addEventListener('resize', setActive);
  setActive();
}

/* ------------------------------------------------------------
   5. Эффект печатной машинки для подзаголовка Hero
   ------------------------------------------------------------ */
function initTypingEffect() {
  const subtitle = document.querySelector('.hero__subtitle');
  if (!subtitle) return;

  const cursor = subtitle.querySelector('.cursor');
  const fullText = 'Frontend Developer (in training)';
  let charIndex = 0;

  subtitle.textContent = '';
  if (cursor) subtitle.appendChild(cursor);

  const tick = () => {
    charIndex += 1;
    if (cursor) {
      cursor.insertAdjacentText('beforebegin', fullText[charIndex - 1]);
    } else {
      subtitle.textContent = fullText.slice(0, charIndex);
    }

    if (charIndex < fullText.length) {
      setTimeout(tick, 60);
    }
  };

  setTimeout(tick, 400);
}

/* ------------------------------------------------------------
   6. Валидация и отправка формы (Formspree, без перезагрузки)
   ------------------------------------------------------------ */
function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const successEl = document.getElementById('formSuccess');

  const showError = (field, message) => {
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (errorEl) errorEl.textContent = message;
    field.classList.add('is-invalid');
  };

  const clearError = (field) => {
    const errorEl = form.querySelector(`[data-error-for="${field.name}"]`);
    if (errorEl) errorEl.textContent = '';
    field.classList.remove('is-invalid');
  };

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    let isValid = true;

    if (name.value.trim().length < 2) {
      showError(name, '// ошибка: имя слишком короткое');
      isValid = false;
    } else {
      clearError(name);
    }

    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, '// ошибка: проверьте email');
      isValid = false;
    } else {
      clearError(email);
    }

    if (message.value.trim().length < 10) {
      showError(message, '// ошибка: напишите чуть подробнее');
      isValid = false;
    } else {
      clearError(message);
    }

    if (!isValid) return;

    const button = form.querySelector('button[type="submit"]');
    button.disabled = true;

    try {
      const response = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { 'Accept': 'application/json' }
      });

      if (!response.ok) throw new Error('Ошибка отправки');

      form.reset();
      if (successEl) {
        successEl.hidden = false;
        setTimeout(() => { successEl.hidden = true; }, 5000);
      }
    } catch {
      showError(message, '// ошибка: не удалось отправить, попробуйте позже');
    } finally {
      button.disabled = false;
    }
  });
}

/* ------------------------------------------------------------
   7. Актуальный год в футере
   ------------------------------------------------------------ */
function initFooterYear() {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();
}
