import { AlertCircle } from "lucide-react";

import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CalcResult, Inequality, Precision } from "@/lib/types";
import { Card, CardContent } from "@/components/ui/card";

/** A labelled form field. */
export function Field({
  label,
  htmlFor,
  children,
}: {
  label: string;
  htmlFor?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label htmlFor={htmlFor}>{label}</Label>
      {children}
    </div>
  );
}

const CONTINUOUS_OPS: { value: Inequality; label: string }[] = [
  { value: "lt", label: "P(X < x)" },
  { value: "le", label: "P(X ≤ x)" },
  { value: "gt", label: "P(X > x)" },
  { value: "ge", label: "P(X ≥ x)" },
  { value: "between", label: "P(a ≤ X ≤ b)" },
];

const DISCRETE_OPS: { value: Inequality; label: string }[] = [
  { value: "eq", label: "P(X = k)" },
  { value: "lt", label: "P(X < k)" },
  { value: "le", label: "P(X ≤ k)" },
  { value: "gt", label: "P(X > k)" },
  { value: "ge", label: "P(X ≥ k)" },
  { value: "between", label: "P(a ≤ X ≤ b)" },
];

export function InequalitySelect({
  value,
  onChange,
  discrete = false,
}: {
  value: Inequality;
  onChange: (v: Inequality) => void;
  discrete?: boolean;
}) {
  const ops = discrete ? DISCRETE_OPS : CONTINUOUS_OPS;
  return (
    <Field label="Inequality">
      <Select value={value} onValueChange={(v) => onChange(v as Inequality)}>
        <SelectTrigger>
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {ops.map((op) => (
            <SelectItem key={op.value} value={op.value}>
              {op.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </Field>
  );
}

export function PrecisionRadio({
  value,
  onChange,
}: {
  value: Precision;
  onChange: (v: Precision) => void;
}) {
  return (
    <div className="rounded-lg border bg-muted/40 p-3">
      <RadioGroup
        value={String(value)}
        onValueChange={(v) => onChange(Number(v) as Precision)}
        className="gap-2"
      >
        <div className="flex items-center gap-2">
          <RadioGroupItem value="4" id="precision-4" />
          <Label htmlFor="precision-4" className="cursor-pointer font-normal">
            Statistical table format (4 decimals)
          </Label>
        </div>
        <div className="flex items-center gap-2">
          <RadioGroupItem value="6" id="precision-6" />
          <Label htmlFor="precision-6" className="cursor-pointer font-normal">
            High precision (6 decimals)
          </Label>
        </div>
      </RadioGroup>
    </div>
  );
}

export function FormError({ message }: { message: string | null }) {
  if (!message) return null;
  return (
    <div className="flex items-start gap-2 rounded-md border border-destructive/40 bg-destructive/10 px-3 py-2 text-sm text-destructive">
      <AlertCircle className="mt-0.5 h-4 w-4 shrink-0" />
      <span>{message}</span>
    </div>
  );
}

export function ResultCard({ result }: { result: CalcResult }) {
  return (
    <Card className="border-primary/30 bg-primary/5">
      <CardContent className="space-y-2 p-4">
        <div className="text-sm font-medium text-muted-foreground">Probability result</div>
        <div className="text-2xl font-semibold tabular-nums text-primary">{result.display}</div>
        {result.meta.length > 0 && (
          <div className="space-y-0.5 text-xs text-muted-foreground">
            {result.meta.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}

/** Formats a probability to the chosen precision. */
export function formatProb(prob: number, precision: Precision): string {
  return prob.toFixed(precision);
}
