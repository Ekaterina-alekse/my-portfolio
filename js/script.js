/* ============================================================
   Скрипты визитки Kolbina Ekaterina
   Простые эффекты без библиотек
   ============================================================ */

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
   1. Бургер-меню (мобильная навигация)
   ------------------------------------------------------------ */
function initBurgerMenu() {
  const burger = document.getElementById('burger');
  const nav = document.getElementById('nav');
  if (!burger || !nav) return;

  burger.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('nav--open');
    burger.classList.toggle('burger--open', isOpen);
    burger.setAttribute('aria-expanded', String(isOpen));
  });

  // Закрываем меню после клика по пункту
  nav.querySelectorAll('.nav__link').forEach((link) => {
    link.addEventListener('click', () => {
      nav.classList.remove('nav--open');
      burger.classList.remove('burger--open');
      burger.setAttribute('aria-expanded', 'false');
    });
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
   3. Плавное появление секций при скролле (IntersectionObserver)
   ------------------------------------------------------------ */
function initRevealOnScroll() {
  const items = document.querySelectorAll('.reveal');
  if (!items.length) return;

  // Если браузер не поддерживает IntersectionObserver — просто показать всё
  if (!('IntersectionObserver' in window)) {
    items.forEach((el) => el.classList.add('is-visible'));
    return;
  }

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target); // анимируем один раз
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
  const sections = document.querySelectorAll('section[id]');
  const links = document.querySelectorAll('.nav__link');
  if (!sections.length || !links.length) return;

  const setActive = () => {
    const scrollPos = window.scrollY + 120;

    sections.forEach((section) => {
      const top = section.offsetTop;
      const bottom = top + section.offsetHeight;

      if (scrollPos >= top && scrollPos < bottom) {
        links.forEach((link) => {
          link.classList.toggle(
            'nav__link--active',
            link.getAttribute('href') === '#' + section.id
          );
        });
      }
    });
  };

  window.addEventListener('scroll', setActive, { passive: true });
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

  // Оставляем только курсор, текст напечатаем сами
  subtitle.textContent = '';
  if (cursor) subtitle.appendChild(cursor);

  const tick = () => {
    charIndex += 1;
    // Вставляем текст перед курсором
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
   6. Валидация формы контактов
   ------------------------------------------------------------ */
function initFormValidation() {
  const form = document.getElementById('contactForm');
  if (!form) return;

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

  form.addEventListener('submit', (event) => {

    const name = form.elements.name;
    const email = form.elements.email;
    const message = form.elements.message;
    let isValid = true;

    // Проверка имени
    if (name.value.trim().length < 2) {
      showError(name, '// ошибка: имя слишком короткое');
      isValid = false;
    } else {
      clearError(name);
    }

    // Проверка Email
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(email.value.trim())) {
      showError(email, '// ошибка: проверьте email');
      isValid = false;
    } else {
      clearError(email);
    }

    // Проверка сообщения
    if (message.value.trim().length < 10) {
      showError(message, '// ошибка: напишите чуть подробнее');
      isValid = false;
    } else {
      clearError(message);
    }

    if (!isValid) {
      event.preventDefault();
      return;
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
