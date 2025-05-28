import { CheckIcon } from "lucide-react"
import { ReactNode } from "react"

interface StepIndicatorProps {
  steps: string[]
  currentStep: number
  stepIcons?: Record<string, ReactNode>
}

export default function StepIndicator({ steps, currentStep, stepIcons }: StepIndicatorProps) {
  return (
    <div className="py-4 overflow-x-auto">
      <div className="flex flex-wrap md:flex-nowrap items-center justify-start md:justify-center w-full min-w-max px-2">
        {steps.map((step, index) => {
          const isCompleted = index < currentStep
          const isActive = index === currentStep
          const isFuture = index > currentStep

          return (
            <div key={index} className="flex items-center mb-2 md:mb-0">
              <div className="flex items-center">
                {/* Circle with number */}
                <div
                  className={`w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center text-white z-10 ${
                    isCompleted ? "bg-green-400" : isActive ? "bg-zinc-800" : "bg-gray-300"
                  }`}
                >
                  {isCompleted ? <CheckIcon className="h-4 w-4 md:h-5 md:w-5" /> : <span>{index + 1}</span>}
                </div>
                
                {/* Step title next to the circle with icon */}
                <span
                  className={`ml-2 text-xs md:text-sm font-medium flex items-center ${
                    isActive ? "text-zinc-800" : isCompleted ? "text-green-700" : "text-gray-400"
                  }`}
                >
                  {stepIcons && stepIcons[step]}
                  <span className="hidden sm:inline">{step}</span>
                </span>
              </div>

              {/* Connecting line */}
              {index < steps.length - 1 && (
                <div 
                  className={`h-[2px] w-8 md:w-16 mx-1 md:mx-2 ${isCompleted ? "bg-green-700" : "bg-gray-300"}`}
                />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}
