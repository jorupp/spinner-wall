export const getClosestRotationValue = (newValue: number, oldValue: number, mod: number) => {
    const delta = (((oldValue - newValue) % mod) + (1.5 * mod)) % mod - (0.5 * mod);
    return oldValue - delta;
}

// const testIt = (n: number, o: number) => {
//     console.log({ n, o,  r: getClosestRotationValue(n,o,180) })
// }

// testIt(0, 180);
// testIt(0, 190);
// testIt(0, 360);
// testIt(0, 370);

// testIt(10, 180);
// testIt(10, 190);
// testIt(10, 360);
// testIt(10, 370);


