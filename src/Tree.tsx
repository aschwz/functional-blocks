import * as d3 from 'd3'

export interface Node {
  name: string
  dummy?: true
  children?: Node[]
}

export default function Tree({
  data,
  width,
  height,
  margin = 50,
}: {
  data: Node[]
  width: number
  height: number
  margin: number
}) {
  const root = d3.hierarchy<Node>({ name: '', dummy: true, children: data })
  const treeLayout = d3
    .tree<Node>()
    .size([width - margin * 2, height - margin * 2])
  treeLayout(root)

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin},${margin})`}>
        {/* Draw links */}
        {root
          .links()
          .filter(
            ({ source, target }) => !source.data.dummy && !target.data.dummy
          )
          .map((link, i) => (
            <path
              key={i}
              d={
                d3.linkVertical()({
                  source: [link.source.x!, link.source.y!],
                  target: [link.target.x!, link.target.y!],
                }) as never
              }
              fill="none"
              stroke="gray"
            />
          ))}

        {/* Draw nodes */}
        {root
          .descendants()
          .filter((node) => !node.data.dummy)
          .map((node, i) => {
            const textLength = node.data.name.length;
            const padding = 8; // Horizontal padding
            const fontSize = Math.min(14, 14 - textLength * 0.2);
            const textWidth = textLength * fontSize * 0.6; // Approximate text width
            const rectWidth = textWidth + padding * 2;
            const rectHeight = fontSize * 2; // Height based on font size
            
            return (
              <g key={i} transform={`translate(${node.x},${node.y})`}>
                <rect
                  x={-rectWidth/2}
                  y={-rectHeight/2}
                  width={rectWidth}
                  height={rectHeight}
                  rx="5"  // Rounded corner radius
                  fill="white"
                  stroke="black"
                  strokeWidth={1.5}
                />
                <text
                  textAnchor="middle"
                  alignmentBaseline="central"
                  fontSize={fontSize}
                >
                  {node.data.name}
                </text>
              </g>
            );
          })}
      </g>
    </svg>
  )
}
