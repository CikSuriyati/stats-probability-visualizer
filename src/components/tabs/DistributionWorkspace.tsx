import { useState } from "react";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DistributionPlot } from "@/components/DistributionPlot";
import { ExplanationPanel } from "@/components/ExplanationPanel";
import { ResultCard } from "@/components/forms/shared";
import { WelcomeState } from "@/components/WelcomeState";
import type { CalcResult, Distribution } from "@/lib/types";

export interface DistributionOption {
  value: Distribution;
  label: string;
}

interface DistributionWorkspaceProps {
  options: DistributionOption[];
  /** Renders the parameter form for the chosen distribution. */
  renderForm: (distribution: Distribution, onResult: (r: CalcResult) => void) => React.ReactNode;
}

export function DistributionWorkspace({ options, renderForm }: DistributionWorkspaceProps) {
  const [selected, setSelected] = useState<Distribution | "">("");
  const [result, setResult] = useState<CalcResult | null>(null);

  function handleSelect(value: string) {
    setSelected(value as Distribution);
    setResult(null); // reset when switching distribution
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
      {/* Parameters */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Distribution parameters</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1.5">
            <Label>Select distribution</Label>
            <Select value={selected} onValueChange={handleSelect}>
              <SelectTrigger>
                <SelectValue placeholder="— Choose —" />
              </SelectTrigger>
              <SelectContent>
                {options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selected && <div key={selected}>{renderForm(selected, setResult)}</div>}
          {selected && result && <ResultCard result={result} />}
        </CardContent>
      </Card>

      {/* Visualization + explanation */}
      <div className="space-y-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Visualization</CardTitle>
          </CardHeader>
          <CardContent>
            {result ? <DistributionPlot spec={result.plot} /> : <WelcomeState />}
          </CardContent>
        </Card>
        <ExplanationPanel explanation={result?.explanation ?? null} />
      </div>
    </div>
  );
}
