install:
	npm ci

start:
	npx react-scripts start

lint:
	npx eslint .

build:
	npx react-scripts build

deploy:
	make build
	npx gh-pages -d build
