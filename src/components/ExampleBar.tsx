import { EXAMPLE_LABELS, EXAMPLE_PARAMS } from "@/lib/examples";
import { cn } from "@/lib/utils";
import type { Distribution } from "@/lib/types";

const ORDER: Distribution[] = ["normal", "binomial", "poisson", "t"];

interface ExampleBarProps {
  active: Distribution;
  onPick: (distribution: Distribution) => void;
  isExample: boolean;
}

/**
 * The four distribution chips. In 2.3 these were inert <span> elements that
 * looked like buttons and did nothing; each now loads a worked example.
 */
export function ExampleBar({ active, onPick, isExample }: ExampleBarProps) {
  return (
    <div className="flex flex-col gap-2 rounded-lg border bg-card px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      {/*
        The value proposition stays visible at all times — it is the answer to
        the survey's weakest item. The example note is secondary to it, not a
        replacement for it.
      */}
      <div className="min-w-0">
        <p className="text-sm text-foreground">
          Check your working against the curve, and see why the answer is what it is.
        </p>
        {isExample && (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Showing a worked example — change any value to use your own.
          </p>
        )}
      </div>
      <div className="flex flex-wrap gap-2">
        {ORDER.map((dist) => (
          <button
            key={dist}
            type="button"
            onClick={() => onPick(dist)}
            aria-pressed={active === dist}
            title={`Load the ${EXAMPLE_LABELS[dist]} example (${EXAMPLE_PARAMS[dist]})`}
            className={cn(
              "rounded-md border px-2.5 py-1.5 text-xs transition-colors",
              "focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring",
              active === dist
                ? "border-primary/40 bg-primary/10 text-primary"
                : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-accent-foreground",
            )}
          >
            <span className="font-medium">{EXAMPLE_LABELS[dist]}</span>
            <span className="opacity-70"> · {EXAMPLE_PARAMS[dist]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
