PROJECT=idris2-doc-index

all: build

build: 
	idris2 --build --find-ipkg

clean:
	idris2 --clean --find-ipkg
	rm -rf ./build/

run: build
	./build/exec/doc-index

.PHONY: all build clean run

