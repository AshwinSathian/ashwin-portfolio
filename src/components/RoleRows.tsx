import { RECENT_EXPERIENCE, type ExperienceItem } from "@/app/data/experience";

type CompanyGroup = { company: string; span: string; roles: ExperienceItem[] };

/** Groups consecutive roles at one company; the list is newest-first. */
function groupByCompany(items: readonly ExperienceItem[]): CompanyGroup[] {
  const groups: CompanyGroup[] = [];
  for (const item of items) {
    const last = groups.at(-1);
    if (last?.company === item.company) last.roles.push(item);
    else groups.push({ company: item.company, span: "", roles: [item] });
  }
  for (const group of groups) {
    // Dates read "Mon YYYY – Mon YYYY": span runs from the oldest role's
    // start to the newest role's end.
    const start = group.roles.at(-1)!.dates.split(" – ")[0];
    const end = group.roles[0].dates.split(" – ")[1];
    group.span = `${start} – ${end}`;
  }
  return groups;
}

/** /experience: roles grouped under their company, with bullets and stack. */
export function RoleGroups() {
  return (
    <div className="flex flex-col gap-20 lg:gap-32">
      {groupByCompany(RECENT_EXPERIENCE).map((group) => (
        <section
          key={group.company}
          aria-label={group.company}
          className="grid gap-x-12 gap-y-6 lg:grid-cols-12"
        >
          <header className="reveal lg:col-span-4">
            <div className="lg:sticky lg:top-24">
              <h2 className="text-display-m font-semibold tracking-[-0.03em]">
                {group.company}
              </h2>
              <p className="mt-2 text-meta tabular-nums text-fg-3">{group.span}</p>
            </div>
          </header>

          <div className="flex flex-col gap-10 lg:col-span-8">
            {group.roles.map((item) => (
              <article key={item.role} className="reveal flex flex-col gap-4">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
                  <h3 className="text-title font-medium text-fg">{item.role}</h3>
                  {group.roles.length > 1 && (
                    <p className="shrink-0 text-meta tabular-nums text-fg-3">{item.dates}</p>
                  )}
                </div>
                <ul className="flex flex-col gap-3 text-fg">
                  {item.bullets.map((bullet) => (
                    <li key={bullet} className="relative pl-5 before:absolute before:left-0 before:top-[0.68em] before:size-1.5 before:rounded-full before:bg-fg-3">
                      {bullet}
                    </li>
                  ))}
                </ul>
                {item.tech && item.tech.length > 0 && (
                  <p className="text-meta tabular-nums text-fg-3">{item.tech.join(" · ")}</p>
                )}
              </article>
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
