import { lessonTopics, type LessonTopic } from './lessons';
import { lessonTopicsRu } from './lessons-ru';

// The published EN catalog is authoritative for presentation order. New releases
// are prepended; SEO/edit dates must never choose the latest published lesson.
export function getLessonCatalog(language: 'en' | 'ru'): LessonTopic[] {
  if (language === 'en') return lessonTopics;
  const localized = new Map(lessonTopicsRu.map(lesson => [lesson.href, lesson]));
  return lessonTopics.map(lesson => {
    const translated = localized.get(lesson.href);
    if (!translated) throw new Error(`Missing Russian lesson: ${lesson.href}`);
    return translated;
  });
}

export function getLatestPublishedLesson(language: 'en' | 'ru'): LessonTopic {
  const latest = getLessonCatalog(language)[0];
  if (!latest) throw new Error('Published lesson catalog is empty');
  return latest;
}
