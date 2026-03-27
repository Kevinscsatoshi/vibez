export function Section({
  title,
  children,
  action,
  id,
}: {
  title: string;
  children: React.ReactNode;
  action?: React.ReactNode;
  id?: string;
}) {
  return (
    <section className="mb-5" id={id}>
      <div className="flex items-center justify-between mb-2.5 px-1">
        <h2 className="text-xs font-semibold uppercase tracking-wider text-muted">
          {title}
        </h2>
        {action}
      </div>
      <div className="bg-surface border border-border rounded-md p-5">
        {children}
      </div>
    </section>
  );
}
