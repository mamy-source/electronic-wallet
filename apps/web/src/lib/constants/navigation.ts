export const NAV_LINKS = [
    { path: "features", label: "Features" },
    { path: "personal-wallet", label: "Personal" },
    { path: "business-solutions", label: "Business" },
    { path: "security", label: "Security" },
    { path: "pricing", label: "Pricing" },
    { path: "help-center", label: "Help" },
  ] as const;
  
  export const FOOTER_LINKS = {
    Products: [
      { path: "personal-wallet", label: "Personal Wallet" },
      { path: "business-solutions", label: "Business Escrow" },
      { path: "features", label: "Multi-Currency Cards" },
      { path: "pricing", label: "Exchange Rates" },
    ],
    "Governance & Legal": [
      { path: "help-center", label: "Terms of Service" },
      { path: "help-center", label: "Privacy Framework" },
      { path: "security", label: "Security Protocol" },
      { path: "help-center", label: "AML Policy" },
    ],
    Support: [
      { path: "help-center", label: "Help Center" },
      { path: "help-center", label: "API Documentation" },
      { path: "help-center", label: "Service Status" },
      { path: "help-center", label: "Contact Concierge" },
    ],
  } as const;