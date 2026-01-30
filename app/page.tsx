import Link from "next/link";
import { siteContent } from "@/content/siteContent";
import { CoverCard } from "@/components/CoverCard";

export default function HomePage() {
  const { featuredRelease, artistName, eps, singles, products } = siteContent;

  return (
    <div className="flex flex-col items-center px-4 pb-20">
      {/* Featured Release */}
      <section className="flex flex-col items-center mt-8 md:mt-12">
        <CoverCard
          title={featuredRelease.title}
          subtitle={featuredRelease.subtitle}
          color={featuredRelease.color}
          href={featuredRelease.link}
          size="lg"
        />

        {/* Artist Name */}
        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight mt-8 text-center text-foreground">
          {artistName}
        </h1>

        {/* CTA Button */}
        <Link
          href="/my-darlings-a-demon"
          className="mt-8 px-8 py-3 bg-primary text-primary-foreground rounded-full font-medium text-sm tracking-wide hover:opacity-90 transition-opacity"
        >
          LISTEN NOW
        </Link>
      </section>

      {/* Quick Links Grid */}
      <section className="mt-20 md:mt-28 w-full max-w-4xl">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 justify-items-center">
          {/* EPs Tile */}
          <Link href="/eps" className="group w-full max-w-xs">
            <div
              className="aspect-square rounded-2xl flex flex-col items-center justify-end p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
              style={{ backgroundColor: eps[0]?.color || "#8B5CF6" }}
            >
              <span className="text-white/70 text-sm mb-1">Latest EP</span>
              <h3 className="text-xl font-bold text-white">{eps[0]?.title}</h3>
            </div>
            <p className="text-center mt-3 font-medium text-foreground">EPS</p>
          </Link>

          {/* Singles Tile */}
          <Link href="/singles" className="group w-full max-w-xs">
            <div
              className="aspect-square rounded-2xl flex flex-col items-center justify-end p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
              style={{ backgroundColor: singles[0]?.color || "#EF4444" }}
            >
              <span className="text-white/70 text-sm mb-1">Latest Single</span>
              <h3 className="text-xl font-bold text-white">{singles[0]?.title}</h3>
            </div>
            <p className="text-center mt-3 font-medium text-foreground">SINGLES</p>
          </Link>

          {/* Shop Tile */}
          <Link href="/shop" className="group w-full max-w-xs">
            <div
              className="aspect-square rounded-2xl flex flex-col items-center justify-end p-6 transition-all duration-300 group-hover:scale-[1.02] group-hover:shadow-lg"
              style={{ backgroundColor: products[0]?.color || "#1a1a1a" }}
            >
              <span className="text-white/70 text-sm mb-1">New Merch</span>
              <h3 className="text-xl font-bold text-white">{products[0]?.name}</h3>
            </div>
            <p className="text-center mt-3 font-medium text-foreground">SHOP</p>
          </Link>
        </div>
      </section>
    </div>
  );
}
