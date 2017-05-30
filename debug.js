/*global require,console*/
var lsv = require('lsv-interactive');
import React from 'react';
import { render } from 'react-dom';
import Base from './src/base';

require("./src/_variables.css"); // this goes outside the callback since otherwise the interactive sometimes fires before the CSS is fully loaded
require("./src/global.css");

lsv("quien_es_quien", function (interactive) {
  "use strict";

  if (!interactive) {
    console.log("Interactive quien_es_quien not initiated. Exiting.");
    return;
  }

  //MARKUP
  render((
    <Base {...interactive} />
  ), interactive.el);

}, true); // change this last param to true if you want to skip the DOM checks