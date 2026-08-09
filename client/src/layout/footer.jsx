const COLUMNS = [
  {
    heading: "Shop",
    links: ["Headphones", "Earphones", "Speakers", "Accessories", "Gift cards"],
  },
  {
    heading: "Support",
    links: ["Order status", "Shipping", "Returns", "Warranty", "Contact us"],
  },
  {
    heading: "NOVA",
    links: ["About", "Newsroom", "Careers", "Sustainability", "Retail stores"],
  },
];

/**
 * Footer — Premium footer with modern typography and visual hierarchy
 * Features clean spacing, hover states, and responsive layout
 */
export const Footer = () => {
  return (
    <footer className="bg-neutral-50 text-neutral-600 py-16 sm:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <p className="text-sm text-neutral-400 pb-8 border-b border-neutral-200">
          Shipping quoted at checkout. Prices shown in USD and exclude local tax.
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 pt-12">
          {COLUMNS.map((col) => (
            <div key={col.heading}>
              <h4 className="text-sm font-semibold text-neutral-900 mb-4">{col.heading}</h4>
              <ul className="space-y-3">
                {col.links.map((link) => (
                  <li key={link}>
                    <a 
                      href="#shop" 
                      className="text-sm text-neutral-500 hover:text-neutral-900 transition-colors duration-200"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="pt-12 mt-12 border-t border-neutral-200 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <p className="text-sm text-neutral-400">
            Copyright © {new Date().getFullYear()} NOVA Audio, Inc. All rights reserved.
          </p>
          <div className="flex gap-6">
            <a 
              href="#shop" 
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            >
              Privacy Policy
            </a>
            <a 
              href="#shop" 
              className="text-sm text-neutral-400 hover:text-neutral-600 transition-colors duration-200"
            >
              Terms of Use
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
