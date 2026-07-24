import { BinomialForm } from "@/components/forms/BinomialForm";
import { PoissonForm } from "@/components/forms/PoissonForm";
import { DistributionWorkspace } from "@/components/tabs/DistributionWorkspace";
import type { CalcResult, Distribution } from "@/lib/types";

const OPTIONS = [
  { value: "binomial" as Distribution, label: "Binomial distribution" },
  { value: "poisson" as Distribution, label: "Poisson distribution" },
];

export function DiscreteTab() {
  return (
    <DistributionWorkspace
      options={OPTIONS}
      renderForm={(dist: Distribution, onResult: (r: CalcResult) => void) =>
        dist === "binomial" ? (
          <BinomialForm onResult={onResult} />
        ) : (
          <PoissonForm onResult={onResult} />
        )
      }
    />
  );
}
