'use client';

import Link from 'next/link';
import { Course } from '@/lib/courses';

interface ChapterGridProps {
  course: Course;
}

export function ChapterGrid({ course }: ChapterGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
      {course.chapters.map((chapter, index) => (
        <Link
          key={chapter.id}
          href={`/courses/${course.id}/${chapter.id}`}
          className="group relative bg-white rounded-xl border border-gray-200 p-5 hover:border-blue-300 hover:shadow-lg transition-all duration-200"
        >
          {/* Chapter Number Badge */}
          <div className="absolute -top-3 -left-3 w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold shadow-md group-hover:bg-blue-700 transition-colors">
            {index + 1}
          </div>

          {/* Chapter Content */}
          <div className="pt-2">
            <h3 className="font-medium text-gray-800 group-hover:text-blue-600 transition-colors line-clamp-2">
              {chapter.title}
            </h3>
            <div className="mt-3 flex items-center text-sm text-gray-400 group-hover:text-blue-500 transition-colors">
              <span>查看详情</span>
              <svg className="w-4 h-4 ml-1 transform group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </div>
          </div>
        </Link>
      ))}
    </div>
  );
}
