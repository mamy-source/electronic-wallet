
export function AuthFooter() {
  return (
    <footer className="w-full py-3 bg-surface-container-lowest/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-2 text-on-surface-variant text-[11px] sm:text-[13px] leading-relaxed">
        <div className="text-center sm:text-left">
          © 2025 MONEXA Financial Technologies S.A. All rights reserved.
          Registered with Commission de Supervision Bancaire et Financière (CSBF).
        </div>

        <div className="flex items-center justify-center flex-wrap gap-x-4 gap-y-1 shrink-0">
          <a href="#" className="hover:text-on-surface transition-colors">
            Privacy Policy
          </a>
          <a href="#" className="hover:text-on-surface transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-on-surface transition-colors">
            System Status
          </a>
        </div>
      </div>
    </footer>
  );
}
