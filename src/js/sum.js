function sum(...args) {
  console.log('112')
  return args.slice().reduce((prev, cur) => prev + cur, 0);
}

export default sum;
