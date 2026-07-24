import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ModeToggle } from "@/components/mode-toggle";
import { ContinuousTab } from "@/components/tabs/ContinuousTab";
import { DiscreteTab } from "@/components/tabs/DiscreteTab";
import { AboutTab } from "@/components/tabs/AboutTab";

export default function App() {
  return (
    <div className="min-h-screen bg-background">
      <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        {/* Header */}
        <header className="relative mb-8 text-center">
          <div className="absolute right-0 top-0">
            <ModeToggle />
          </div>
          <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">
            Statistics &amp; Probability Visualizer
          </h1>
          <p className="mt-2 text-sm italic text-muted-foreground">
            "See the curve, understand the concept."
          </p>
        </header>

        {/* Tabs */}
        <Tabs defaultValue="continuous" className="w-full">
          <div className="mb-6 flex justify-center">
            <TabsList>
              <TabsTrigger value="continuous">Continuous</TabsTrigger>
              <TabsTrigger value="discrete">Discrete</TabsTrigger>
              <TabsTrigger value="about">About</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="continuous">
            <ContinuousTab />
          </TabsContent>
          <TabsContent value="discrete">
            <DiscreteTab />
          </TabsContent>
          <TabsContent value="about">
            <AboutTab />
          </TabsContent>
        </Tabs>

        {/* Footer */}
        <footer className="mt-12 border-t pt-6 text-center text-xs text-muted-foreground">
          Made for students · Suriyati Ujang © 2025
        </footer>
      </div>
    </div>
  );
}
