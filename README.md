Source files for quien_es_quien
=====

## Description

Please provide a short description of this project
![](https://raw.githubusercontent.com/la-silla-vacia/quien_es_quien/master/screenshot.png)

## Data
Please link to any external data used, as well as scripts for cleaning and analyzing that data, all of which should live in the `/data` directory.

## Installation
After cloning the repository run:
```console
yarn install
```

To start watching the project and opening in the browser run:
```console
yarn start
```

To deploy to GitHub pages run:
```console
yarn run deploy
```

---

## Available routes
To the page which shows all the the people who are in the same `id` group
```
/hilos/:id
```

Only list people with this id
```
/limit/56475,56885,56886,56530
```

Show a single person (optional, comma separated list after which will create the breadcrumbs)
```
/person/56475
```

Show mutual connections
```
/compare/56475,56476
```

---

## Embeding on LSV
To embed on a webpage use this code:
```html
<!-- START OF THE QUIEN ES QUIEN -->
<div class="lsv-interactive" id="quien_es_quien">
<img src="https://raw.githubusercontent.com/la-silla-vacia/lsv-interactive/master/misc/lsvi-loading.gif"
     alt="Interactive is loading" style="width:100%;max-width: 320px;margin: 4em auto;display: block;">
</div>
<script defer type="text/javascript" src="https://la-silla-vacia.github.io/quien_es_quien/script.js"></script>
<!-- END OF THE QUIEN ES QUIEN -->
```

---

If you want to load it on a given page, you can provide it with additional data. It redirects to the route which is provided in show. This example will redirect to the person with id 56475.
```html
<!-- START OF THE QUIEN ES QUIEN -->
<div class="lsv-interactive" id="quien_es_quien">
<img src="https://raw.githubusercontent.com/la-silla-vacia/lsv-interactive/master/misc/lsvi-loading.gif"
     alt="Interactive is loading" style="width:100%;max-width: 320px;margin: 4em auto;display: block;">
</div>
<script>window.quien_es_quien__data = {show: 'person/56475'}</script>
<script defer type="text/javascript" src="https://la-silla-vacia.github.io/quien_es_quien/script.js"></script>
<!-- END OF THE QUIEN ES QUIEN -->
```