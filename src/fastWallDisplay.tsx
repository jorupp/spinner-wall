import * as React from 'react';
import * as _ from 'lodash';

import './wallDisplay.scss';
import { getClosestRotationValue } from './utils';

interface FastWallDisplayProps {
    height: number;
    width: number;
    maxRotationValue: number;
    data: number[][];
}

const FastWallDisplay: React.FunctionComponent<FastWallDisplayProps> = (props) => {
    const ref = React.useRef<HTMLDivElement>(null);
    const lastValues = React.useRef<number[]>([]);
    React.useEffect(() => {
        const div = ref.current;
        if (!div) {
            return;
        }

        div.style.columnCount = '' + props.width;
        if(div.children.length !== props.height * props.width) {
            lastValues.current = _.range(0, props.height * props.width).map(i => 0);
            const r = document.createRange();
            r.selectNodeContents(div);
            r.deleteContents();

            for(let y = 0; y < props.height; y++) {
                for(let x = 0; x < props.width; x++) {
                    const c = document.createElement('div');
                    c.className = 'cell';
                    c.style.gridRow = '' + (y + 1);
                    c.style.gridColumn = '' + (x + 1);

                    const s = document.createElement('div');
                    s.className = 'spinner';
                    c.appendChild(s);

                    div.appendChild(c);
                }
            }
        }

        for(let y = 0; y < props.height; y++) {
            for(let x = 0; x < props.width; x++) {
                const i = y * props.width + x;
                const s = div.children.item(i)?.firstChild as HTMLDivElement;
                const r = getClosestRotationValue(props.data[y][x] / props.maxRotationValue * 360, lastValues.current[i], 180);
                lastValues.current[i] = r;
                s.style.transform = 'rotate(' + r + 'deg)';
            }
        }


    });
    return <div className="wall-display" ref={ref}/>;
    // return (
    //     <div className="wall-display" style={ { columnCount: props.width }}>
    //         {_.range(0, props.height).map(y => {
    //             return _.range(0, props.width).map(x => {
    //                 return <Cell key={`${y}_${x}`} style={ { gridColumn: x + 1, gridRow: y + 1 }} maxValue={props.maxRotationValue} value={props.data[y][x]}/>;
    //             })
    //         })}
    //     </div>
    // )
};

export default FastWallDisplay;
