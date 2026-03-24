export function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="border-t border-border pt-6 pb-2">
      <h2 className="text-xs font-semibold uppercase tracking-wider text-muted mb-4">
        {title}
      </h2>
      {children}
    </section>
  );
}
