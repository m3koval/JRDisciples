'use client'
import Image from 'next/image';
import Link from 'next/link';
import { useLanguage } from '@/context/LanguageContext';
import { getLatestPublishedLesson } from '@/data/lesson-catalog';

export default function LatestLessonFeature() {
  const { language } = useLanguage();
  const lesson = getLatestPublishedLesson(language);
  return <Link data-latest-lesson href={lesson.href} style={{ display: 'inline-flex', gap: 12, minHeight: 50, alignItems: 'center', justifyContent: 'center', padding: '13px 16px', margin: '0 0 22px', borderRadius: 15, background: '#f6c969', color: '#163f36', fontFamily: 'var(--font-nunito)', fontWeight: 900, textDecoration: 'none' }}>
    <Image src={lesson.image} alt="" width={64} height={64} style={{ objectFit: 'cover', borderRadius: 8, flexShrink: 0, width: 64, height: 64 }} />
    <span>{language === 'ru' ? 'Новый урок' : 'New lesson'}: {lesson.title} →</span>
  </Link>;
}
