PROJECT=idris2-vscode

all: build

build: 
	idris2 --codegen node --build idris2-vscode.ipkg
	npm run compile
	cat ./src/_exports.js >> ./build/exec/extension.js

clean:
	idris2 --clean idris2-vscode.ipkg
	rm -rf ./build/

run: build
	node ./build/exec/extension.js

bundle: clean build
	npm run bundle
	make run -C doc-index
	npx vsce package --out ./build/

.PHONY: all build clean run bundle
