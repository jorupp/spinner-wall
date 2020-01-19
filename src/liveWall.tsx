import * as React from 'react';
import * as _ from 'lodash';
import D3WallDisplay from './d3WallDisplay';
import * as gm from 'gammacv';

interface LiveWallProps {
}

const LiveWall: React.FunctionComponent<LiveWallProps> = (props) => {
    const height = 720;
    const width = 1280;

    const recentFrameTimes = React.useRef<Date[]>([]);
    const canvas = React.useRef<HTMLCanvasElement>(null);
    const [ data, setData ] = React.useState({ x: 0, y: 0, values: [] as number[] });
    const [ error, setError ] = React.useState<string | undefined>();
    const [ showCanvas, setShowCanvas ] = React.useState(false);
    const toggleCanvas = React.useCallback(() => {
        setShowCanvas(!showCanvas);
    }, [showCanvas, setShowCanvas ]);
    React.useEffect(() => {
        const sess = new gm.Session();
        const stream = new gm.CaptureVideo(width, height);
        stream.start().catch((e: string) => {
            console.log(e);
            setError(e.toString());
        });

        const input = new gm.Tensor('uint8', [height, width, 4]);
        let pipeline = input;
        pipeline = gm.grayscale(pipeline);
        pipeline = gm.hog(pipeline, Math.floor(Math.max(height, width) / 48), 'max');

        const output = gm.tensorFrom(pipeline);
        sess.init(pipeline);

        const callback = () => {
            // console.log('anim frame');
            stream.getImageBuffer(input);
            sess.runOp(pipeline, {}, output);

            // console.log(output);

            const y = output.shape[0];
            const x = output.shape[1];
            setData({ x, y, values: _.range(0, y).flatMap(i => _.range(0, x).map(ii => output.get(i, ii, 1) as number)) });
            if (canvas.current) {
                gm.canvasFromTensor(canvas.current, input);
            }
            // setData({ x, y, values: [] });
            // console.log(output);
            // console.log(_.take(output.values, 100));
            // window.cancelAnimationFrame(timeout);
            // return;

            const now = new Date();
            recentFrameTimes.current.push(now);
            recentFrameTimes.current = recentFrameTimes.current.filter(i => now.getTime() < i.getTime() + 1000);

            timeout = window.requestAnimationFrame(callback);
        }

        let timeout = window.requestAnimationFrame(callback);
        return () => {
            window.cancelAnimationFrame(timeout);
        };
    }, [ setData ]);
    if (error) {
        return <div>Error: {error}</div>
    }
    // console.log(data);
    const { x, y, values } = data;
    if (x <= 0 || y <= 0) {
        return <div>Enabling camera...</div>
    }
    // console.log({ max: _.max(values), min: _.min(values)});
    // return <div>Dummy</div>;
    return (
        <div>
            <div style={ { position: 'fixed' }}>
                <button onClick={toggleCanvas}>{showCanvas ? 'Hide' : 'Show'} image</button><br/>
                <span>FPS: {recentFrameTimes.current.length}</span>
            </div>
            <canvas height={height} width={width} style={ { display: showCanvas ? 'block' : 'none', zIndex: -1, opacity: 0.3, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'} } ref={canvas}/>
            <D3WallDisplay height={y} width={x} maxRotationValue={90} data={values} />
        </div>
    );
};

export default LiveWall;
