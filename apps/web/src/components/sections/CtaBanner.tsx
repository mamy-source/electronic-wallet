import { ButtonLink } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";

export function CtaBanner() {
  return (
    <section className="w-full py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-primary via-primary-container to-secondary p-10 lg:p-16 text-center text-on-primary shadow-2xl">
          <div className="absolute -top-24 -left-24 w-80 h-80 rounded-full bg-surface-container-lowest/10 blur-2xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-80 h-80 rounded-full bg-surface-container-lowest/15 blur-2xl pointer-events-none" />

          <div className="relative z-10 max-w-3xl mx-auto">
            <h2 className="font-headline-lg text-headline-lg font-bold mb-4 tracking-tight">
              Ready to Take Absolute Control of Your Money?
            </h2>
            <p className="font-body-lg text-body-lg text-on-primary/90 mb-8 max-w-xl mx-auto leading-relaxed">
              Join thousands of individuals and modern enterprises experiencing instant,
              borderless financial freedom across Madagascar and globally.
            </p>
            <div className="flex flex-wrap items-center justify-center gap-4">
              <ButtonLink variant="inverse" href="#">
                Create Free Account Now
                <Icon name="arrow_forward" className="text-[18px]" />
              </ButtonLink>
              <ButtonLink
                href="#"
                className="bg-primary-fixed/20 text-on-primary hover:bg-primary-fixed/30 shadow-none"
              >
                <Icon name="support_agent" className="text-[18px]" />
                Talk to Concierge
              </ButtonLink>
            </div>
            <p className="font-caption-micro text-caption-micro text-on-primary/75 mt-6">
              Takes less than 3 minutes • No credit check required • Regulated platform
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}