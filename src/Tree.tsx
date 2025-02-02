import * as d3 from 'd3'

export interface Node {
  name: string
  dummy?: true
  children?: Node[]
  width?: number
  height?: number
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
  
  // Calculate node dimensions for each node
  root.each(node => {
    if (!node.data.dummy) {
      const textLength = node.data.name.length;
      const fontSize = Math.min(14, 14 - textLength * 0.2);
      const padding = 8;
      const textWidth = textLength * fontSize * 0.6;
      node.data.width = textWidth + padding * 2;
      node.data.height = fontSize * 2;
    }
  });

  // Adjust tree layout with custom node separation
  const treeLayout = d3
    .tree<Node>()
    .size([width - margin * 2, height - margin * 2])
    .separation((a, b) => {
      // Increase separation between nodes based on their widths
      const baseDistance = 1.2; // Minimum separation
      if (!a.data.dummy && !b.data.dummy) {
        const aWidth = a.data.width ?? 0;
        const bWidth = b.data.width ?? 0;
        return (aWidth + bWidth) / 2 * baseDistance / 50;
      }
      return baseDistance;
    });

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
