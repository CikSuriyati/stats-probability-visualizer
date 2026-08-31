import {
  Activity,
  AlertTriangle,
  BarChart3,
  CheckCircle2,
  ExternalLink,
  GraduationCap,
  Scale,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  APP_TITLE,
  COPYRIGHT_HOLDER,
  COPYRIGHT_RANGE,
  LICENSE,
  LICENSE_URL,
} from "@/lib/version";

const GOATCOUNTER_URL = "https://stats-probability-visualizer.goatcounter.com";

export function AboutTab() {
  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <GraduationCap className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Educational purpose</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm leading-relaxed text-muted-foreground">
          <p>
            ProbViz is designed exclusively for educational purposes — to help students understand
            statistical and probability concepts through interactive visualizations. It is intended
            for learning, teaching, and academic research.
          </p>
          <p className="rounded-md border-l-2 border-destructive bg-destructive/5 px-3 py-2 text-foreground">
            <strong>Important:</strong> This application should not be used for critical
            decision-making or professional statistical analysis without proper verification.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <BarChart3 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Normal approximation limitations</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          <ul className="list-disc space-y-2 pl-5">
            <li>
              <strong className="text-foreground">Sample size:</strong> normal approximation is only
              recommended when np ≥ 5 and n(1−p) ≥ 5.
            </li>
            <li>
              <strong className="text-foreground">Continuity correction:</strong> the tool applies a
              ±0.5 correction to improve accuracy.
            </li>
            <li>
              <strong className="text-foreground">Approximation error:</strong> results may differ
              from exact binomial calculations, especially for small samples.
            </li>
            <li>
              <strong className="text-foreground">Edge cases:</strong> extreme probabilities (very
              close to 0 or 1) may have reduced accuracy.
            </li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <CheckCircle2 className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Verification recommended</CardTitle>
        </CardHeader>
        <CardContent className="text-sm leading-relaxed text-muted-foreground">
          <p className="mb-2">For any critical or professional work, we strongly recommend:</p>
          <ul className="list-disc space-y-2 pl-5">
            <li>Verifying results using established statistical software (R, SPSS, SAS, etc.).</li>
            <li>Consulting a qualified statistician for professional applications.</li>
            <li>Cross-checking calculations using multiple methods.</li>
            <li>Understanding the underlying assumptions of each distribution.</li>
          </ul>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <AlertTriangle className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">No warranty on accuracy</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm leading-relaxed text-muted-foreground">
          <p>
            This tool is provided "as is" without any warranty, express or implied. We make no
            representations regarding the accuracy, completeness, or reliability of calculations,
            their fitness for any purpose, or the absence of errors.
          </p>
          <p className="font-medium text-foreground">
            Users assume all risks associated with the use of this tool.
          </p>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <Wrench className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Technical information</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-6 text-sm text-muted-foreground sm:grid-cols-2">
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Libraries used</h4>
            <ul className="list-disc space-y-1 pl-5">
              <li>Recharts for visualizations</li>
              <li>jStat for statistical calculations</li>
              <li>KaTeX for formula rendering</li>
              <li>React + TypeScript + Tailwind + shadcn/ui</li>
            </ul>
          </div>
          <div>
            <h4 className="mb-2 font-semibold text-foreground">Supported distributions</h4>
            <ul className="list-disc space-y-1 pl-5">
              <li>Normal distribution</li>
              <li>t-Distribution</li>
              <li>Binomial distribution</li>
              <li>Poisson distribution</li>
            </ul>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <Activity className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Analytics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            ProbViz uses GoatCounter, a lightweight privacy-friendly analytics service — no personal
            data, no cross-site tracking.
          </p>
          <Button asChild variant="outline">
            <a href={GOATCOUNTER_URL} target="_blank" rel="noopener noreferrer">
              View detailed analytics
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <Scale className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Licence &amp; credits</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm leading-relaxed text-muted-foreground">
          <p>
            © {COPYRIGHT_RANGE} {COPYRIGHT_HOLDER}, Universiti Teknologi MARA, Pahang Branch, Raub
            Campus. ProbViz is licensed under{" "}
            <a
              href={LICENSE_URL}
              target="_blank"
              rel="license noopener noreferrer"
              className="font-medium text-foreground underline decoration-dotted underline-offset-2"
            >
              Creative Commons {LICENSE}
            </a>
            .
          </p>
          <ul className="list-disc space-y-1.5 pl-5">
            <li>
              <strong className="text-foreground">Free for teaching and study</strong> — use it in
              class or to check your own working, and share a link to it.
            </li>
            <li>
              <strong className="text-foreground">Attribution required</strong> — credit the author
              and link the licence.
            </li>
            <li>
              <strong className="text-foreground">No commercial use.</strong>
            </li>
            <li>
              <strong className="text-foreground">No derivatives</strong> — the code, interface
              design and visualisation approach may not be republished as a separate application.
            </li>
          </ul>
          <p className="border-t pt-3">
            <strong className="text-foreground">Contributors.</strong> Created by{" "}
            {COPYRIGHT_HOLDER}. User interface rewrite (v2.2 onward) by Fareez Fauzi.
          </p>
        </CardContent>
      </Card>

      <p className="pb-2 text-center text-xs text-muted-foreground">
        <strong>{APP_TITLE}</strong> · For educational use — always verify results before relying on
        them.
      </p>
    </div>
  );
}
