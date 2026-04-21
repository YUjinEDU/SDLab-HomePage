import { Link } from "@/i18n/navigation";
import { Container } from "@/components/layout/Container";

type PageHeroProps = {
  title: string;
  description?: string;
  breadcrumb?: string;
};

export function PageHero({ title, description, breadcrumb }: PageHeroProps) {
  const parts = title.split(" ");
  const firstPart = parts[0];
  const restPart = parts.slice(1).join(" ");

  return (
    <section className="relative bg-hero-bg border-b border-border py-12 sm:py-16">
      <Container className="relative z-10">
        {breadcrumb && (
          <div className="flex items-center gap-1.5 text-[13px] font-semibold text-emerald-950 mb-4 tracking-wide uppercase">
            <Link href="/" className="hover:text-primary transition-colors">
              HOME
            </Link>
            <span className="opacity-50">/</span>
            <span className="uppercase">{breadcrumb}</span>
          </div>
        )}
        <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight mb-4 text-foreground">
          <span>{firstPart}</span>
          {restPart && <span className="text-primary"> {restPart}</span>}
        </h1>
        {description && (
          <p className="mt-3 text-sm sm:text-base lg:text-lg text-text-secondary max-w-2xl leading-relaxed">
            {description}
          </p>
        )}
      </Container>
    </section>
  );
}
