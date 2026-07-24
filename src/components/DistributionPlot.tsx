import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import type { PlotSpec } from "@/lib/types";
import { useChartColors, type ChartColors } from "@/lib/use-chart-colors";

interface DistributionPlotProps {
  spec: PlotSpec;
}

export function DistributionPlot({ spec }: DistributionPlotProps) {
  const colors = useChartColors();

  return (
    <div className="h-[380px] w-full sm:h-[440px]">
      {/*
        ResponsiveContainer injects width/height into its DIRECT child, so the
        chart element must be returned inline (not wrapped in a component).
      */}
      <ResponsiveContainer width="100%" height="100%">
        {spec.kind === "continuous"
          ? continuousChart(spec, colors)
          : discreteChart(spec, colors)}
      </ResponsiveContainer>
    </div>
  );
}

function continuousChart(spec: Extract<PlotSpec, { kind: "continuous" }>, colors: ChartColors) {
  return (
    <AreaChart data={spec.data} margin={{ top: 24, right: 16, bottom: 24, left: 8 }}>
      <defs>
        <linearGradient id="pdfFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.pdf} stopOpacity={0.25} />
          <stop offset="100%" stopColor={colors.pdf} stopOpacity={0.02} />
        </linearGradient>
        <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={colors.area} stopOpacity={0.55} />
          <stop offset="100%" stopColor={colors.area} stopOpacity={0.12} />
        </linearGradient>
      </defs>
      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
      <XAxis
        dataKey="x"
        type="number"
        domain={["dataMin", "dataMax"]}
        tickFormatter={(v: number) => v.toFixed(2)}
        stroke={colors.axis}
        tick={{ fontSize: 12, fill: colors.axis }}
        tickLine={{ stroke: colors.grid }}
        label={{ value: spec.xLabel, position: "insideBottom", offset: -12, fill: colors.axis }}
      />
      <YAxis
        stroke={colors.axis}
        tick={{ fontSize: 12, fill: colors.axis }}
        tickLine={{ stroke: colors.grid }}
        width={44}
      />
      <Tooltip content={<ChartTooltip continuous />} />
      <Area
        type="monotone"
        dataKey="y"
        stroke={colors.pdf}
        strokeWidth={2}
        fill="url(#pdfFill)"
        isAnimationActive={false}
        name="Density"
      />
      <Area
        type="monotone"
        dataKey="highlight"
        stroke={colors.area}
        strokeWidth={1.5}
        fill="url(#areaFill)"
        connectNulls={false}
        isAnimationActive={false}
        name="Probability area"
      />
      <ReferenceLine
        x={spec.refX}
        stroke={colors.reference}
        strokeDasharray="4 4"
        label={{ value: spec.refLabel, position: "top", fill: colors.reference, fontSize: 12 }}
      />
      {spec.refUpper !== null && (
        <ReferenceLine x={spec.refUpper} stroke={colors.reference} strokeDasharray="4 4" />
      )}
    </AreaChart>
  );
}

function discreteChart(spec: Extract<PlotSpec, { kind: "discrete" }>, colors: ChartColors) {
  return (
    <BarChart data={spec.data} margin={{ top: 24, right: 16, bottom: 24, left: 8 }}>
      <CartesianGrid strokeDasharray="3 3" stroke={colors.grid} vertical={false} />
      <XAxis
        dataKey="x"
        stroke={colors.axis}
        tick={{ fontSize: 12, fill: colors.axis }}
        tickLine={{ stroke: colors.grid }}
        label={{ value: spec.xLabel, position: "insideBottom", offset: -12, fill: colors.axis }}
      />
      <YAxis
        stroke={colors.axis}
        tick={{ fontSize: 12, fill: colors.axis }}
        tickLine={{ stroke: colors.grid }}
        width={44}
      />
      <Tooltip cursor={{ fill: colors.muted, opacity: 0.4 }} content={<ChartTooltip />} />
      <Bar dataKey="y" radius={[3, 3, 0, 0]} isAnimationActive={false} name="Probability">
        {spec.data.map((point, i) => (
          <Cell key={i} fill={point.highlight !== null ? colors.area : colors.pdf} />
        ))}
      </Bar>
    </BarChart>
  );
}

interface TooltipProps {
  active?: boolean;
  payload?: Array<{ payload: { x: number; y: number } }>;
  continuous?: boolean;
}

function ChartTooltip({ active, payload, continuous }: TooltipProps) {
  if (!active || !payload || payload.length === 0) return null;
  const point = payload[0].payload;
  return (
    <div className="rounded-md border bg-popover px-3 py-2 text-xs text-popover-foreground shadow-md">
      <div className="font-medium">
        {continuous ? `x = ${point.x.toFixed(3)}` : `k = ${point.x}`}
      </div>
      <div className="text-muted-foreground">
        {continuous ? "density" : "P"} = {point.y.toFixed(4)}
      </div>
    </div>
  );
}
