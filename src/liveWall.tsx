import * as React from 'react';
import * as _ from 'lodash';
import D3WallDisplay from './d3WallDisplay';
import * as gm from 'gammacv';

interface LiveWallProps {
}

const LiveWall: React.FunctionComponent<LiveWallProps> = (props) => {
    const height = 720;
    const width = 1280;

    const [ invert, setInvert ] = React.useState(false);
    const [ tempBarCount, setTempBarCount ] = React.useState(48);
    const [ barCount, setBarCount ] = React.useState(48);
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
        const hogArg = Math.floor(Math.max(height, width) / barCount);
        pipeline = gm.hog(pipeline, hogArg, 'max');
        // console.log('initializing hog with ' + hogArg);

        const output = gm.tensorFrom(pipeline);
        sess.init(pipeline);

        const callback = () => {
            // console.log('frame with hog with ' + hogArg);
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
    }, [ setData, barCount ]);
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
            <div style={ { position: 'fixed', color: invert ? 'black' : 'white', display: 'flex', flexDirection: 'column', width: '100px' }}>
                <button onClick={toggleCanvas}>{showCanvas ? 'Hide' : 'Show'} image</button>
                <span>FPS: {recentFrameTimes.current.length}</span>
                <label htmlFor="spinners">Approx spinners:</label>
                <input type="number" max={50} min={1} id="spinners" onChange={(e) => setTempBarCount(parseInt(e.target.value))} value={tempBarCount}/>
                <button onClick={() => setBarCount(tempBarCount)}>Update spinners</button>
                <span style={ { display: 'flex'} }>
                    <label htmlFor="invert">Invert:</label>
                    <input type="checkbox" checked={invert} onChange={e => setInvert(e.target.checked)} />
                </span>
            </div>
            <div style={ { background: invert ? 'white' : 'black', zIndex: -2, position: 'fixed', top: 0, left: 0, right: 0, bottom: 0 } }/>
            <canvas height={height} width={width} style={ { display: showCanvas ? 'block' : 'none', zIndex: -1, opacity: 0.5, position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)'} } ref={canvas}/>
            <D3WallDisplay height={y} width={x} maxRotationValue={90} data={values} invert={invert} />
        </div>
    );
};

export default LiveWall;
