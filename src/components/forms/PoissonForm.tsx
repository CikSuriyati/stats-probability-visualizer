import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FormError,
  InequalitySelect,
  PrecisionRadio,
  formatProb,
} from "@/components/forms/shared";
import { poissonProbability, ValidationError } from "@/lib/stats";
import { poissonPmf } from "@/lib/plot-data";
import { poissonExplanation } from "@/lib/explanations";
import type { CalcResult, Inequality, Precision } from "@/lib/types";

export function PoissonForm({ onResult }: { onResult: (r: CalcResult) => void }) {
  const [lambda, setLambda] = useState("");
  const [inequality, setInequality] = useState<Inequality>("le");
  const [x, setX] = useState("");
  const [upper, setUpper] = useState("");
  const [precision, setPrecision] = useState<Precision>(4);
  const [error, setError] = useState<string | null>(null);

  const isBetween = inequality === "between";

  function handleCalculate() {
    const params = {
      lambda: parseFloat(lambda),
      inequality,
      x: parseInt(x, 10),
      upper: parseInt(upper, 10),
    };
    try {
      const { probability, description } = poissonProbability(params);
      const data = poissonPmf(params.lambda, params.x, params.upper, inequality);
      const explanation = poissonExplanation(params.lambda, params.x, params.upper, inequality);
      onResult({
        distribution: "poisson",
        probability,
        precision,
        display: `${description} = ${formatProb(probability, precision)}`,
        meta: [
          `Mean (λ) = ${params.lambda}   •   Variance = ${params.lambda}   •   SD = ${Math.sqrt(params.lambda).toFixed(4)}`,
          params.lambda >= 10
            ? "✓ Normal approximation available (λ ≥ 10)"
            : "⚠️ Normal approximation not recommended (λ < 10)",
        ],
        plot: { kind: "discrete", data, xLabel: "Number of events (k)" },
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
      <Field label="Rate parameter (λ)" htmlFor="pois-lambda">
        <Input id="pois-lambda" type="number" step="any" placeholder="e.g. 3.5" value={lambda} onChange={(e) => setLambda(e.target.value)} />
      </Field>

      <InequalitySelect value={inequality} onChange={setInequality} discrete />

      <Field label={isBetween ? "Lower bound (a)" : "X value (k)"} htmlFor="pois-x">
        <Input id="pois-x" type="number" placeholder="e.g. 2" value={x} onChange={(e) => setX(e.target.value)} />
      </Field>

      {isBetween && (
        <Field label="Upper bound (b)" htmlFor="pois-upper">
          <Input id="pois-upper" type="number" placeholder="e.g. 5" value={upper} onChange={(e) => setUpper(e.target.value)} />
        </Field>
      )}

      <PrecisionRadio value={precision} onChange={setPrecision} />
      <FormError message={error} />
      <Button className="w-full" onClick={handleCalculate}>
        Calculate probability
      </Button>
    </div>
  );
}
