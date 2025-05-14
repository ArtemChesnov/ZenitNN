function fixHangingText(container = document.body) {
  const elements = container.querySelectorAll(
    "p, h1, h2, h3, h4, h5, h6, span, a, li"
  );

  const hangingWords = [
    "в",
    "с",
    "к",
    "о",
    "и",
    "а",
    "у",
    "на",
    "по",
    "за",
    "от",
    "до",
    "из",
    "над",
    "под",
    "при",
    "об",
    "не",
    "для",
    "как",
    "но",
    "что",
    "же",
    "или",
    "то",
    "ли",
  ];

  const abbreviations = [
    "г\\.",
    "ул\\.",
    "д\\.",
    "пер\\.",
    "пл\\.",
    "пр\\.",
    "т\\.",
    "мкр\\.",
  ];

  const regexWords = new RegExp(
    `(?<=\\s|^)(${[...hangingWords, ...abbreviations].join("|")})\\s+(?=\\S)`,
    "gi"
  );

  elements.forEach((el) => {
    if (el.children.length > 0) return;

    let html = el.innerHTML;

    // 1. Предлоги и сокращения склеиваем с последующим словом
    html = html.replace(regexWords, (_, word) => `${word}&nbsp;`);

    // 2. Склеиваем "слово — слово слово" → неразрывная тройка
    html = html.replace(
      /(\S+)\s+(—|–)\s+(\S+\s+\S+)/g,
      (_, a, dash, rest) =>
        `${a}&nbsp;${dash}&nbsp;${rest.replace(/\s+/g, "&nbsp;")}`
    );

    // 3. Склеиваем пары "слово — слово"
    html = html.replace(
      /(\S+)\s+(—|–)\s+(\S+)/g,
      (_, a, dash, b) => `${a}&nbsp;${dash}&nbsp;${b}`
    );

    el.innerHTML = html;
  });
}

// Дебаунс для предотвращения многократного вызова
let debounceTimer;
function debounceFix() {
  clearTimeout(debounceTimer);
  debounceTimer = setTimeout(() => fixHangingText(), 100);
}

// Инициализация
document.addEventListener("DOMContentLoaded", () => {
  fixHangingText();

  // MutationObserver — следим за изменениями в DOM
  const observer = new MutationObserver(debounceFix);
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // Обновление при изменении размера окна
  window.addEventListener("resize", debounceFix);
});
