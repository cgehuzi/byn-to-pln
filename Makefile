install:
	npm ci

start:
	npm run start

lint:
	npx eslint .

deploy:
	npm run build
	npm run deploy
