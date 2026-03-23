type StatCardProps = {
  value: string;
  label: string;
};

export function StatCard({ value, label }: StatCardProps) {
  return (
    <div className="text-center p-6 bg-surface rounded-xl border border-border">
      <div className="text-3xl font-bold text-primary">{value}</div>
      <div className="mt-1 text-sm text-text-secondary">{label}</div>
    </div>
  );
}
