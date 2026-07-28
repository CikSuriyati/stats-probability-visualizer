import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Field,
  FormError,
  InequalitySelect,
  PrecisionRadio,
  formatProb,
} from "@/components/forms/shared";
import { binomialProbability, ValidationError } from "@/lib/stats";
import { binomialPmf } from "@/lib/plot-data";
import { binomialExplanation } from "@/lib/explanations";
import type { CalcResult, Inequality, Precision } from "@/lib/types";

export function BinomialForm({ onResult }: { onResult: (r: CalcResult) => void }) {
  const [n, setN] = useState("");
  const [p, setP] = useState("");
  const [inequality, setInequality] = useState<Inequality>("le");
  const [x, setX] = useState("");
  const [upper, setUpper] = useState("");
  const [continuity, setContinuity] = useState(false);
  const [precision, setPrecision] = useState<Precision>(4);
  const [error, setError] = useState<string | null>(null);

  const isBetween = inequality === "between";

  function handleCalculate() {
    const params = {
      n: parseInt(n, 10),
      p: parseFloat(p),
      inequality,
      x: parseInt(x, 10),
      upper: parseInt(upper, 10),
      continuityCorrection: continuity,
    };
    try {
      const { probability, method, warning } = binomialProbability(params);
      const data = binomialPmf(params.n, params.p, params.x, params.upper, inequality);
      const explanation = binomialExplanation(
        params.n,
        params.p,
        params.x,
        params.upper,
        inequality,
        continuity,
      );
      const meta = [`Method: ${method}`];
      if (warning) meta.push(warning);
      onResult({
        distribution: "binomial",
        probability,
        precision,
        display: formatProb(probability, precision),
        meta,
        plot: { kind: "discrete", data, xLabel: "Number of successes (k)" },
        explanation,
      });
      setError(null);
    } catch (e) {
      if (e instanceof ValidationError) setError(e.message);
      else throw e;
    }
  }

  return (
    <div className="space-y-4">
      <Field label="Number of trials (n)" htmlFor="binom-n">
        <Input id="binom-n" type="number" placeholder="e.g. 20" value={n} onChange={(e) => setN(e.target.value)} />
      </Field>

      <Field label="Probability of success (p)" htmlFor="binom-p">
        <Input id="binom-p" type="number" step="any" placeholder="e.g. 0.3" value={p} onChange={(e) => setP(e.target.value)} />
      </Field>

      <InequalitySelect value={inequality} onChange={setInequality} discrete />

      <Field label={isBetween ? "Lower bound (a)" : "X value (k)"} htmlFor="binom-x">
        <Input id="binom-x" type="number" placeholder="e.g. 5" value={x} onChange={(e) => setX(e.target.value)} />
      </Field>

      {isBetween && (
        <Field label="Upper bound (b)" htmlFor="binom-upper">
          <Input id="binom-upper" type="number" placeholder="e.g. 10" value={upper} onChange={(e) => setUpper(e.target.value)} />
        </Field>
      )}

      <div className="rounded-lg border bg-muted/40 p-3">
        <div className="flex items-start gap-2">
          <Checkbox
            id="binom-continuity"
            checked={continuity}
            onCheckedChange={(v) => setContinuity(v === true)}
            className="mt-0.5"
          />
          <div className="space-y-1">
            <Label htmlFor="binom-continuity" className="cursor-pointer font-normal">
              Apply continuity correction for normal approximation
            </Label>
            <p className="text-xs text-muted-foreground">
              Recommended when np ≥ 5 and n(1−p) ≥ 5.
            </p>
          </div>
        </div>
      </div>

      <PrecisionRadio value={precision} onChange={setPrecision} />
      <FormError message={error} />
      <Button className="w-full" onClick={handleCalculate}>
        Calculate probability
      </Button>
    </div>
  );
}
