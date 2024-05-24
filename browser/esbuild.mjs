import { WASI } from "@runno/wasi"

const result = WASI.start(fetch('../build/esbuild.wasm'), {
  // env: { SOME_KEY: "some value" },
  args: ['esbuild', 'file.ts', '--bundle', '--minify', '--platform=browser', '--format=esm', '--target=es2017'],
  stdout: out => {
    document.write(`<pre>Check your browser console...\n\nMJS with rependency (import) to JS:\n${out}</pre>`)
    console.log('Executing the locally compiled Typescript:')
    ;(new Function(out))()
    console.log('^^ This is it :D')
  },
  stderr: err => console.log("stderr:" + err),
  stdin: () => undefined,
  fs: {
    "/file.ts": {
      path: "/file.ts",
      timestamps: { access: new Date(), change: new Date(), modification: new Date(), },
      mode: "string",
      content: (`
        // Some TS content...
        const v: string = 'If you see this, a virtual TypeScript file (see browser/esbuild.mjs) got bundled to Javascript using esbuild here in your browser!'
        console.log(v)
      `),
    },
  },
})

result.then(r => console.log('Done.'))  
