import {
  Activity,
  AlertTriangle,
  Award,
  BarChart3,
  BookOpen,
  CheckCircle2,
  Copyright as CopyrightIcon,
  ExternalLink,
  GraduationCap,
  History,
  Wrench,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { APP_TITLE, COPYRIGHT_YEAR } from "@/lib/version";

const GOATCOUNTER_URL = "https://stats-probability-visualizer.goatcounter.com";

export function AboutTab() {
  return (
    <div className="space-y-6">
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

      <Card className="border-violet-200 dark:border-violet-900">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <CopyrightIcon className="h-5 w-5 text-violet-600 dark:text-violet-400" />
          <CardTitle className="text-base">Copyright</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted-foreground">
          <span className="inline-flex items-center rounded-full border border-violet-300 bg-violet-50 px-3 py-1 text-xs font-semibold text-violet-700 dark:border-violet-800 dark:bg-violet-950 dark:text-violet-300">
            © IP/CR/08563
          </span>
          <p className="leading-relaxed">
            Registered as &ldquo;ProbViz: INTERACTIVE STATISTICS &amp; PROBABILITY
            VISUALIZER&rdquo;.
          </p>
        </CardContent>
      </Card>

      <Card className="border-blue-200 dark:border-blue-900">
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <BookOpen className="h-5 w-5 text-blue-600 dark:text-blue-400" />
          <CardTitle className="text-base">Publication</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p className="leading-relaxed text-foreground">
            &ldquo;ProbViz: Interactive Statistics &amp; Probability Visualizer&rdquo;
            <br />
            <span className="text-muted-foreground">
              Muhammad Fareez Bin Mohd Fauzi, Suriyati Ujang
            </span>
          </p>
          <p className="text-xs">
            Published in the PIID2025 Extended Abstracts e-Proceedings, p. 1526–1527 (eISBN
            978-629-92685-0-5).
          </p>
          <div className="flex flex-wrap gap-2">
            <img
              src="/paper-piid2025-certificate.jpg"
              alt="PIID2025 Certificate of Achievement: Silver Award for ProbViz: Interactive Statistics & Probability Visualizer"
              className="w-32 sm:w-40 rounded-md border"
            />
            <img
              src="/paper-piid2025-abstract.png"
              alt="Extended abstract: Abstract, Keywords and Product description sections for ProbViz"
              className="w-32 sm:w-40 rounded-md border"
            />
          </div>
          <Button
            asChild
            size="sm"
            className="border-blue-300 bg-blue-600 text-white hover:bg-blue-700 dark:border-blue-800"
          >
            <a
              href="https://piid2025.uitmcpp.com/index.php#Published_EA"
              target="_blank"
              rel="noopener noreferrer"
            >
              Read the published extended abstract
              <ExternalLink className="h-4 w-4" />
            </a>
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex-row items-center gap-3 space-y-0">
          <History className="h-5 w-5 text-primary" />
          <CardTitle className="text-base">Project history</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          <p>
            ProbViz began in August 2025 as a single-page normal-distribution calculator and has
            been developed openly ever since.
          </p>

          <div className="rounded-md border p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
              Version 1 · August 2025
            </p>
            <p className="mb-3 leading-relaxed">
              The original release: an interactive curve for the normal distribution, built to
              make one concept — the area under the curve — visible rather than memorised.
            </p>
            <span className="inline-flex items-center gap-1 rounded-full border border-amber-300 bg-amber-50 px-3 py-1 text-xs font-semibold text-amber-700 dark:border-amber-800 dark:bg-amber-950 dark:text-amber-300">
              <Award className="h-3.5 w-3.5" />
              Silver medal · PIID 2025
            </span>
            <p className="mt-3 leading-relaxed">
              This is the version entered into the Penang International Invention, Innovation
              &amp; Design (PIID) 2025 competition, and later published — see{" "}
              <span className="font-medium text-blue-600 dark:text-blue-400">Publication</span>{" "}
              above.
            </p>
          </div>

          <div className="rounded-md border p-4">
            <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-foreground">
              Version 2.0–2.4 · October 2025 – August 2026
            </p>
            <p className="mb-2 leading-relaxed">
              Pedagogical UI improvements on the original normal-distribution core, followed by a
              ground-up rewrite onto React, TypeScript, Tailwind and shadcn/ui — the foundation
              ProbViz still runs on today.
            </p>
            <ul className="list-disc space-y-1 pl-5">
              <li>Z-score annotations and shaded probability-area labels on the curve</li>
              <li>A dedicated About page with usage and accuracy disclaimers</li>
              <li>A mobile-responsive, stacked layout</li>
              <li>
                Binomial, Poisson and t-distribution support, alongside the original Normal
                distribution
              </li>
              <li>KaTeX-rendered formulas in place of plain text</li>
              <li>A worked example on landing, more inequality forms, and a visual refresh (2.4)</li>
            </ul>
            <span className="mt-3 inline-flex items-center rounded-full border border-muted-foreground/30 bg-muted px-3 py-1 text-xs font-semibold text-muted-foreground">
              Entered · VIIIC 2026
            </span>
            <p className="mt-3 leading-relaxed">
              Version 2.4 was entered into the 5th International Business &amp; Management Virtual
              Innovation &amp; Invention Ideas Competition (VIIIC 2026). Results have not yet been
              announced and are due 6 October 2026.
            </p>
          </div>
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

      <p className="pb-2 text-center text-xs text-muted-foreground">
        <strong>{APP_TITLE}</strong> · © {COPYRIGHT_YEAR} · For educational use only.
        <br />
        Copyright registered as &ldquo;ProbViz: INTERACTIVE STATISTICS &amp; PROBABILITY
        VISUALIZER&rdquo; · IP/CR/08563
      </p>
    </div>
  );
}
