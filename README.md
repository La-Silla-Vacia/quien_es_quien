Source files for quien_es_quien
=====

## Description

Please provide a short description of this project

## Data
Please link to any external data used, as well as scripts for cleaning and analyzing that data, all of which should live in the `/data` directory.

## Installation
After cloning the repository run:
```
npm install
```

To start watching the project and opening in the browser run:
```
npm start
```

To deploy to GitHub pages run:
```
npm run deploy
```

---

## Embeding on LSV
To embed on a webpage use this code:
```html
<!-- START OF OUR INTERACTIVE -->
<script type="text/javascript">
window.quien_es_quien_data = {
  "name": "quien_es_quien"
}
</script>
<div class="lsv-interactive" id="quien_es_quien">
<img src="https://la-silla-vacia.github.io/quien_es_quien/screenshot.png" class="screenshot" style="width:100%;">
</div>
<script defer type="text/javascript" src="https://la-silla-vacia.github.io/quien_es_quien/script.js"></script>
<!-- END OF OUR INTERACTIE -->
```