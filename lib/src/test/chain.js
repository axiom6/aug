
class MyObject {
  constructor() {
    this.innerString = '' } }

const func2 = () =>  {
  return new MyObject(); }

const func3 = () => {
  return this['innerString'].trim(); }



const wrapperFunc = (obj) => {

  // Start with func2()
  const func2Result = func2()

  // Chain to func1() for each entry in obj (the tricky part)
  const func1Result = Object.entries(obj).reduce(

    // Call func1 method on previous result to get the next result
    (prevResult, [ key, val ]) => prevResult['func1'](key, val),

    // Initial "prevResult" value used above
    func2Result
  )

  // Chain to func3()
  return func1Result['func3']()
}

// Inject object to be used for func1() calls
console.log(wrapperFunc({
  key1: 'value1',
  key2: 'value2'
}))