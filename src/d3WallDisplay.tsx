import * as React from 'react';
import * as d3 from 'd3';

interface D3WallDisplayProps {
    height: number;
    width: number;
    maxRotationValue: number;
    data: number[];
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

        const rotateTween = function(this: any, d: number) {
            // console.log({ t: this });
            return d3.interpolateString(d3.select(this).attr('transform'), `rotate(${d / props.maxRotationValue * 360 + 90})`);
        }
        cells.selectAll('rect.spinner')
            .data(d => [d])
            .join(enter => enter.append('rect').attr('class', 'spinner'))
            .attr('x', -cellSize/2)
            .attr('width', cellSize)
            .attr('y', -cellSize*spinnerRatio/2)
            .attr('height', cellSize*spinnerRatio)
            .attr('style', 'fill: black')
            .transition().duration(150)
            // .ease(d3.easeBounceOut)
            .attrTween('transform', rotateTween)
            // .attr('transform', d => `rotate(${d / props.maxRotationValue * 360 + 90})`)
        ;

        // div.style.columnCount = '' + props.width;
        // if(div.children.length !== props.height * props.width) {
        //     lastValues.current = _.range(0, props.height * props.width).map(i => 0);
        //     const r = document.createRange();
        //     r.selectNodeContents(div);
        //     r.deleteContents();

        //     for(let y = 0; y < props.height; y++) {
        //         for(let x = 0; x < props.width; x++) {
        //             const c = document.createElement('div');
        //             c.className = 'cell';
        //             c.style.gridRow = '' + (y + 1);
        //             c.style.gridColumn = '' + (x + 1);

        //             const s = document.createElement('div');
        //             s.className = 'spinner';
        //             c.appendChild(s);

        //             div.appendChild(c);
        //         }
        //     }
        // }

        // for(let y = 0; y < props.height; y++) {
        //     for(let x = 0; x < props.width; x++) {
        //         const i = y * props.width + x;
        //         const s = div.children.item(i)?.firstChild as HTMLDivElement;
        //         const r = getClosestRotationValue(props.data[y][x] / props.maxRotationValue * 360, lastValues.current[i], 180);
        //         lastValues.current[i] = r;
        //         s.style.transform = 'rotate(' + r + 'deg)';
        //     }
        // }


    });
    return <svg className="d3-wall-display" ref={ref} height={svgHeight} width={svgWidth}/>;
};

export default D3WallDisplay;
