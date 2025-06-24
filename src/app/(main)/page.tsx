import HomePageClient from '@/components/HomePageClient';
import { Suspense } from 'react';

export default function HomePage() {
  return (
    <>
      <div className="h-full w-full">
        <Suspense>
          <HomePageClient />
        </Suspense>
      </div>
    </>
  );
}
