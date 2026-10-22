import { Logo } from "../ui/Logo";
import { LanguageSwitcher } from "../ui/LanguageSwitcher";
import { Icon } from "../ui/Icon";


export function AuthHeader() {
  return (
    <header className="w-full bg-surface-container-lowest/80 backdrop-blur-xl shadow-[0_1px_8px_rgba(0,0,0,0.04)] z-50">
      <div className="h-16 w-full px-4 sm:px-8 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Logo />
          <div className="hidden sm:flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container text-on-surface-variant type-caption-micro">
            <Icon name="lock" className="text-[11px] text-primary" />
            <span className="text-[10px]">256-BIT TLS ENCRYPTED</span>
          </div>
          <div className="hidden md:flex items-center gap-1 px-2.5 py-1 rounded-full bg-surface-container-high text-on-surface type-caption-micro">
            <Icon name="verified_user" className="text-[11px] text-secondary" />
            <span className="text-[10px]">CSBF REGULATED • MADAGASCAR</span>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
          <a href="#" className="flex items-center gap-1 text-on-surface-variant hover:text-on-surface type-label-md transition-colors">
            <Icon name="help_outline" className="text-[18px]" />
            <span className="hidden lg:inline">Support</span>
          </a>
        </div>
      </div>
    </header>
  );
}