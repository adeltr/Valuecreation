import type { ReactNode } from 'react';

/**
 * A titled region of a step. `bare`: the step header already says what the panel is, so its
 * title is kept for assistive technologies only (the region keeps its name).
 */
export function Panel({ title, className, children, bare = false, actions }: {
  title: string; className?: string; children: ReactNode; bare?: boolean; actions?: ReactNode;
}) {
  const id = `panel-${title.replace(/\W+/g, '-').toLowerCase()}`;
  return (
    <section className={`panel ${bare ? 'panel-bare' : ''} ${className ?? ''}`} aria-labelledby={id}>
      <div className={bare ? 'sr-only' : 'panel-head'}>
        <h3 id={id}>{title}</h3>
        {!bare && actions}
      </div>
      {children}
    </section>
  );
}
