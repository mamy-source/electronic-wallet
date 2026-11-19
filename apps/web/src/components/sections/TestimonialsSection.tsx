import { Icon } from "@/components/ui/Icon";

interface Testimonial {
  quote: string;
  name: string;
  role: string;
  avatar: string;
  alt: string;
}

const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "Being a remote software contractor in Antananarivo working for European clients was an FX nightmare. MONEXA allows me to receive EUR and disburse MGA instantly to my family without painful bank wire waits.",
    name: "Hery Razafindrakoto",
    role: "Full-Stack Consultant",
    alt: "Portrait photo of a young professional Malagasy male software engineer.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuDMbLrvv2YrVIst8-mXVyBRIwmKOMBqJdoHj-v1aEc10GfQMok-5JDzhUwRXu-g_xXOaP4qPkOTzbzs8l9A4YVtfu4uXI2ZINfMYhmLptW0C5eXpYnEUBsHsVwDcztPM9CVX10wiYkxDu2wRPmB-yiUNy_PfbLSQwDgs0hsFgWfGmFXrWLG1z-qVCHHmNDWgBd3DOKn4abLFxqNkIjT2rEG38SAF6dtpgbr5ymn9QXCxV9zzMVyc8sx",
  },
  {
    quote:
      "Our retail boutique accepts MONEXA QR codes. Customers pay with any telecom mobile money balance seamlessly, and funds arrive into our business account instantaneously with almost zero fees.",
    name: "Miora Andrianampoinimerina",
    role: "Founder, Maison Vanilla & Silk",
    alt: "Portrait photo of a stylish female entrepreneur and boutique shop owner.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuD3qB-tJFGKsHnSmYMsb2Z7wbpXmufj40E4rm2xKJVXkk93BNMxxOITOXlSo6-3oBho6Hx53Q3uI2DpxvOWdf5kk2Kcw2AN2MVxpOufikHonSJL9sJMYNudPCFK9tWi4WAAUsjokgj0fV8ijzozampvrrHw6x6bjCwJNNs2mSvpFBVewcF4xqSPuUV9tIiY-E6nVSWAeM61qxfjHUUWol47wuesilC5vufUlW1IjOV-xfLkF30AifBk",
  },
  {
    quote:
      "The fee transparency is revolutionary. We send emergency funds between Nosy Be and Tana frequently. Never having to guess the operator fee beforehand gives us total peace of mind.",
    name: "Jean-Luc Rabe",
    role: "Eco-Tourism Operator",
    alt: "Headshot of a mature smiling man in clean casual linen shirt outside near lush tropical palm trees.",
    avatar:
      "https://lh3.googleusercontent.com/aida-public/AB6AXuBBLq0iGXRCsel_Cs-RgtE7dNzW_2oPBHCxMz4DZn1LHYmfLCB7-4AZ0OlD9pqX3gTsI8LR-wvgy7ET0vLV_BG9jJT2wjNlAvqQGuZen8ej6TUmmprHPHGFI4-PL7Nua1qNsl7sWJ-W3iXeSG8GEZqnyMMIKbNDwIyA2gvyIhh3Id7-1sIYYYcjmXhUNmVWh_6BPlgUZOFD4eszefz_ivd5EeQ2mS_G09eivDB3fXg3yT_hmB6KPT3L",
  },
];

export function TestimonialsSection() {
  return (
    <section className="w-full py-20 bg-surface">
      <div className="max-w-7xl mx-auto px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-14 gap-6">
          <div>
            <span className="font-label-sm text-label-sm uppercase tracking-wider text-primary font-semibold">
              Real Stories
            </span>
            <h2 className="font-headline-lg text-headline-lg text-on-surface mt-2 tracking-tight">
              Loved by Nomads &amp; Enterprises
            </h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-md">
            Over 120,000 users manage their personal liquidity and global earnings across
            Madagascar and overseas.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {TESTIMONIALS.map((t) => (
            <article
              key={t.name}
              className="bg-surface-container-lowest rounded-2xl p-6 shadow-sm flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center gap-1 text-primary mb-4">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Icon key={i} name="star" className="text-[18px]" />
                  ))}
                </div>
                <p className="font-body-md text-body-md text-on-surface mb-6 leading-relaxed">
                  &ldquo;{t.quote}&rdquo;
                </p>
              </div>
              <div className="flex items-center gap-3 pt-4">
                <img
                  src={t.avatar}
                  alt={t.alt}
                  className="w-11 h-11 rounded-full object-cover shadow-sm"
                />
                <div>
                  <p className="font-label-sm text-label-sm font-semibold text-on-surface">
                    {t.name}
                  </p>
                  <p className="font-caption-micro text-caption-micro text-on-surface-variant">
                    {t.role}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}