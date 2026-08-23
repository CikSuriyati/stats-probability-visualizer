import { useState } from "react";

import { APP_NAME, APP_TITLE, APP_VERSION, COPYRIGHT_YEAR } from "@/lib/version";
import { DISCRETE_DISTRIBUTIONS } from "@/lib/examples";
import type { Distribution } from "@/lib/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";
import { ContinuousTab } from "@/components/tabs/ContinuousTab";
import { DiscreteTab } from "@/components/tabs/DiscreteTab";
import { AboutTab } from "@/components/tabs/AboutTab";

/** Underline nav in place of the default pill tabs. */
const NAV_LIST = "h-auto gap-6 rounded-none bg-transparent p-0";
const NAV_ITEM =
  "rounded-none border-b-2 border-transparent bg-transparent px-0 pb-1.5 pt-0 " +
  "text-xs font-semibold uppercase tracking-wider text-muted-foreground shadow-none " +
  "transition-colors hover:text-foreground " +
  "data-[state=active]:border-primary data-[state=active]:bg-transparent " +
  "data-[state=active]:text-foreground data-[state=active]:shadow-none";

export default function App() {
  const [tab, setTab] = useState("continuous");
  const [requestedExample, setRequestedExample] = useState<{
    distribution: Distribution;
    nonce: number;
  } | null>(null);

  // A pill may name a distribution that lives on the other tab, so switch
  // tabs first, then hand the request to whichever workspace owns it.
  function handlePickExample(distribution: Distribution) {
    setTab(DISCRETE_DISTRIBUTIONS.includes(distribution) ? "discrete" : "continuous");
    setRequestedExample((prev) => ({ distribution, nonce: (prev?.nonce ?? 0) + 1 }));
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/*
          Tabs wraps the header so the nav is a real tablist — keeping the
          Radix tab/tabpanel relationship intact now that it sits up here.
        */}
        <Tabs value={tab} onValueChange={setTab} className="w-full">
          <header className="mb-6 border-b-2 border-foreground/15 pb-4">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              {/* Identity */}
              <div>
                <h1 className="flex items-center gap-2.5 font-serif text-4xl font-bold leading-none tracking-tight sm:text-5xl">
                  {APP_NAME}
                  <span className="rounded border border-primary/40 px-1.5 py-0.5 font-sans text-xs font-semibold leading-none text-primary">
                    {APP_VERSION}
                  </span>
                </h1>
                <p className="mt-2 text-sm text-muted-foreground">
                  See the curve, understand the concept.
                </p>
              </div>

              {/* Nav + theme */}
              <div className="flex items-center justify-between gap-6 sm:justify-end">
                <TabsList className={NAV_LIST}>
                  <TabsTrigger value="continuous" className={NAV_ITEM}>
                    Continuous
                  </TabsTrigger>
                  <TabsTrigger value="discrete" className={NAV_ITEM}>
                    Discrete
                  </TabsTrigger>
                  <TabsTrigger value="about" className={NAV_ITEM}>
                    About
                  </TabsTrigger>
                </TabsList>
                <ModeToggle />
              </div>
            </div>
          </header>

          <TabsContent value="continuous" className="mt-0">
            <ContinuousTab
              requestedExample={requestedExample}
              onPickExample={handlePickExample}
            />
          </TabsContent>
          <TabsContent value="discrete" className="mt-0">
            <DiscreteTab requestedExample={requestedExample} onPickExample={handlePickExample} />
          </TabsContent>
          <TabsContent value="about" className="mt-0">
            <AboutTab />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 flex flex-col items-center gap-1 border-t pt-6 text-xs text-muted-foreground sm:flex-row sm:justify-between sm:gap-0">
          <span>See the curve, understand the concept.</span>
          <span>
            {APP_TITLE} · © {COPYRIGHT_YEAR}
          </span>
        </footer>
      </div>
    </div>
  );
}
