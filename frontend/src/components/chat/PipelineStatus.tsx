import { type PipelineStatus as PipelineStatusState } from '@/lib/citations'
import { CheckCircle2, Circle } from 'lucide-react'

type PipelineStatusProps = {
  isSubmitted: boolean
  pipelineStatus: PipelineStatusState | null
}

const PIPELINE_STEPS = [
  { stage: 'analyzing', label: 'Analyzing your question', order: 1 },
  { stage: 'searching', label: 'Searching SEC filings', order: 2 },
  { stage: 'reading', label: 'Reading documents', order: 3 },
  { stage: 'verifying', label: 'Verifying information', order: 4 },
  { stage: 'streaming', label: 'Generating response', order: 5 },
]

export function PipelineStatus({ pipelineStatus }: PipelineStatusProps) {
  const currentStage = pipelineStatus?.stage || 'analyzing'
  const currentStepIndex = PIPELINE_STEPS.findIndex((s) => s.stage === currentStage)

  return (
    <div className="w-full max-w-md mx-auto space-y-4 animate-slide-up" aria-live="polite">
      <div className="space-y-3">
        {PIPELINE_STEPS.map((step, index) => {
          const isCompleted = index < currentStepIndex
          const isCurrent = index === currentStepIndex

          return (
            <div key={step.stage} className="flex items-center gap-3">
              <div className="flex-shrink-0">
                {isCompleted ? (
                  <CheckCircle2 className="w-5 h-5 text-blue-600" />
                ) : isCurrent ? (
                  <div className="relative w-5 h-5">
                    <Circle className="w-5 h-5 text-blue-600 animate-pulse" />
                  </div>
                ) : (
                  <Circle className="w-5 h-5 text-gray-300" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <p
                  className={`text-sm font-medium truncate transition-colors ${
                    isCurrent
                      ? 'text-blue-600'
                      : isCompleted
                        ? 'text-gray-700'
                        : 'text-gray-400'
                  }`}
                >
                  {step.label}
                </p>
              </div>
            </div>
          )
        })}
      </div>
      <p className="text-xs text-gray-500 text-center italic">
        {pipelineStatus?.message || 'Processing your request…'}
      </p>
    </div>
  )
}
