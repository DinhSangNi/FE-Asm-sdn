import HomePageClient from '@/components/HomePageClient';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      <div className="h-full w-full">
        <Suspense fallback={<p>Đang tải sản phẩm...</p>}>
          <HomePageClient />
        </Suspense>
      </div>
    </>
  );
}
