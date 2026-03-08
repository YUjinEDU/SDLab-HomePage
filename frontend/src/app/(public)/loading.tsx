import { Container } from "@/components/layout/Container";

export default function PublicLoading() {
  return (
    <div className="animate-pulse">
      {/* Hero skeleton */}
      <div className="bg-hero-bg min-h-[560px]" />

      <Container className="py-24">
        {/* Section skeleton */}
        <div className="max-w-4xl mx-auto space-y-4">
          <div className="h-4 w-24 bg-border rounded" />
          <div className="h-10 w-64 bg-border rounded" />
          <div className="h-20 w-full bg-border rounded mt-6" />
        </div>

        {/* Cards skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-16 max-w-6xl mx-auto">
          {[1, 2, 3].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white p-10 space-y-4"
            >
              <div className="h-12 w-12 bg-border rounded-xl" />
              <div className="h-6 w-3/4 bg-border rounded" />
              <div className="h-16 w-full bg-border rounded" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
