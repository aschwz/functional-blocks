import * as d3 from 'd3'

interface Node {
  name: string
  children?: Node[]
}

export default function Tree<Datum extends Node>({
  data,
  width,
  height,
  margin = 50,
}: {
  data: Datum
  width: number
  height: number
  margin: number
}) {
  const root = d3.hierarchy(data)
  const treeLayout = d3
    .tree<Datum>()
    .size([width - margin * 2, height - margin * 2])
  treeLayout(root)

  return (
    <svg width={width} height={height}>
      <g transform={`translate(${margin},${margin})`}>
        {/* Draw links */}
        {root.links().map((link, i) => (
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
        {root.descendants().map((node, i) => (
          <g key={i} transform={`translate(${node.x},${node.y})`}>
            <circle r={10} fill="white" stroke="black" />
            <text
              textAnchor="middle"
              alignment-baseline="central"
            >
              {node.data.name}
            </text>
          </g>
        ))}
      </g>
    </svg>
  )
}
