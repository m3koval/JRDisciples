export interface WordPuzzle {
  id: string;
  title: string;
  theme: string;
  description: string;
  emoji: string;
  words: string[];
}

export const wordPuzzlesRu: WordPuzzle[] = [
  {
    id: "books-of-the-bible-ru",
    title: "Книги Библии",
    theme: "Библия",
    description: "Найди названия книг Библии в сетке — слова спрятаны во всех направлениях, даже по диагонали и задом наперёд!",
    emoji: "📖",
    words: ["БЫТИЕ", "ИСХОД", "ПСАЛМЫ", "МАТФЕЙ", "МАРК", "ЛУКА", "ИОАНН", "ДЕЯНИЯ"],
  },
  {
    id: "jesus-is-ru",
    title: "Иисус есть...",
    theme: "Иисус Христос",
    description: "Найди слова, которые описывают Иисуса — слова спрятаны во всех направлениях!",
    emoji: "✝️",
    words: ["СПАСИТЕЛЬ", "СВЕТ", "ПУТЬ", "ЖИЗНЬ", "ПАСТЫРЬ", "БОГ", "СЛОВО", "ЦАРЬ"],
  },
  {
    id: "gods-armor-ru",
    title: "Броня Божия",
    theme: "Вера и защита",
    description: "Найди части брони Бога из Послания к Ефесянам 6 — слова идут в любом направлении!",
    emoji: "🛡️",
    words: ["ВЕРА", "МИР", "ИСТИНА", "ПРАВДА", "МОЛИТВА", "СПАСЕНИЕ", "ЩИТ", "МЕЧ"],
  },
];
