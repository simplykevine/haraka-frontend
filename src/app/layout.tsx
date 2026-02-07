'use client';
import "./globals.css";
import { Teachers } from "next/font/google";
import { usePathname } from "next/navigation";

const teachers = Teachers({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--font-teachers",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  const isResetPage = pathname === '/reset' || pathname.startsWith('/reset/');
  const isAuthPage = [
    "/",
    "/welcome",
    "/signin",
    "/signup",
    "/teaser",
    "/not_found"
  ].some(path => pathname === path);

  const showSidebar = !isAuthPage && !isResetPage;
  const showProfileMenu = !isAuthPage && !isResetPage;


  return (
    <html lang="en">
      <body className={`${teachers.variable} antialiased`}>
        <div className="absolute inset-0 -z-10 opacity-20 pointer-events-none">
        </div>
        <div className="flex min-h-screen">
          <div className="flex-1 flex flex-col">
            {showProfileMenu && (
              <div className="absolute top-[-8] right-10 z-30">
              </div>
            )}
            <main>{children}</main>
          </div>
        </div>
      </body>
    </html>
  );
}