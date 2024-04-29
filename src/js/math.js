export default function sum(...args) {
    return args.reduce((prev, cur) => prev + cur, 0)
}
