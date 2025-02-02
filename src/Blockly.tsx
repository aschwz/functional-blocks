import { useEffect, useRef, useState } from 'react'
import { Slider } from 'antd'
import { compile, doTimeTravel, run, setup } from './index'
import Tree, {Node} from './Tree'
import { prevStates, psPtr, renderState, setPsPtr } from './generators/fir'
import OpenAI from 'openai'
import { ChatCompletionSystemMessageParam, ChatCompletionUserMessageParam } from 'openai/resources/chat'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_KEY,
  dangerouslyAllowBrowser: true
});

export default function Blockly() {
  const [numSteps, setNumSteps] = useState<number>(0)
  const [currStep, setCurrStep] = useState<number>(0)
  const [currGraph, setCurrGraph] = useState<Node[]>([])
  const [messages, setMessages] = useState<Array<{role: string, content: string}>>([])
  const [currentQuestion, setCurrentQuestion] = useState('')

  const blocklyDivRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (blocklyDivRef.current) setup(blocklyDivRef.current!)
    // setNumSteps(20)
  }, [blocklyDivRef])

  const handleCompile = () => {
    console.log('Compile clicked');
    compile()
    console.log("CRS", renderState())
        setNumSteps(0)
        setStep(0)
    setCurrGraph(renderState())
  };

  const handleRun = () => {
    console.log('Run clicked');
    run()
    console.log("PPTR", prevStates.length, psPtr)
        setNumSteps(prevStates.length - 1)
        setCurrStep(psPtr)
        var rs = renderState()
        console.log("RS", rs)
        setCurrGraph(renderState())
        console.log("currg", currGraph)
  };

  const timeTravel = (n: number) => {
        console.log("travelling")
        setCurrStep(n)
        doTimeTravel(n)
    }

  const setStep = (n: number) => {
    setCurrStep(n)
    setPsPtr(n)
    setCurrGraph(renderState())
  }

  return (
    <div id="pageContainer">
      <div id="outputPane">
        <Tree
          data={currGraph}
          width={300}
          height={500}
          margin={10}
        />
        <Slider min={0} max={numSteps} dots onChange={setStep} value={currStep}/>
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

      <div style={{
        position: 'fixed',
        bottom: '20px',
        left: '20px',
        width: '300px',
        backgroundColor: 'white',
        borderRadius: '8px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        zIndex: 1000,
        padding: '12px'
      }}>
        <div style={{
          height: '150px',
          overflowY: 'auto',
          marginBottom: '10px',
          border: '1px solid #eee',
          padding: '8px'
        }}>
          {messages.map((msg, i) => (
            <div key={i} style={{ 
              margin: '4px 0',
              padding: '6px',
              backgroundColor: msg.role === 'user' ? '#f0faff' : '#f5f5f5',
              borderRadius: '4px'
            }}>
              <strong>{msg.role}:</strong> {msg.content}
            </div>
          ))}
        </div>
        
        <form onSubmit={async (e) => {
          e.preventDefault();
          if (!currentQuestion.trim()) return;
          
          const userMessage = { role: 'user', content: currentQuestion };
          setMessages(prev => [...prev, userMessage]);
          setCurrentQuestion('');

          try {
            const completion = await openai.chat.completions.create({
              model: "gpt-4-turbo",
              messages: [{
                role: "system",
                content: "You help explain Blockly blocks and tree structures for functional programming. Keep answers under 3 sentences."
              } as ChatCompletionSystemMessageParam, 
              {
                role: "user",
                content: currentQuestion
              } as ChatCompletionUserMessageParam]
            });

            const aiResponse = completion.choices[0].message.content;
            setMessages(prev => [...prev, { 
              role: 'assistant', 
              content: aiResponse || "Could not generate response"
            }]);
          } catch (error) {
            console.error('API Error:', error);
            setMessages(prev => [...prev, {
              role: 'assistant',
              content: "Error connecting to AI service"
            }]);
          }
        }}>
          <input
            type="text"
            value={currentQuestion}
            onChange={(e) => setCurrentQuestion(e.target.value)}
            placeholder="Ask about blocks or trees..."
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              marginBottom: '8px'
            }}
          />
          <button
            type="submit"
            style={{
              width: '100%',
              padding: '8px',
              backgroundColor: '#4CAF50',
              color: 'white',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer'
            }}
          >
            Ask ChatGPT
          </button>
        </form>
      </div>
    </div>
  )
}
