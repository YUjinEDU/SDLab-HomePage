import { Container } from "@/components/layout/Container";

export default function ProjectsLoading() {
  return (
    <div className="animate-pulse">
      <Container className="py-24">
        <div className="h-10 w-48 bg-border rounded mb-8" />

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div
              key={i}
              className="rounded-2xl border border-border bg-white p-8 space-y-4"
            >
              <div className="h-6 w-20 bg-border rounded-full" />
              <div className="h-6 w-full bg-border rounded" />
              <div className="h-4 w-2/3 bg-border rounded" />
              <div className="flex gap-2">
                <div className="h-5 w-14 bg-border rounded-full" />
                <div className="h-5 w-14 bg-border rounded-full" />
              </div>
            </div>
          ))}
        </div>
      </Container>
    </div>
  );
}
