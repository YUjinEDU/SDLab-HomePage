import { Container } from "@/components/layout/Container";

export default function PublicationsLoading() {
  return (
    <div className="animate-pulse">
      <Container className="py-24">
        <div className="h-10 w-48 bg-border rounded mb-8" />
        <div className="h-12 w-full max-w-md bg-border rounded mb-8" />

        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white p-8 space-y-3"
            >
              <div className="flex gap-2">
                <div className="h-6 w-20 bg-border rounded-full" />
                <div className="h-6 w-16 bg-border rounded-full" />
              </div>
              <div className="h-6 w-3/4 bg-border rounded" />
              <div className="h-4 w-1/2 bg-border rounded" />
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
