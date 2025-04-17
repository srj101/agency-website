import React from "react"
import { cn } from "@/lib/utils"

interface StepsProps {
  currentStep: number
  children: React.ReactNode
  className?: string
}

interface StepProps {
  title: string
  description?: string
}

export function Steps({ currentStep, children, className }: StepsProps) {
  const steps = React.Children.toArray(children)

  return (
    <div className={cn("space-y-4", className)}>
      {steps.map((step, index) => {
        const isActive = currentStep === index
        const isCompleted = currentStep > index

        if (React.isValidElement<StepProps>(step)) {
          return React.cloneElement(step, {
            ...step.props,
            isActive,
            isCompleted,
            stepNumber: index,
          })
        }

        return step
      })}
    </div>
  )
}

export function Step({
  title,
  description,
  isActive,
  isCompleted,
  stepNumber,
}: StepProps & {
  isActive?: boolean
  isCompleted?: boolean
  stepNumber?: number
}) {
  return (
    <div className="flex items-start gap-4">
      <div className="relative flex h-8 w-8 shrink-0 items-center justify-center">
        <div
          className={cn(
            "h-8 w-8 rounded-full border-2 flex items-center justify-center text-sm font-medium",
            isActive && "border-primary bg-primary text-primary-foreground",
            isCompleted && "border-primary bg-primary text-primary-foreground",
            !isActive && !isCompleted && "border-muted-foreground text-muted-foreground",
          )}
        >
          {isCompleted ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <polyline points="20 6 9 17 4 12"></polyline>
            </svg>
          ) : stepNumber !== undefined ? (
            stepNumber + 1
          ) : null}
        </div>
        {stepNumber !== undefined && stepNumber < React.Children.count(React.Children.toArray(null)) - 1 && (
          <div className="absolute left-1/2 top-8 h-full w-px -translate-x-1/2 bg-muted-foreground/30" />
        )}
      </div>
      <div className="space-y-1">
        <h3
          className={cn(
            "text-base font-medium",
            isActive && "text-foreground",
            isCompleted && "text-foreground",
            !isActive && !isCompleted && "text-muted-foreground",
          )}
        >
          {title}
        </h3>
        {description && <p className="text-sm text-muted-foreground">{description}</p>}
      </div>
    </div>
  )
}
