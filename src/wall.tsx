import * as React from 'react';
import WallDisplay from './wallDisplay';
import * as _ from 'lodash';
import FastWallDisplay from './fastWallDisplay';

interface WallProps {
}

const yR = 24;
const xR = 48;
const patterns = _.range(0,12).map(i => _.range(0, yR).map(y => _.range(0, xR).map(x => (i + x + y) % 12)));

const Wall: React.FunctionComponent<WallProps> = (props) => {
    const [ ix, incrementIx ] = React.useReducer((value) => (value + 1) % 12, 0);
    const data = patterns[ix];
    // React.useEffect(() => {
    //     const t = setInterval(incrementIx, 500);

    //     return () => { clearInterval(t); }
    // }, [incrementIx]);
    React.useEffect(() => {
        setTimeout(incrementIx, 200);
    }, [ix, incrementIx])

    const onClick = React.useCallback(() => {}, []);


    // const [data, setData] = React.useState(_.range(0, 12).map(i => _.range(0, 24).map(ii => (i + ii) % 12)));
    // const onClick = React.useCallback(() => {
    //     if (Math.random() < 0.5) {
    //         const offset = Math.floor(Math.random() * 12);
    //         setData(_.range(0, 12).map(i => _.range(0, 24).map(ii => (offset + i + ii) % 12)));
    //     } else {
    //         setData(_.range(0, 12).map(i => _.range(0, 24).map(ii => Math.floor(Math.random() * 12))));
    //     }
    // }, [ setData ]);

    return (
        <div onClick={onClick}>
            {/* <WallDisplay height={data.length} width={data[0].length} maxRotationValue={12} data={data} />; */}
            <FastWallDisplay height={data.length} width={data[0].length} maxRotationValue={12} data={data} />
        </div>
    );
    // return (
    //     <></>
    // );
};

export default Wall;
