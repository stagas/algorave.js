dev-build:
	@./node_modules/.bin/watchify \
		--transform [ babelify --presets [ latest ] ] \
		--plugin [ css-modulesify -o dist/algorave.css ] \
		--verbose \
		--detect-globals=false \
		--standalone algorave \
		--node \
		--debug \
		--entry algorave.js \
		--outfile dist/algorave.js

.PHONY: dev-build
