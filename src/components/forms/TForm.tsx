import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Field,
  FieldRow,
  FormError,
  InequalitySelect,
  PrecisionRadio,
  formatProb,
} from "@/components/forms/shared";
import { tProbability, ValidationError } from "@/lib/stats";
import { tCurve } from "@/lib/plot-data";
import { tExplanation } from "@/lib/explanations";
import { isBetween, type CalcResult, type Inequality, type Precision } from "@/lib/types";
import type { ExampleFields } from "@/lib/examples";

export function TForm({
  onResult,
  initial,
}: {
  onResult: (r: CalcResult) => void;
  initial?: ExampleFields;
}) {
  const [df, setDf] = useState(initial?.df ?? "");
  const [inequality, setInequality] = useState<Inequality>(
    (initial?.inequality as Inequality) ?? "lt",
  );
  const [x, setX] = useState(initial?.x ?? "");
  const [upper, setUpper] = useState(initial?.upper ?? "");
  const [precision, setPrecision] = useState<Precision>(4);
  const [error, setError] = useState<string | null>(null);

  const twoBound = isBetween(inequality);

  function handleCalculate() {
    const params = {
      df: parseFloat(df),
      inequality,
      x: parseFloat(x),
      upper: parseFloat(upper),
    };
    try {
      const { probability } = tProbability(params);
      const data = tCurve(params.df, params.x, params.upper, inequality);
      const explanation = tExplanation(params.df, params.x, params.upper, inequality);
      onResult({
        distribution: "t",
        probability,
        precision,
        display: formatProb(probability, precision),
        meta: [`Degrees of freedom: ${params.df}`],
        plot: {
          kind: "continuous",
          data,
          refX: params.x,
          refUpper: twoBound ? params.upper : null,
          refLabel: `t = ${params.x}`,
          xLabel: "t",
        },
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
      <Field label="Degrees of freedom (df)" htmlFor="t-df">
        <Input id="t-df" type="number" value={df} onChange={(e) => setDf(e.target.value)} />
      </Field>

      <InequalitySelect value={inequality} onChange={setInequality} />

      {twoBound ? (
        <FieldRow>
          <Field label="Lower bound (a)" htmlFor="t-x">
            <Input id="t-x" type="number" value={x} onChange={(e) => setX(e.target.value)} />
          </Field>
          <Field label="Upper bound (b)" htmlFor="t-upper">
            <Input id="t-upper" type="number" value={upper} onChange={(e) => setUpper(e.target.value)} />
          </Field>
        </FieldRow>
      ) : (
        <Field label="X value" htmlFor="t-x">
          <Input id="t-x" type="number" value={x} onChange={(e) => setX(e.target.value)} />
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
