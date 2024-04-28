function sum(...args) {
  return args.slice().reduce((prev, cur) => prev + cur, 0);
}

export default sum;
