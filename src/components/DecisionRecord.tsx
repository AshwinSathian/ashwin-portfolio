import type { DecisionRecord as DecisionRecordType } from "@/app/data/projects";

export type DecisionRecordProps = {
  record: DecisionRecordType;
};

/** A disclosed reversal: what it was, what it is now, and why. */
export default function DecisionRecord({ record }: DecisionRecordProps) {
  return (
    <div className="panel reveal overflow-hidden">
      <dl className="grid md:grid-cols-2">
        <div className="flex flex-col gap-2 border-b border-line p-6 md:border-b-0 md:border-r lg:p-8">
          <dt className="text-meta tabular-nums text-fg-3">Was</dt>
          <dd className="text-fg-2 line-through decoration-fg-3/60">{record.before}</dd>
        </div>
        <div className="flex flex-col gap-2 p-6 lg:p-8">
          <dt className="text-meta tabular-nums text-fg-3">Now, since {record.date}</dt>
          <dd className="font-medium text-fg">{record.after}</dd>
        </div>
      </dl>
      <p className="border-t border-line p-6 text-small text-fg-2 lg:p-8">
        <span className="font-medium text-fg">Why. </span>
        {record.why}
      </p>
    </div>
  );
}
