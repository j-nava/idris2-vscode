PROJECT=idris2-vscode

.PHONY: all
all: build

.PHONY: build 
build: 
	idris2 --codegen node --build idris2-vscode.ipkg
	npm run compile
	cat ./src/_exports.js >> ./build/exec/extension-lib.js

.PHONY: clean
clean:
	idris2 --clean idris2-vscode.ipkg
	rm -rf ./build/

.PHONY: bundle
bundle: clean build
	npm run bundle
	npx vsce package --out ./build/

