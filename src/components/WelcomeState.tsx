import { BarChart3 } from "lucide-react";

const TAGS = ["Normal", "Binomial", "Poisson", "t-Distribution"];

export function WelcomeState() {
  return (
    <div className="flex h-full min-h-[320px] flex-col items-center justify-center px-6 py-10 text-center">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
        <BarChart3 className="h-7 w-7" />
      </div>
      <h3 className="mb-2 font-serif text-xl font-semibold">Welcome to ProbViz</h3>
      <p className="mb-5 max-w-md text-sm leading-relaxed text-muted-foreground">
        Select a distribution on the left and enter your values to see the probability
        visualization come to life.
      </p>
      <div className="flex flex-wrap justify-center gap-2">
        {TAGS.map((tag) => (
          <span
            key={tag}
            className="rounded-full border bg-muted/60 px-3 py-1 text-xs font-medium text-muted-foreground"
          >
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
}
