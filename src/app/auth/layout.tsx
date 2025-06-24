export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <main className="h-full w-full bg-gray-100">{children}</main>;
}
