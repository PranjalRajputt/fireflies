import './globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import Sidebar from '@/components/layout/Sidebar';
import Header from '@/components/layout/Header';
import { ToastProvider } from '@/context/ToastContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Fireflies.ai Clone',
  description: 'AI Notetaker and Meeting Assistant',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-white text-gray-900`}>
        <ToastProvider>
          <div className="flex min-h-screen">
            
            {/* The Collapsible Sidebar */}
            <Sidebar />

            {/* 
              The Main Content Wrapper
              Notice the lg:ml-[240px] here. This ensures it sits to the right of the sidebar.
              When the sidebar collapses, the global CSS we injected in Sidebar.tsx 
              will override this and smoothly shift it to 64px!
            */}
            <div className="flex-1 lg:ml-[240px] flex flex-col min-h-screen transition-all duration-300 w-full">
              
              {/* The Header we just built */}
              <Header />

              {/* The Page Content (Home, Tasks, Settings, etc.) */}
              <main className="flex-1 bg-white relative">
                {children}
              </main>

            </div>

          </div>
        </ToastProvider>
      </body>
    </html>
  );
}