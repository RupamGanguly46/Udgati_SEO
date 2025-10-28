import { AIOptimizationModule } from "@/components/modules/ai-optimization-module"

export default function AIOptimizePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary/5 via-background to-accent/5">
      <div className="flex">
        <div className="w-64"></div> {/* Sidebar spacer */}
        <div className="flex-1 p-6">
          <AIOptimizationModule />
        </div>
      </div>
    </div>
  )
}
