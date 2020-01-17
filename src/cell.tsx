import * as React from 'react';
import classNames from 'classnames';

interface CellProps {
    value: number;
    maxValue: number;
    style: React.CSSProperties;
}

const Cell: React.FunctionComponent<CellProps> = (props) => {
    const { value, maxValue, style } = props;
    const lastValueHolder = React.useRef(value);
    // const rot = Math.floor((value / maxValue) * 12);
    let realValue = (value / maxValue) * 360;
    while (Math.abs(realValue - lastValueHolder.current) > 180) {
        realValue += (realValue < lastValueHolder.current) ? 180 : -180;
    }
    if (Math.abs(realValue + 180 - lastValueHolder.current) < Math.abs(realValue - lastValueHolder.current)) {
        realValue += 180;
    }
    if (Math.abs(realValue - 180 - lastValueHolder.current) < Math.abs(realValue - lastValueHolder.current)) {
        realValue -= 180;
    }

    lastValueHolder.current = realValue;

    const transform = 'rotate(' + realValue + 'deg)';
    // console.log(transform);
    return (
        <div className="cell" style={style}>
            {/* <div className={classNames('spinner', `spinner-${rot}`)}/>  */}
            <div className="spinner" style={ { transform: transform }}/>
        </div>
    );
};
export default Cell;
