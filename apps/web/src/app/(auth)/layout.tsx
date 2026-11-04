import { AuthHeader } from "@/components/auth/AuthHeader";
import { AuthFooter } from "@/components/auth/AuthFooter";

export default function AuthLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen flex flex-col justify-between bg-background selection:bg-primary-fixed selection:text-on-primary-fixed">
      <AuthHeader />
      <main className="w-full flex-1 flex flex-col items-center justify-center px-4 sm:px-8 py-10 bg-background">
        {children}
      </main>
      <AuthFooter />
    </div>
  );
}