import * as React from 'react';
import classNames from 'classnames';

interface CellProps {
    value: number;
    maxValue: number;
    style: React.CSSProperties;
}

const Cell: React.FunctionComponent<CellProps> = (props) => {
    const { value, maxValue, style } = props;
    const rot = Math.floor((value / maxValue) * 12);
    const transform = 'rotate(' + ((value / maxValue) * 360) + 'deg)';
    console.log(transform);
    return (
        <div className="cell" style={style}>
            {/* <div className={classNames('spinner', `spinner-${rot}`)}/>  */}
            <div className="spinner" style={ { transform: transform }}/>
        </div>
    );
};
export default Cell;
