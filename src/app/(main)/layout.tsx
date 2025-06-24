import Navigation from '@/components/Navigation';

export default async function MainLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <div>
      <Navigation />
      <main className="w-full pt-[64px]">{children}</main>
    </div>
  );
}
