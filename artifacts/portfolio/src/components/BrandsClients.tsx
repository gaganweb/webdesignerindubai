"use client";

import { useState } from "react";

type BrandLogo = {
  name: string;
  src: string;
  larger?: boolean;
  readable?: boolean;
};

// Assets are local copies of publicly available brand marks.
const brandGroups = [
  {
    title: "Trusted By Enterprise Clients",
    description: "Regional groups, healthcare providers & retail leaders",
    logos: [
      { name: "Apparel Group", src: "/brands/apparel-group-wordmark.png" },
      { name: "6th Street", src: "/brands/6th-street.svg" },
      { name: "Al Sharq Hospital", src: "/brands/al-sharq-hospital.png" },
      { name: "Al Sharq Healthcare", src: "/brands/al-sharq-healthcare.png" },
      { name: "Gulf Petrol Supplies (GPS)", src: "/brands/gulf-petrol-supplies.png" },
      { name: "Dubai Limited Investment", src: "/brands/dubai-limited-investment-mark.png" },
      { name: "Almadallah Healthcare Insurance", src: "/brands/almadallah.png" },
    ],
  },
  {
    title: "International brands",
    description: "Recognized names I've worked with",
    logos: [
      { name: "Levi's", src: "/brands/levis.png" },
      { name: "Tim Hortons", src: "/brands/tim-hortons.png" },
      { name: "Skechers", src: "/brands/skechers.png" },
      { name: "New Balance", src: "/brands/new-balance.png" },
      { name: "Calvin Klein", src: "/brands/calvin-klein.png" },
      { name: "Tommy Jeans", src: "/brands/tommy-jeans.png" },
      { name: "Aldo", src: "/brands/aldo.png" },
      { name: "Crocs", src: "/brands/crocs.png" },
      { name: "TOMS", src: "/brands/toms.png" },
      { name: "Hush Puppies", src: "/brands/hush-puppies.png" },
      { name: "Cold Stone Creamery", src: "/brands/cold-stone.png" },
      { name: "Inglot", src: "/brands/inglot.png?v=2", readable: true },
    ],
  },
  {
    title: "Companies & groups",
    description: "Teams I've been part of",
    logos: [
      { name: "Fujairah National Group", src: "/brands/fujairah-national-group.png?v=2", larger: true, readable: true },
      { name: "Bond Interiors", src: "/brands/bond-interiors.png?v=2", larger: true, readable: true },
      { name: "105.4 Radio Spice", src: "/brands/radio-spice.png?v=2", larger: true, readable: true },
    ],
  },
] satisfies { title: string; description: string; logos: BrandLogo[] }[];

function LogoTile({ logo }: { logo: BrandLogo }) {
  const [failed, setFailed] = useState(false);
  return (
    <li
      className={`brand-tile group flex h-28 items-center justify-center rounded-xl border border-border bg-white p-4 sm:p-5 transition-all duration-300 hover:border-primary/60 hover:bg-slate-50 hover:shadow-md dark:border-slate-600/50 dark:bg-white dark:hover:bg-slate-50 ${logo.name === "Inglot" ? "!p-3" : ""}`}
      title={logo.name}
    >
      {failed ? (
        <span className="text-center text-sm font-semibold leading-tight text-slate-900" role="img" aria-label={`${logo.name} logo`}>
          {logo.name}
        </span>
      ) : (
        <img
          src={logo.src}
          alt={`${logo.name} logo`}
          width={logo.name === "Dubai Limited Investment" ? 108 : 180}
          height={logo.larger ? 80 : 70}
          loading="lazy"
          decoding="async"
          onError={() => setFailed(true)}
          className={`brand-logo block max-h-[70px] max-w-full w-auto object-contain ${logo.larger ? "max-h-[80px]" : ""} ${logo.readable ? "brand-logo-readable" : ""}`}
          data-testid={`img-brand-${logo.name.toLowerCase().replace(/[^a-z0-9]+/g, "-")}`}
        />
      )}
    </li>
  );
}

export default function BrandsClients() {
  return (
    <section id="brands" aria-labelledby="brands-heading" className="scroll-mt-16 py-24 bg-background border-t border-border/40">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <span className="text-primary text-sm font-semibold tracking-widest uppercase">
            The names behind the experience
          </span>
          <h2 id="brands-heading" className="text-3xl md:text-5xl font-sans font-bold text-foreground mt-4 mb-5">
            Brands &amp; Clients
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed">
            Experience shaped by working with established brands and ambitious teams across retail, hospitality, and beyond.
          </p>
          <div className="w-16 h-1 bg-primary mx-auto mt-7" aria-hidden="true" />
        </div>

        <div className="space-y-14">
          {brandGroups.map((group) => (
            <div key={group.title}>
              <div className="flex flex-col sm:flex-row sm:items-baseline gap-1 sm:gap-4 mb-5">
                <h3 className="text-lg font-semibold text-foreground">{group.title}</h3>
                <p className="text-sm text-muted-foreground">{group.description}</p>
              </div>
              <ul className={`grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4 ${group.title === "International brands" ? "xl:grid-cols-6" : "xl:grid-cols-4"}`}>
                {group.logos.map((logo) => (
                  <LogoTile key={logo.name} logo={logo} />
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}