import type { ReactNode } from 'react';

export function Panel({ title, className, children }: { title: string; className?: string; children: ReactNode }) {
  const id = `panel-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <section className={`panel ${className ?? ''}`} aria-labelledby={id}>
      <h2 id={id}>{title}</h2>
      {children}
    </section>
  );
}
