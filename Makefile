default: build

build:
	./node_modules/closurecompiler/bin/ccjs tb.flexText.js --charset=utf-8 > tb.flexText.min.js