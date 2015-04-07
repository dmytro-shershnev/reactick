## First task move "acc-user-name.dust" and "acc-user-name.js" to react

1) how resolve {?firstName}1 {:else}2 {/firstName} ?

2) how resolve i18n ?

3) how resolve if condition ?

some solution without {:else}

http://stackoverflow.com/questions/22538638/how-to-have-conditional-elements-and-keep-dry-with-facebook-reacts-jsx
http://stackoverflow.com/questions/25224793/reactjs-creating-a-if-component-a-good-idea

<div id={condition ? 'msg' : ''
{true && (<div>render item</div>)}
{false && (<div>don't render item</div>)}


### GOOD LUCK!!

# React Tutorial

This is the React comment box example from [the React tutorial](http://facebook.github.io/react/docs/tutorial.html).

## To use

There are several simple server implementations included. They all serve static files from `public/` and handle requests to `comments.json` to fetch or add data. Start a server with one of the following:

### Node

```sh
npm install
node server.js
```

### Python

```sh
pip install -r requirements.txt
python server.py
```

### Ruby
```sh
ruby server.rb
```

### PHP
```sh
php server.php
```

### Go
```sh
go run server.go
```

And visit <http://localhost:3000/>. Try opening multiple tabs!
