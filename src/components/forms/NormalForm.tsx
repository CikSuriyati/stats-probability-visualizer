import { useState } from "react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Field,
  FieldRow,
  FormError,
  InequalitySelect,
  PrecisionRadio,
  formatProb,
} from "@/components/forms/shared";
import { normalProbability, ValidationError } from "@/lib/stats";
import { normalCurve } from "@/lib/plot-data";
import { normalExplanation } from "@/lib/explanations";
import { isBetween, type CalcResult, type Inequality, type Precision } from "@/lib/types";
import type { ExampleFields } from "@/lib/examples";

export function NormalForm({
  onResult,
  initial,
}: {
  onResult: (r: CalcResult) => void;
  initial?: ExampleFields;
}) {
  const [type, setType] = useState<"population" | "sampling">(
    (initial?.type as "population" | "sampling") ?? "population",
  );
  const [n, setN] = useState(initial?.n ?? "");
  const [mean, setMean] = useState(initial?.mean ?? "");
  const [sd, setSd] = useState(initial?.sd ?? "");
  const [inequality, setInequality] = useState<Inequality>(
    (initial?.inequality as Inequality) ?? "lt",
  );
  const [x, setX] = useState(initial?.x ?? "");
  const [upper, setUpper] = useState(initial?.upper ?? "");
  const [precision, setPrecision] = useState<Precision>(4);
  const [error, setError] = useState<string | null>(null);

  const twoBound = isBetween(inequality);
  const isSampling = type === "sampling";

  function handleCalculate() {
    const params = {
      type,
      mean: parseFloat(mean),
      sd: parseFloat(sd),
      inequality,
      x: parseFloat(x),
      upper: parseFloat(upper),
      n: parseFloat(n),
    };
    try {
      const { probability, sdUsed, zScore } = normalProbability(params);
      const data = normalCurve(params.mean, sdUsed, params.x, params.upper, inequality);
      const explanation = normalExplanation(
        params.mean,
        params.sd,
        params.x,
        params.upper,
        inequality,
        type,
        params.n,
      );
      onResult({
        distribution: "normal",
        probability,
        precision,
        display: formatProb(probability, precision),
        meta: isSampling ? [`Standard error σ/√n = ${sdUsed.toFixed(4)}`] : [],
        plot: {
          kind: "continuous",
          data,
          refX: params.x,
          refUpper: twoBound ? params.upper : null,
          refLabel: `Z = ${zScore.toFixed(2)}`,
          xLabel: "x",
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
      <Field label="Type">
        <Select value={type} onValueChange={(v) => setType(v as "population" | "sampling")}>
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="population">Population</SelectItem>
            <SelectItem value="sampling">Sampling distribution</SelectItem>
          </SelectContent>
        </Select>
      </Field>

      {isSampling && (
        <Field label="Sample size (n)" htmlFor="normal-n">
          <Input id="normal-n" type="number" value={n} onChange={(e) => setN(e.target.value)} />
        </Field>
      )}

      <FieldRow>
        <Field label="Mean (μ)" htmlFor="normal-mean">
          <Input
            id="normal-mean"
            type="number"
            value={mean}
            onChange={(e) => setMean(e.target.value)}
          />
        </Field>
        <Field label="Std. deviation (σ)" htmlFor="normal-sd">
          <Input id="normal-sd" type="number" value={sd} onChange={(e) => setSd(e.target.value)} />
        </Field>
      </FieldRow>

      <InequalitySelect value={inequality} onChange={setInequality} />

      {twoBound ? (
        <FieldRow>
          <Field label="Lower bound (a)" htmlFor="normal-x">
            <Input id="normal-x" type="number" value={x} onChange={(e) => setX(e.target.value)} />
          </Field>
          <Field label="Upper bound (b)" htmlFor="normal-upper">
            <Input
              id="normal-upper"
              type="number"
              value={upper}
              onChange={(e) => setUpper(e.target.value)}
            />
          </Field>
        </FieldRow>
      ) : (
        <Field label="X value" htmlFor="normal-x">
          <Input id="normal-x" type="number" value={x} onChange={(e) => setX(e.target.value)} />
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
