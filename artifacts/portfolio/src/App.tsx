"use client";

import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import Home from "@/components/Home";

function App() {
  return (
    <TooltipProvider>
      <Home />
      <Toaster />
    </TooltipProvider>
  );
}

export default App;