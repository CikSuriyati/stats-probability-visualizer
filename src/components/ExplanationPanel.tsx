import { BookOpen } from "lucide-react";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Katex, RichMath } from "@/components/Katex";
import type { Explanation } from "@/lib/types";

interface ExplanationPanelProps {
  explanation: Explanation | null;
}

export function ExplanationPanel({ explanation }: ExplanationPanelProps) {
  return (
    <Accordion type="single" collapsible className="rounded-lg border bg-card px-4">
      <AccordionItem value="explanation" className="border-b-0">
        <AccordionTrigger className="hover:no-underline">
          <span className="flex items-center gap-2 font-semibold">
            <BookOpen className="h-4 w-4 text-primary" />
            Explanation &amp; Formula
          </span>
        </AccordionTrigger>
        <AccordionContent>
          {explanation ? (
            <div className="space-y-4">
              <section>
                <h4 className="mb-2 text-sm font-semibold text-foreground">Formula used</h4>
                <div className="overflow-x-auto rounded-md border bg-muted/40 px-4 py-3">
                  <Katex math={explanation.formula} display />
                </div>
              </section>

              <section className="rounded-md border-l-2 border-primary bg-muted/30 px-4 py-3">
                <h4 className="mb-1 text-sm font-semibold">Interpretation</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <RichMath text={explanation.interpretation} />
                </p>
              </section>

              <section className="rounded-md border-l-2 border-chart-1 bg-muted/30 px-4 py-3">
                <h4 className="mb-1 text-sm font-semibold">Shaded area</h4>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  <RichMath text={explanation.shadedArea} />
                </p>
              </section>
            </div>
          ) : (
            <p className="py-2 text-sm italic text-muted-foreground">
              Select a distribution and calculate a probability to see the explanation.
            </p>
          )}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
}
