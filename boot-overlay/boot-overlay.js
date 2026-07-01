/*!
 * BEGAN Boot Overlay
 * Core Builder
 * Production v1.0
 */

(function (window, document) {

'use strict';

if (window.BeganBootOverlay) return;

/* ===========================================================
 * CONFIG
 * =========================================================== */

const STEPS = [

{
id: "session",
title: "Restoring Partner Session"
},

{
id: "server",
title: "Connecting BEGAN Server"
},

{
id: "inventory",
title: "Syncing Live Inventory"
},

{
id: "dashboard",
title: "Loading Dashboard"
}

];

/* ===========================================================
 * DOM CACHE
 * =========================================================== */

const DOM = {

overlay: null,

card: null,

title: null,

subtitle: null,

progressBar: null,

percent: null,

footer: null,

steps: {}

};

/* ===========================================================
 * ELEMENT HELPER
 * =========================================================== */

function el(tag, className, text) {

const node = document.createElement(tag);

if (className)
node.className = className;

if (text != null)
node.textContent = text;

return node;

}

/* ===========================================================
 * BUILD STEP
 * =========================================================== */

function buildStep(step) {

const article = el("article","began-step");

article.dataset.step = step.id;

const icon = el("span","began-step-icon");

const title = el(
"span",
"began-step-title",
step.title
);

const status = el(
"span",
"began-step-status",
"Pending"
);

article.append(
icon,
title,
status
);

DOM.steps[step.id] = {

root: article,

icon,

title,

status

};

return article;

}

/* ===========================================================
 * BUILD HEADER
 * =========================================================== */

function buildHeader(card){

const header = el(
"header",
"began-header"
);

const logoFont = el(
"img",
"began-logo-font"
);

logoFont.alt = "BEGAN";

logoFont.src = "";

const divider = el(
"div",
"began-divider"
);

const logoIcon = el(
"img",
"began-logo-icon"
);

logoIcon.alt = "BEGAN";

logoIcon.src = "";

const tagline = el(
"div",
"began-tagline",
"UNTIL GOD SAYS SO"
);

DOM.title = el(
"h2",
"began-title",
"SYNCING DASHBOARD"
);

DOM.subtitle = el(
"p",
"began-subtitle",
"Preparing your workspace..."
);

header.append(

logoFont,

divider,

logoIcon,

tagline,

DOM.title,

DOM.subtitle

);

card.append(header);

}

/* ===========================================================
 * BUILD STEP LIST
 * =========================================================== */

function buildSteps(card){

const wrap = el(
"section",
"began-steps"
);

STEPS.forEach(function(step){

wrap.append(

buildStep(step)

);

});

card.append(wrap);

}

/* ===========================================================
 * BUILD PROGRESS
 * =========================================================== */

function buildProgress(card){

const wrap = el(
"section",
"began-progress-wrap"
);

const track = el(
"div",
"began-progress-track"
);

DOM.progressBar = el(
"div",
"began-progress-bar"
);

track.append(

DOM.progressBar

);

DOM.percent = el(

"div",

"began-progress-percent",

"0%"

);

wrap.append(

track,

DOM.percent

);

card.append(

wrap

);

}

/* ===========================================================
 * BUILD FOOTER
 * =========================================================== */

function buildFooter(card){

DOM.footer = el(

"footer",

"began-footer",

"ESTABLISHED IN HEAVEN"

);

card.append(

DOM.footer

);

}

/* ===========================================================
 * BUILD OVERLAY
 * =========================================================== */

function buildOverlay(){

if(DOM.overlay)
return DOM.overlay;

DOM.overlay = el(

"div",

"began-overlay"

);

DOM.overlay.id =

"began-boot-overlay";

DOM.overlay.setAttribute(

"aria-hidden",

"true"

);

DOM.card = el(

"div",

"began-card"

);

buildHeader(

DOM.card

);

buildSteps(

DOM.card

);

buildProgress(

DOM.card

);

buildFooter(

DOM.card

);

DOM.overlay.append(

DOM.card

);

document.body.append(

DOM.overlay

);

return DOM.overlay;

}

/* ===========================================================
 * INIT
 * =========================================================== */

buildOverlay();

/* expose sementara */

window.__BEGAN_BOOT_DOM__ = DOM;

})(window, document);
