import { useEffect, useRef, useState } from 'react'
import { Slider } from 'antd'
import { compile, run, setup } from './index'
import Tree from './Tree'
export default function Blockly() {
  const [numSteps, setNumSteps] = useState<number>(0)
  const [currStep, setCurrStep] = useState<number>(0)

  const blocklyDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (blocklyDivRef.current) setup(blocklyDivRef.current!)
    setNumSteps(20)
  }, [blocklyDivRef])

  const handleCompile = () => {
    console.log('Compile clicked');
    compile()
  };

  const handleRun = () => {
    console.log('Run clicked');
    run()
  };

  return (
    <div id="pageContainer">
      <div id="outputPane">
        <Tree
          data={[
            {
              name: ':',
              children: [
                { name: '1' },
                {
                  name: ':',
                  children: [
                    { name: '2' },
                    { name: ':', children: [{ name: '4' }, { name: '5' }] },
                  ],
                },
              ],
            },
          ]}
          width={300}
          height={500}
          margin={10}
        />
        <Slider min={0} max={numSteps} dots onChange={setCurrStep} />
      </div>
      <div id="blocklyDiv" ref={blocklyDivRef}></div>
      
      {/* Action Buttons Container */}
      <div style={{
        position: 'fixed',
        bottom: '20px',
        right: '120px', // 120px from right edge
        display: 'flex',
        gap: '10px',
        zIndex: 1000
      }}>
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onClick={handleCompile}
        >
          Compile
        </button>
        <button
          style={{
            padding: '12px 24px',
            backgroundColor: '#4CAF50',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px', 
            boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
          }}
          onClick={handleRun}
        >
          Run
        </button>
      </div>
    </div>
  )
}
