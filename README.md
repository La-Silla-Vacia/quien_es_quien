Source files for quien_es_quien
=====

## Description

Please provide a short description of this project
![](https://raw.githubusercontent.com/la-silla-vacia/quien_es_quien/master/screenshot.png)

## Data
Please link to any external data used, as well as scripts for cleaning and analyzing that data, all of which should live in the `/data` directory.

## Installation
After cloning the repository run:
```
yarn install
```

To start watching the project and opening in the browser run:
```
yarn start
```

To deploy to GitHub pages run:
```
yarn run deploy
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