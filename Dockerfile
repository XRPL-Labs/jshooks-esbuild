FROM golang

WORKDIR /esbuild

RUN cd /esbuild && git clone https://github.com/evanw/esbuild.git .

RUN apt -y update && apt -y install xz-utils && curl https://wasmtime.dev/install.sh -sSf | bash && rm -rf /var/lib/apt/lists/*

ENV CGO_ENABLED=0 GOOS="wasip1" GOARCH="wasm" PATH=$PATH:/root/.wasmtime/bin/

CMD go build "-ldflags=-s -w" -trimpath -o "/build/esbuild.wasm" ./cmd/esbuild/
