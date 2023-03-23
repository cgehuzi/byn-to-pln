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
	git config --global user.email "mail.cgehuzi@gmail.com"
  	git config --global user.name "cgehuzi"	
	npx gh-pages -d build
