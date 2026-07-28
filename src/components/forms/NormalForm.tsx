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
  FormError,
  InequalitySelect,
  PrecisionRadio,
  formatProb,
} from "@/components/forms/shared";
import { normalProbability, ValidationError } from "@/lib/stats";
import { normalCurve } from "@/lib/plot-data";
import { normalExplanation } from "@/lib/explanations";
import type { CalcResult, Inequality, Precision } from "@/lib/types";

export function NormalForm({ onResult }: { onResult: (r: CalcResult) => void }) {
  const [type, setType] = useState<"population" | "sampling">("population");
  const [n, setN] = useState("");
  const [mean, setMean] = useState("");
  const [sd, setSd] = useState("");
  const [inequality, setInequality] = useState<Inequality>("lt");
  const [x, setX] = useState("");
  const [upper, setUpper] = useState("");
  const [precision, setPrecision] = useState<Precision>(4);
  const [error, setError] = useState<string | null>(null);

  const isBetween = inequality === "between";
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
          refUpper: isBetween ? params.upper : null,
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

      <Field label="Mean (μ)" htmlFor="normal-mean">
        <Input id="normal-mean" type="number" value={mean} onChange={(e) => setMean(e.target.value)} />
      </Field>

      <Field label="Standard deviation (σ)" htmlFor="normal-sd">
        <Input id="normal-sd" type="number" value={sd} onChange={(e) => setSd(e.target.value)} />
      </Field>

      <InequalitySelect value={inequality} onChange={setInequality} />

      <Field label={isBetween ? "Lower bound (a)" : "X value"} htmlFor="normal-x">
        <Input id="normal-x" type="number" value={x} onChange={(e) => setX(e.target.value)} />
      </Field>

      {isBetween && (
        <Field label="Upper bound (b)" htmlFor="normal-upper">
          <Input
            id="normal-upper"
            type="number"
            value={upper}
            onChange={(e) => setUpper(e.target.value)}
          />
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
