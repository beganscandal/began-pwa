import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import vm from 'node:vm';

const read = (path) => readFile(new URL(`../${path}`, import.meta.url), 'utf8');

const [
  notifications,
  forum,
  forumPost,
  forumRender,
  forumScript,
  forumStyles,
  tailwind,
  reserveRender
] = await Promise.all([
  read('notifications/index.html'),
  read('forum/index.html'),
  read('forum/post/index.html'),
  read('forum/forum-render.js'),
  read('forum/forum.js'),
  read('forum/forum.css'),
  read('forum/tailwind.min.css'),
  read('reserve/reserve-render.js')
]);

assert.doesNotMatch(notifications, /cdn\.tailwindcss\.com/);
assert.doesNotMatch(notifications, /cdn-cgi\/challenge-platform|__CF\$cv/);
assert.match(notifications, /forum\/tailwind\.min\.css/);
assert.match(notifications, /assets\/dm-sans\.css/);
assert.match(tailwind, /\.bg-accent/);
assert.match(tailwind, /\.pb-24/);

assert.doesNotMatch(forum, /fonts\.googleapis\.com/);
assert.doesNotMatch(forumPost, /cdn\.tailwindcss\.com/);
assert.match(forum, /logo-font-400\.webp/);
assert.match(forumPost, /logo-font-400\.webp/);

assert.match(forumRender, /data-forum-video-expand/);
assert.ok(
  forumRender.indexOf('forum-video-toolbar') < forumRender.indexOf('forum-media-iframe'),
  'Forum expand control must be rendered outside and before the video iframe'
);
assert.match(forumRender, /allow="autoplay; fullscreen"/);
assert.match(forumScript, /bindForumVideoExpand/);
assert.match(forumScript, /iframe\.requestFullscreen/);
assert.doesNotMatch(forumScript, /classList\.add\('is-expanded'\)/);
assert.match(forumStyles, /\.forum-media-iframe:fullscreen/);
assert.match(forumStyles, /\.forum-video-toolbar\{[^}]*justify-content:flex-start/s);
assert.doesNotMatch(forumRender, /forum-video-expand__label/);
assert.doesNotMatch(forumRender, /aria-expanded/);

const expandButtonRule = forumStyles.match(/\.forum-video-expand\{([^}]*)\}/)?.[1] || '';
assert.doesNotMatch(
  expandButtonRule,
  /position\s*:\s*(?:absolute|fixed)/,
  'Forum expand control must stay in its own toolbar, outside the player overlay'
);

assert.match(forum, /forum\.css\?v=20260812-3/);
assert.match(forum, /forum-render\.js\?v=20260812-3/);
assert.match(forum, /forum\.js\?v=20260812-3/);

let feedClick;
const feed = {
  dataset: {},
  addEventListener(type, listener) {
    if (type === 'click') feedClick = listener;
  }
};
const scriptContext = {
  Audio: class {},
  console: { error() {} },
  document: {
    addEventListener() {},
    getElementById() { return feed; }
  },
  window: {}
};
vm.runInNewContext(forumScript, scriptContext);
scriptContext.bindForumVideoExpand();

let fullscreenCalls = 0;
const iframe = {
  src: 'https://drive.google.com/file/d/test/preview',
  requestFullscreen() {
    fullscreenCalls += 1;
    return Promise.resolve();
  }
};
const media = {
  querySelector(selector) {
    return selector === '.forum-media-iframe' ? iframe : null;
  }
};
const button = {
  closest(selector) {
    return selector === '.forum-media' ? media : null;
  }
};
feedClick({
  target: { closest() { return button; } },
  preventDefault() {},
  stopPropagation() {}
});
feedClick({ target: { closest() { return null; } } });
assert.equal(fullscreenCalls, 1, 'Play/iframe clicks must not toggle or close fullscreen');

assert.match(reserveRender, /heroImage\.loading = 'eager'/);
assert.match(reserveRender, /heroImage\.fetchPriority = 'high'/);
assert.match(reserveRender, /index === 0/);

const tailwindSize = (await stat(new URL('../forum/tailwind.min.css', import.meta.url))).size;
const logoSize = (await stat(new URL('../assets/logo-font-400.webp', import.meta.url))).size;
const fontSize = (await stat(new URL('../assets/dm-sans-latin.woff2', import.meta.url))).size;

assert.ok(tailwindSize < 30_000, `Tailwind CSS too large: ${tailwindSize} bytes`);
assert.ok(logoSize < 20_000, `Forum logo too large: ${logoSize} bytes`);
assert.ok(fontSize < 50_000, `DM Sans font too large: ${fontSize} bytes`);

console.log('PASS pwa performance contracts');
