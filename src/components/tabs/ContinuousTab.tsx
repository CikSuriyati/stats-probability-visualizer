import { NormalForm } from "@/components/forms/NormalForm";
import { TForm } from "@/components/forms/TForm";
import { DistributionWorkspace } from "@/components/tabs/DistributionWorkspace";
import type { CalcResult, Distribution } from "@/lib/types";

const OPTIONS = [
  { value: "normal" as Distribution, label: "Normal distribution" },
  { value: "t" as Distribution, label: "t-Distribution" },
];

export function ContinuousTab() {
  return (
    <DistributionWorkspace
      options={OPTIONS}
      renderForm={(dist: Distribution, onResult: (r: CalcResult) => void) =>
        dist === "normal" ? <NormalForm onResult={onResult} /> : <TForm onResult={onResult} />
      }
    />
  );
}
