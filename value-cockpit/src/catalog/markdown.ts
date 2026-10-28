/** Lines of the `## <heading>` section of an imported analysis (docs/08 format), blank lines dropped. */
export function section(content: string, heading: string): string[] {
  const lines = content.replace(/\r\n/g, '\n').split('\n');
  const start = lines.findIndex((l) => l.startsWith(`## ${heading}`));
  if (start < 0) return [];
  const end = lines.findIndex((l, i) => i > start && l.startsWith('## '));
  return lines.slice(start + 1, end < 0 ? undefined : end).filter((l) => l.trim());
}

/** Titles of the « Steps to improve » items: the bold lead of each line. */
export function improveTitles(content: string): string[] {
  return section(content, '🚀').map((l) => {
    const bold = l.match(/\*\*(.+?):?\*\*/);
    return (bold ? bold[1] : l.replace(/^[-\d.\s]+/, '').split(':')[0]).replace(/:$/, '').trim();
  });
}

/** First sentence of the goal. */
export function goalSentence(content: string): string {
  const goal = section(content, '🎯').join(' ').trim();
  return (goal.match(/^.*?\.(?=\s|$)/)?.[0] ?? goal).trim();
}

/** Items of the « Data required » list (bulleted or numbered). */
export function dataRequired(content: string): string[] {
  return section(content, '📊').map((l) => l.replace(/^\s*(?:[-*•○●]|\d+[.)])\s+/, '').trim()).filter(Boolean);
}
