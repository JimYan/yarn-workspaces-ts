// Import here Polyfills if needed. Recommended core-js (npm i -D core-js)
// import "core-js/fn/array.find"
// ...
import a, { a as av } from '@quramy/x-a'

console.log(a(10))
console.log(av())

const b = () => {
  return 'thisisb'
}

export { b }
