# Simple Lightbox Gallery

A small, plain JavaScript lightbox for showing photos: click a thumbnail and the full-size picture opens over a darkened page, with a caption, a counter, and previous and next for galleries.

It uses no libraries, no flexbox and no grid, so it works in old browsers as well as new ones. It is written in the spirit of the original Lightbox, but from scratch and much smaller.

**Live demo:** [toxtoo.github.io/simple-lightbox](https://toxtoo.github.io/simple-lightbox/)

---

## Features

- **Single images or galleries.** Links with the same gallery name are grouped together
- **Previous and next** by clicking the left or right half of the picture. A PREV or NEXT label appears as the mouse moves over each half. The left and right arrow keys also work
- **Captions** and an "Image 2 of 5" counter under the picture
- **CLOSE ×** at the bottom right. You can also click the dark background or press Esc
- **Large pictures are shrunk to fit** the browser window, portrait or landscape
- **A loading spinner** while each picture loads, and the next and previous pictures are fetched in the background
- **An optional "Click to enlarge" label** on the thumbnails, styled with CSS
- **Easy to restyle:** all the colours, sizes and fonts are in `lightbox.css`

### Browser support

The lightbox itself is written in old-style JavaScript and CSS (no flexbox or grid), so it should work back to Internet Explorer 8 and Firefox 4. The demo page uses the 4GRID layout, which supports IE9 and newer.

---

## Files

```
index.html          the demo page
css/lightbox.css    the lightbox styles (and the "Click to enlarge" label)
css/4grid.css       the demo page layout (not needed by the lightbox)
js/lightbox.js      the lightbox script
lb-img/loading.gif  the loading spinner
img/                the demo pictures and their thumbnails
```

---

## How to use it

### 1. Add the files to your page

In the `<head>`:

```html
<link rel="stylesheet" href="css/lightbox.css">
<script src="js/lightbox.js"></script>
```

### 2. A single picture

Link a thumbnail to the full-size picture, with `rel="lightbox"`:

```html
<a href="img/photo_full.jpg" rel="lightbox" data-caption="Market day">
  <img src="img/photo_tn.jpg" width="640" alt="Market day">
</a>
```

### 3. A gallery

Give every link in the set the same name in square brackets, such as `lightbox[street]`. The pictures are shown in the order they appear on the page:

```html
<a href="img/one_full.jpg" rel="lightbox[street]" data-caption="First picture">
  <img src="img/one_tn.jpg" width="640" alt="First picture">
</a>
<a href="img/two_full.jpg" rel="lightbox[street]" data-caption="Second picture">
  <img src="img/two_tn.jpg" width="640" alt="Second picture">
</a>
```

You can have several galleries on one page, each with its own name.

### Captions

The caption comes from `data-caption`. If a link has no `data-caption`, its `title` is used instead, so older pages keep working. Using `data-caption` avoids the browser's own tooltip popping up when the mouse is over the thumbnail.

### The "Click to enlarge" label

Add `data-tip` to a link to show a styled label over the thumbnail when the mouse is on it:

```html
<a href="img/photo_full.jpg" rel="lightbox" data-caption="Market day" data-tip="Click to enlarge">
```

The label's look is in the `a[data-tip]:hover:after` rule in `lightbox.css`.

---

## Changing the look

Everything is in `lightbox.css`, with comments explaining each part:

| To change | Look for |
|---|---|
| The darkness of the background | `#lb-overlay` |
| The white frame round the picture | `#lb-box` |
| The PREV and NEXT labels | `#lb-prev span` and `#lb-next span` |
| CLOSE × | `#lb-close` and `#lb-close span` |
| The caption and counter | `#lb-caption` and `#lb-counter` |
| The "Click to enlarge" label | `a[data-tip]:hover:after` |
| The loading spinner | `#lb-loading`. Replace `lb-img/loading.gif`, or change the `url(...)` to your own picture |

### A note on box-sizing

If your own stylesheet sets `box-sizing: border-box` on everything (`* { box-sizing: border-box; }`), keep this rule in `lightbox.css`. Without it, the picture is too wide for its white frame:

```css
#lb-overlay,
#lb-overlay * {
  box-sizing: content-box;
  -moz-box-sizing: content-box;
}
```

---

## The demo pictures

The street photographs in the demo are **AI-generated** test images, made for this demo. They are not real photographs of real places or people.

---

## Licence

Released under the **MIT licence**: you can use, change and share it freely, including in your own projects, as long as you keep the copyright notice. See the `LICENSE` file.

---

## Credits

A hobby project, made for my own photography websites and shared in case it is useful to others.

**Built with Claude.** I'm not a programmer. This lightbox was written in conversation with [Claude](https://claude.ai) from Anthropic, based on my description of the original Lightbox and what I wanted it to do. I tested it, styled the demo and decided how it should work.

The demo page layout uses my own 4GRID, a float-based four-column responsive grid.

The idea comes from the original [Lightbox](https://lokeshdhakar.com/projects/lightbox2/) by Lokesh Dhakar. None of its code is used here.
