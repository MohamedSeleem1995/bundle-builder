import { useState } from 'react'
import BuilderStep from './BuilderStep'
import { CATEGORIES } from '../context/cartReducer'

export default function BuilderPanel() {
  const [activeStep, setActiveStep] = useState('cameras')

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
      {CATEGORIES.map((category, i) => (
        <BuilderStep
          key={category}
          category={category}
          stepNumber={i + 1}
          totalSteps={CATEGORIES.length}
          isOpen={activeStep === category}
          onToggle={() => setActiveStep(activeStep === category ? null : category)}
          onNext={() => setActiveStep(CATEGORIES[i + 1])}
          isLastStep={i === CATEGORIES.length - 1}
        />
      ))}
    </div>
  )
}
