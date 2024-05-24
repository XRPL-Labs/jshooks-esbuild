# ESBuild JS/TS bundler for Hooks 

[![Build qjsc.wasm Builder image and WASM Binary using Docker](https://github.com/XRPL-Labs/jshooks-esbuild/actions/workflows/build.yml/badge.svg)](https://github.com/XRPL-Labs/jshooks-esbuild/actions/workflows/build.yml)

### ESBuild JS/TS bundler for On chain Rule Engine (Smart Contracts)

##### This project depends on:

- [evanw/esbuild](https://github.com/evanw/esbuild)

# Build

You can conveniently build using Docker.

To build the container image for the build process:

```bash
docker build --tag esbuild-wasi .
```

## Build `esbuild` to WASI-compatible .wasm

To build the `esbuild.wasm` JS bundler to the local `build` folder:

```bash
docker run --rm -v $(pwd)/build:/build esbuild-wasi
```

# Run (use) - CLI

To run the `.wasm`, we're using `wasmtime`: we need a virtual filesystem, stdin, stdout, etc. and
`wasmtime` happily provides this context:

```bash
docker run --rm -v $(pwd)/build:/build \
    esbuild-wasi wasmtime /build/esbuild.wasm --help
```

### To use esbuild to bundle sample TypeScript to Javascript

Say you have a local folder `./sample` and you want to bundle
the `index.ts` TypeScript to `index.js` in the same folder:

```bash
docker run --rm -v $(pwd)/build:/esbuild \
    -v $(pwd)/sample:/sample \
    esbuild-wasi sh -c 'wasmtime run --dir=/sample::/ esbuild.wasm index.ts --platform=browser > /sample/index.js'
```

The example above shows we map the local `./build` folder with the compiled `esbuild.wasm` to the workdir, so we don't
have to specifcy the direcotry of the executable for `wasmtime` (as we're already in the right folder).

The `--dir=/sample::/` tells `wasmtime` to map `/sample` (seen from within the container) to the root `/` virtual filesysstem
in the WebAssembly runtime environment, so we don't have to provide the folder `index.ts` is in to `esbuild.wasm` (as to `esbuild`)
it is in root, its default workdir.

For the result, check:

```bash
diff sample/index.ts sample/index.js

```

# Run - Browser

To use the above `.wasm` file in your browser, create Javascript code like below, and save it as `esbuild.mjs`.
You can build this `.mjs` file for the browser with `esbuild` (inception):

```bash
cd ./browser && npm install # Needs npm install to fetch buffer browser polyfill & wasi runtime to be bundled along
docker run --rm -it \
    -v $(pwd)/../build/esbuild.wasm:/esbuild.wasm \
    -v $(pwd):/esbuild \
    esbuild-wasi sh -c 'wasmtime run --dir=.::/ /esbuild.wasm esbuild.mjs --bundle --format=esm --platform=browser --minify > esbuild-bundle.js'
```

Now you have a `esbuild-browser.js` file to use in the browser, which you can include as modules:

```html
<script type="module" src="./esbuild-browser.js"></script>
```

There's a ready to use sample `index.html` in the `browser` folder, which points to the `build/esbuild.wasm` to be served. To easily serve the entire thing (just to test), run:

```bash
npm run demo
```

... and point your browser to:
- http://localhost:3000/browser/

### Test @ `https://runno.dev/wasi`

Upload `qjsc.wasm` and create a `.js` file @ the virtual filesystem, e.g. `sample.js`, and then use argument:

```bash
-c -o sample.bc sample.js
```
