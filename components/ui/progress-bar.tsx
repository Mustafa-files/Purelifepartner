import { REGISTRATION_STEPS } from "@/lib/constants";

export function ProgressBar({ step }: { step: number }) {
  const total = REGISTRATION_STEPS.length;
  const pct = Math.round((step / total) * 100);
  return (
    <div className="mb-8">
      <div className="mb-2 flex items-center justify-between text-sm font-semibold">
        <span className="text-charcoal">
          Step {step} of {total}: {REGISTRATION_STEPS[step - 1]?.label}
        </span>
        <span className="text-coral">{pct}%</span>
      </div>
      <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className="h-full rounded-full bg-coral transition-all duration-500"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
