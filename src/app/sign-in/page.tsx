import Link from "next/link";
import { LoginForm } from "~/components/forms/auth/LoginForm";

export default function HomePage() {
  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-gradient-to-br from-blue-50 via-white to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-950">
      <div className="absolute inset-0 bg-white/20 backdrop-blur-sm dark:bg-slate-900/20" />
      <div className="absolute -top-40 -left-40 h-80 w-80 rounded-full bg-primary opacity-10 blur-3xl animate-pulse dark:opacity-5" />
      <div className="absolute bottom-1/4 right-1/4 h-64 w-64 rounded-full bg-accent opacity-10 blur-3xl animate-pulse dark:opacity-5" />
      
      <div className="relative z-10 w-full max-w-6xl px-4 mx-auto flex flex-col md:flex-row items-center justify-between gap-8 lg:gap-16">
        <div className="w-full md:w-1/2 mb-8 md:mb-0 text-center md:text-left">
          <div className="mb-4">
            <h1 className="font-heading text-4xl md:text-5xl lg:text-6xl font-bold text-primary mb-4">
              Art<span className="text-secondary">stay</span>
            </h1>
            <h2 className="text-xl md:text-2xl text-primary mb-6 font-text">
              Professional Client Management Platform
            </h2>
            <p className="text-primary mb-8 max-w-md mx-auto md:mx-0 font-text">
              Manage your clients, projects, and resources all in one place with our intuitive and secure dashboard.
            </p>
          </div>
          
          <div className="hidden md:flex flex-col gap-4 font-text">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
                  <polyline points="22 4 12 14.01 9 11.01"></polyline>
                </svg>
              </div>
              <p className="text-sm text-primary">Streamlined client management</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                  <line x1="3" y1="9" x2="21" y2="9"></line>
                  <line x1="9" y1="21" x2="9" y2="9"></line>
                </svg>
              </div>
              <p className="text-sm text-primary">Project tracking & reporting</p>
            </div>
            
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
                </svg>
              </div>
              <p className="text-sm text-primary">Enterprise-grade security</p>
            </div>
          </div>
        </div>
        <div className="w-full md:w-1/2">
          <LoginForm />
        </div>
      </div>

      <div className="absolute bottom-0 left-0 w-full py-4 bg-white/40 dark:bg-slate-900/40 backdrop-blur-sm font-text">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center justify-between text-sm text-primary">
            <p>© {new Date().getFullYear()} Kolibri Business. All rights reserved.</p>
            <div className="flex gap-6 mt-2 md:mt-0">
              <Link href="/terms" className="hover:text-secondary transition-colors">Terms</Link>
              <Link href="/privacy" className="hover:text-secondary transition-colors">Privacy</Link>
              <Link href="/help" className="hover:text-secondary transition-colors">Support</Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}