import * as React from 'react';
import * as _ from 'lodash';
import Cell from './cell';

import './wallDisplay.scss';

interface WallDisplayProps {
    height: number;
    width: number;
    maxRotationValue: number;
    data: number[][];
}

const WallDisplay: React.FunctionComponent<WallDisplayProps> = (props) => {
    return (
        <div className="wall-display" style={ { columnCount: props.width }}>
            {_.range(0, props.height).map(y => {
                return _.range(0, props.width).map(x => {
                    return <Cell key={`${y}_${x}`} style={ { gridColumn: x + 1, gridRow: y + 1 }} maxValue={props.maxRotationValue} value={props.data[y][x]}/>;
                })
            })}
        </div>
    )
};

export default WallDisplay;
