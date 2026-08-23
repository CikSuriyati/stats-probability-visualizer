import { NormalForm } from "@/components/forms/NormalForm";
import { TForm } from "@/components/forms/TForm";
import { DistributionWorkspace } from "@/components/tabs/DistributionWorkspace";
import type { ExampleFields } from "@/lib/examples";
import type { CalcResult, Distribution } from "@/lib/types";

const OPTIONS = [
  { value: "normal" as Distribution, label: "Normal distribution" },
  { value: "t" as Distribution, label: "t-Distribution" },
];

interface TabProps {
  requestedExample?: { distribution: Distribution; nonce: number } | null;
  onPickExample: (d: Distribution) => void;
}

export function ContinuousTab({ requestedExample, onPickExample }: TabProps) {
  return (
    <DistributionWorkspace
      options={OPTIONS}
      defaultDistribution="normal"
      requestedExample={requestedExample}
      onPickExample={onPickExample}
      renderForm={(
        dist: Distribution,
        onResult: (r: CalcResult) => void,
        initial: ExampleFields | undefined,
      ) =>
        dist === "normal" ? (
          <NormalForm onResult={onResult} initial={initial} />
        ) : (
          <TForm onResult={onResult} initial={initial} />
        )
      }
    />
  );
}
