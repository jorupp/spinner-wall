import * as React from 'react';
import * as d3 from 'd3';

interface D3WallDisplayProps {
    height: number;
    width: number;
    maxRotationValue: number;
    data: number[];
    withColor?: boolean;
}

const spinnerRatio = 0.2;

const D3WallDisplay: React.FunctionComponent<D3WallDisplayProps> = (props) => {
    const ref = React.useRef<SVGSVGElement>(null);
    const lastValues = React.useRef<number[]>([]);
    const svgHeight = window.innerHeight - 10;
    const svgWidth = window.innerWidth;
    const gap = 5;
    let yEdgeGap = 10;
    let xEdgeGap = 10;
    const yPart = (svgHeight - yEdgeGap * 2 + gap) / props.height;
    const xPart = (svgWidth - xEdgeGap * 2 + gap) / props.width;
    if (yPart > xPart) {
        yEdgeGap += (yPart - xPart) * props.height / 2;
    }
    else if (xPart > yPart) {
        xEdgeGap += (xPart - yPart) * props.width / 2;
    }
    const yRange = d3.scaleLinear().domain([0, props.height]).range([ yEdgeGap - gap/2, svgHeight - yEdgeGap + gap/2 ]);
    const cellHeight = yRange(1)-yRange(0) - gap;
    const xRange = d3.scaleLinear().domain([0, props.width]).range([ xEdgeGap - gap/2, svgWidth - xEdgeGap + gap/2 ]);
    const cellWidth = xRange(1)-xRange(0) - gap;
    const cellSize = Math.min(cellHeight, cellWidth);

    React.useEffect(() => {
        if (!ref.current) {
            return;
        }

        const svg = d3.select(ref.current);
        const root = svg.selectAll('g.root')
            .data([0])
            .join(enter => enter.append('g').attr('class', 'root'));

        const cells = root.selectAll('g.cell')
            .data(props.data)
            .join(enter => enter.append('g').attr('class', 'cell'))
            .attr('transform', (d, ix) => {
                const x = ix % props.width;
                const y = Math.floor(ix / props.width);
                const tx = xRange(x + 0.5);
                const ty = yRange(y + 0.5);
                return `translate(${tx},${ty})`;
            });
        // cells.selectAll('rect.border')
        //     .data([0])
        //     .join(enter => enter.append('rect').attr('class', 'border'))
        //     .attr('x', -cellSize/2)
        //     .attr('y', -cellSize/2)
        //     .attr('width', cellSize)
        //     .attr('height', cellSize)
        //     .attr('style', 'stroke-width: 3; stroke: black; fill: none;');
        
        if(props.withColor) {
            const arc = d3.arc().innerRadius(0).outerRadius(cellSize/2).startAngle(0);
            const arcTween = function(this: any, d: number) {
                const interpolate = d3.interpolate(this._current as number, d);
                this._current = d;
                return function(t: number) {
                    return arc({ endAngle: interpolate(t) } as any) as string;
                }
            }
            cells.selectAll('path.color')
                .data(d => [d / props.maxRotationValue * Math.PI * 2])
                .join(enter => enter.append('path').attr('class', 'color'))
                .attr('style', 'fill: red;')
                .transition()
                .duration(100)
                .attrTween('d', arcTween)
            ;
        } else {
            cells.selectAll('path.color').remove();
        }

        const bars = cells.selectAll('rect.spinner')
            .data(d => [d])
            .join(enter => enter.append('rect').attr('class', 'spinner'))
            .attr('x', -cellSize/2)
            .attr('width', cellSize)
            .attr('y', -cellSize*spinnerRatio/2)
            .attr('height', cellSize*spinnerRatio)
            .attr('style', 'fill: white')
            .transition().duration(150)
        ;
        if(props.withColor) {
            const rotateTween = function(this: any, d: number) {
                // console.log({ t: this });
                return d3.interpolateString(d3.select(this).attr('transform'), `rotate(${d / props.maxRotationValue * 360 + 90})`);
            }
            bars.attrTween('transform', rotateTween);
        } else {
            bars.attr('transform', d => `rotate(${d / props.maxRotationValue * 360 + 90})`);
        }
    });
    return <svg className="d3-wall-display" ref={ref} height={svgHeight} width={svgWidth}/>;
};

export default D3WallDisplay;
