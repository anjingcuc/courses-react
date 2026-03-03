import { notFound } from 'next/navigation';
import Link from 'next/link';
import { getCourse, getAllCourses } from '@/lib/courses';
import { ChapterGrid } from '@/components/course/ChapterGrid';

interface CoursePageProps {
  params: Promise<{ course: string }>;
}

export async function generateStaticParams() {
  const courses = getAllCourses();
  return courses.map((course) => ({
    course: course.id,
  }));
}

export default async function CoursePage({ params }: CoursePageProps) {
  const { course: courseId } = await params;
  const course = getCourse(courseId);

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm">
        <Link href="/" className="text-blue-600 hover:text-blue-800">
          首页
        </Link>
        <span className="mx-2 text-gray-400">/</span>
        <span className="text-gray-600">{course.title}</span>
      </nav>

      {/* Course Header Card */}
      <div className="bg-white/70 backdrop-blur rounded-2xl p-8 shadow-sm border border-gray-100 mb-8">
        <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
          {/* Course Info */}
          <div className="flex-1">
            <h1 className="text-3xl font-bold mb-4" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
              {course.title}
            </h1>
            <p className="text-gray-600 leading-relaxed mb-4">
              {course.description}
            </p>
            <div className="flex flex-wrap items-center gap-4 text-sm">
              <span className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full">
                课程代码：{course.id}
              </span>
              <span className="px-3 py-1 bg-green-50 text-green-700 rounded-full">
                {course.chapters.length} 个章节
              </span>
            </div>
          </div>

          {/* Quick Start */}
          <div className="lg:flex-shrink-0">
            <Link
              href={`/courses/${courseId}/${course.chapters[0]?.id}`}
              className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-lg shadow-blue-200"
            >
              <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              开始学习
            </Link>
          </div>
        </div>
      </div>

      {/* Chapter Grid */}
      <div>
        <h2 className="text-2xl font-semibold mb-6" style={{ fontFamily: 'var(--font-display)', color: 'var(--color-primary)' }}>
          章节列表
        </h2>
        <ChapterGrid course={course} />
      </div>
    </div>
  );
}
