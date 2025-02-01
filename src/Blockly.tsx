import { useEffect, useState } from 'react'
import { Slider } from 'antd'

export default function Blockly() {
  const [numSteps, setNumSteps] = useState<number>(0)
  const [currStep, setCurrStep] = useState<number>(0)

  useEffect(() => {
    import('./index')
    setNumSteps(20)
  }, [])

  return (
    <div id="pageContainer">
      <div id="outputPane">
        <pre id="generatedCode">
          <code></code>
          {currStep}
        </pre>
        <div id="output"></div>
        <Slider min={0} max={numSteps} dots onChange={setCurrStep} />
      </div>
      <div id="blocklyDiv"></div>
    </div>
  )
}
