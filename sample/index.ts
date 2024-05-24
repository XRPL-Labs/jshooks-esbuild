// Some useless stuff but TS syntax so we can demonstrate esbuild

const something: string = 'Hello world!'

const somefn = () => console.log(something as unknown as string)
