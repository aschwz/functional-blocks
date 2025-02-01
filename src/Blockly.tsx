import { useEffect } from 'react'

export default function Blockly() {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    import('./index.js')
    // @ts-check
  }, [])
  return (
    <div id="pageContainer">
      <div id="outputPane">
        <pre id="generatedCode">
          <code></code>
        </pre>
        <div id="output"></div>
      </div>
      <div id="blocklyDiv"></div>
    </div>
  )
}
