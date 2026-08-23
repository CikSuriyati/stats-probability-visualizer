import { useEffect, useState } from "react";
import { RotateCcw } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { ExampleBar } from "@/components/ExampleBar";
import { ResultCard } from "@/components/forms/shared";
import { getExample, type ExampleFields } from "@/lib/examples";
import type { CalcResult, Distribution } from "@/lib/types";

export interface DistributionOption {
  value: Distribution;
  label: string;
}

interface DistributionWorkspaceProps {
  options: DistributionOption[];
  /** Distribution this tab lands on, already worked through as an example. */
  defaultDistribution: Distribution;
  /** Set by a pill click elsewhere in the app; loads that example here. */
  requestedExample?: { distribution: Distribution; nonce: number } | null;
  onPickExample: (distribution: Distribution) => void;
  renderForm: (
    distribution: Distribution,
    onResult: (r: CalcResult) => void,
    initial: ExampleFields | undefined,
    resetKey: number,
  ) => React.ReactNode;
}

export function DistributionWorkspace({
  options,
  defaultDistribution,
  requestedExample,
  onPickExample,
  renderForm,
}: DistributionWorkspaceProps) {
  const initial = getExample(defaultDistribution);
  const [selected, setSelected] = useState<Distribution>(defaultDistribution);
  const [result, setResult] = useState<CalcResult | null>(initial.result);
  const [fields, setFields] = useState<ExampleFields | undefined>(initial.fields);
  const [resetKey, setResetKey] = useState(0);

  // A pill click for a distribution this tab owns loads its worked example.
  useEffect(() => {
    if (!requestedExample) return;
    if (!options.some((o) => o.value === requestedExample.distribution)) return;
    loadExample(requestedExample.distribution);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [requestedExample?.nonce, requestedExample?.distribution]);

  function loadExample(distribution: Distribution) {
    const ex = getExample(distribution);
    setSelected(distribution);
    setFields(ex.fields);
    setResult(ex.result);
    setResetKey((k) => k + 1);
  }

  function handleSelect(value: string) {
    // Switching distribution shows that distribution's worked example, so the
    // panel is never empty.
    loadExample(value as Distribution);
  }

  function handleReset() {
    setFields(undefined);
    setResult(null);
    setResetKey((k) => k + 1);
  }

  const isExample = result?.isExample === true;

  return (
    <div className="space-y-4">
      <ExampleBar active={selected} onPick={onPickExample} isExample={isExample} />

      <div className="grid gap-6 lg:grid-cols-[minmax(0,380px)_1fr]">
        {/* Parameters */}
        <Card>
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <CardTitle className="text-base">Distribution parameters</CardTitle>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              className="h-8 gap-1.5 text-xs text-muted-foreground"
            >
              <RotateCcw className="h-3.5 w-3.5" />
              Clear
            </Button>
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

            <div key={`${selected}-${resetKey}`}>
              {renderForm(selected, setResult, fields, resetKey)}
            </div>
            {result && <ResultCard result={result} />}
          </CardContent>
        </Card>

        {/* Visualization + explanation */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="flex-row items-center justify-between space-y-0">
              <CardTitle className="text-base">Visualization</CardTitle>
              {isExample && (
                <span className="rounded-full border border-primary/30 bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                  Example
                </span>
              )}
            </CardHeader>
            <CardContent>
              {result ? <DistributionPlot spec={result.plot} /> : <EmptyPlot />}
            </CardContent>
          </Card>
          <ExplanationPanel
            explanation={result?.explanation ?? null}
            defaultOpen={isExample}
            openKey={resetKey}
          />
        </div>
      </div>
    </div>
  );
}

function EmptyPlot() {
  return (
    <div className="flex h-[380px] items-center justify-center text-center text-sm text-muted-foreground sm:h-[440px]">
      Enter your values and select Calculate to see the curve.
    </div>
  );
}
