import { BinomialForm } from "@/components/forms/BinomialForm";
import { PoissonForm } from "@/components/forms/PoissonForm";
import { DistributionWorkspace } from "@/components/tabs/DistributionWorkspace";
import type { ExampleFields } from "@/lib/examples";
import type { CalcResult, Distribution } from "@/lib/types";

const OPTIONS = [
  { value: "binomial" as Distribution, label: "Binomial distribution" },
  { value: "poisson" as Distribution, label: "Poisson distribution" },
];

interface TabProps {
  requestedExample?: { distribution: Distribution; nonce: number } | null;
  onPickExample: (d: Distribution) => void;
}

export function DiscreteTab({ requestedExample, onPickExample }: TabProps) {
  return (
    <DistributionWorkspace
      options={OPTIONS}
      defaultDistribution="binomial"
      requestedExample={requestedExample}
      onPickExample={onPickExample}
      renderForm={(
        dist: Distribution,
        onResult: (r: CalcResult) => void,
        initial: ExampleFields | undefined,
      ) =>
        dist === "binomial" ? (
          <BinomialForm onResult={onResult} initial={initial} />
        ) : (
          <PoissonForm onResult={onResult} initial={initial} />
        )
      }
    />
  );
}
