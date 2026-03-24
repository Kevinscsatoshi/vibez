export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mb-5">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-2.5 px-1">
        {title}
      </h2>
      <div className="bg-surface border border-border rounded-md p-5">
        {children}
      </div>
    </section>
  );
}
