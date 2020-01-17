import * as React from 'react';
import WallDisplay from './wallDisplay';
import * as _ from 'lodash';

interface WallProps {
}


const Wall: React.FunctionComponent<WallProps> = (props) => {
    const [data, setData] = React.useState(_.range(0, 12).map(i => _.range(0, 24).map(ii => (i + ii) % 12)));
    const onClick = React.useCallback(() => {
        if (Math.random() < 0.5) {
            const offset = Math.floor(Math.random() * 12);
            setData(_.range(0, 12).map(i => _.range(0, 24).map(ii => (offset + i + ii) % 12)));
        } else {
            setData(_.range(0, 12).map(i => _.range(0, 24).map(ii => Math.floor(Math.random() * 12))));
        }
    }, [ setData ]);

    return (
        <div onClick={onClick}>
            <WallDisplay height={data.length} width={data[0].length} maxRotationValue={12} data={data} />;
        </div>
    );
    // return (
    //     <></>
    // );
};

export default Wall;
