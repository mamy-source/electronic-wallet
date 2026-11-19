import { FOOTER_LINKS } from "@/lib/constants/navigation";
import { Icon } from "@/components/ui/Icon";
import { Logo } from "../ui/Logo";


const CERTIFICATIONS = ["ISO 27001 Certified", "PCI-DSS Level 1", "SOC 2 Type II"];

export function Footer() {
  return (
    <footer className="w-full bg-surface-container-low">
      <div className="max-w-7xl mx-auto px-6 lg:px-12 pt-16 pb-12">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8 pb-12">
          <div className="col-span-2">
            <Logo></Logo>
            <p className="font-body-sm text-body-sm text-on-surface-variant max-w-sm mb-6">
              High-precision financial technology platform offering seamless multi-currency
              payments, instant global transfers, and digital sovereign banking services.
            </p>
            <div className="flex items-center gap-3">
              <span className="font-caption-micro text-caption-micro text-on-surface-variant uppercase tracking-wider">
                Active Locale:
              </span>
              <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-surface-container-lowest shadow-[0_1px_3px_0_rgba(11,15,25,0.04)] text-on-surface font-label-sm text-label-sm">
                <Icon name="language" className="text-[16px] text-primary" />
                English (Global)
              </div>
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([section, links]) => (
            <div key={section}>
              <div className="font-label-md text-label-md text-on-surface font-semibold mb-4">
                {section}
              </div>
              <ul className="space-y-3 font-body-sm text-body-sm text-on-surface-variant">
                {links.map((link) => (
                  <li key={link.label}>
                    <a href="#" className="hover:text-primary transition-colors">
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-8 mt-4 bg-surface-container-lowest/50 rounded-xl p-6 mb-8">
          <p className="font-caption-micro text-caption-micro text-on-surface-variant leading-relaxed">
            Regulatory Disclosure: MONEXA Financial Technologies operates in partnership with
            licensed microfinance institutions, central banking partners, and regional
            electronic money issuers. Funds are safeguarded in segregated institutional
            custodial accounts. Multi-currency settlements in MGA, USD, and EUR are executed
            in compliance with local central bank exchange governance.
          </p>
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-4 pt-6">
          <p className="font-body-sm text-body-sm text-on-surface-variant">
            © 2025 MONEXA Platform Inc. All institutional rights reserved.
          </p>
          <div className="flex items-center gap-6 font-label-sm text-label-sm text-on-surface-variant">
            {CERTIFICATIONS.map((cert) => (
              <span key={cert}>{cert}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}