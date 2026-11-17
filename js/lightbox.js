/* Simple Lightbox - single images and galleries, no libraries.

   Single image:
     <a href="big.jpg" rel="lightbox" data-caption="Caption"><img src="thumb.jpg" alt=""></a>

   Gallery (any links sharing the same name in square brackets):
     <a href="one.jpg" rel="lightbox[holiday]" data-caption="First">...</a>
     <a href="two.jpg" rel="lightbox[holiday]" data-caption="Second">...</a>

   The caption comes from data-caption. If a link has no data-caption,
   its title is used instead, so older pages keep working. (Using
   data-caption avoids the browser's own tooltip popping up on hover.)

   Close: click the dark area, the X, or press Esc.
   Gallery: click the left or right half of the picture (a PREV or NEXT
   label appears as the mouse moves over it), or use the left/right
   arrow keys.

   The loading picture is set in lightbox.css (images/loading.gif), so you
   can use your own. */

(function () {
  var overlay, loading, box, frame, bar, img, caption, counter, closeLink, prevLink, nextLink;
  var group = [];   /* the images in the set being viewed: { href, title } */
  var current = 0;  /* position in that set */
  var loadId = 0;   /* ignores slow-loading images the viewer has already moved past */

  function addEvent(el, type, fn) {
    if (el.addEventListener) {
      el.addEventListener(type, fn, false);
    } else if (el.attachEvent) {
      el.attachEvent('on' + type, fn);
    }
  }

  function stopEvent(e) {
    if (e.preventDefault) { e.preventDefault(); } else { e.returnValue = false; }
    if (e.stopPropagation) { e.stopPropagation(); } else { e.cancelBubble = true; }
  }

  function makeLink(id, title, html) {
    var a = document.createElement('a');
    a.id = id;
    a.href = '#';
    if (title) { a.title = title; }
    a.innerHTML = html;
    return a;
  }

  function build() {
    overlay = document.createElement('div');
    overlay.id = 'lb-overlay';

    loading = document.createElement('span');
    loading.id = 'lb-loading';
    loading.innerHTML = 'Loading&hellip;';

    box = document.createElement('div');
    box.id = 'lb-box';

    frame = document.createElement('div');
    frame.id = 'lb-frame';

    img = document.createElement('img');
    img.id = 'lb-image';

    closeLink = makeLink('lb-close', 'Close (Esc)', 'Close <span>&times;</span>');
    /* No tooltips on these: the PREV / NEXT labels say what they do */
    prevLink = makeLink('lb-prev', '', '<span>Prev</span>');
    nextLink = makeLink('lb-next', '', '<span>Next</span>');

    caption = document.createElement('div');
    caption.id = 'lb-caption';

    counter = document.createElement('div');
    counter.id = 'lb-counter';

    /* The strip under the picture: Close on the right, the caption and
       counter on the left */
    bar = document.createElement('div');
    bar.id = 'lb-bar';

    frame.appendChild(img);
    frame.appendChild(prevLink);
    frame.appendChild(nextLink);

    bar.appendChild(closeLink);
    bar.appendChild(caption);
    bar.appendChild(counter);

    box.appendChild(frame);
    box.appendChild(bar);

    overlay.appendChild(loading);
    overlay.appendChild(box);
    document.body.appendChild(overlay);

    /* click on the dark area closes */
    addEvent(overlay, 'click', function () { hide(); });

    /* clicks inside the white box don't reach the overlay */
    addEvent(box, 'click', function (e) {
      e = e || window.event;
      if (e.stopPropagation) { e.stopPropagation(); } else { e.cancelBubble = true; }
    });

    addEvent(closeLink, 'click', function (e) {
      stopEvent(e || window.event);
      hide();
    });

    addEvent(prevLink, 'click', function (e) {
      stopEvent(e || window.event);
      goPrev();
    });

    addEvent(nextLink, 'click', function (e) {
      stopEvent(e || window.event);
      goNext();
    });

    addEvent(document, 'keydown', function (e) {
      e = e || window.event;
      if (overlay.style.display !== 'block') { return; }
      if (e.keyCode === 27) { hide(); }
      if (e.keyCode === 37) { goPrev(); }
      if (e.keyCode === 39) { goNext(); }
    });
  }

  function isLightbox(rel) {
    return rel === 'lightbox' || (rel && rel.indexOf('lightbox[') === 0);
  }

  /* the caption for a link: data-caption if it has one, otherwise its title */
  function captionOf(link) {
    var text = link.getAttribute('data-caption');
    if (text === null || text === '') { text = link.getAttribute('title'); }
    return text;
  }

  /* collects every link with the same rel as the one clicked, in page order */
  function collectGroup(link) {
    var rel = link.getAttribute('rel');
    var links, i;

    group = [];
    current = 0;

    if (rel === 'lightbox') {
      group.push({ href: link.getAttribute('href'), title: captionOf(link) });
      return;
    }

    links = document.getElementsByTagName('a');
    for (i = 0; i < links.length; i++) {
      if (links[i].getAttribute('rel') === rel) {
        if (links[i] === link) { current = group.length; }
        group.push({ href: links[i].getAttribute('href'), title: captionOf(links[i]) });
      }
    }
  }

  function showImage(index) {
    var item = group[index];
    var pre = new Image();
    var myId;

    current = index;
    loadId += 1;
    myId = loadId;

    box.style.display = 'none';
    loading.innerHTML = 'Loading&hellip;';
    loading.className = '';
    loading.style.display = 'inline-block';
    overlay.style.display = 'block';

    pre.onload = function () {
      var viewW, viewH, maxW, maxH, w, h, scale;

      if (myId !== loadId) { return; }  /* viewer has moved on to another image */

      viewW = document.documentElement.clientWidth;
      viewH = document.documentElement.clientHeight;
      maxW = viewW - 80;   /* room for padding and close button */
      maxH = viewH - 140;  /* room for padding, caption and counter */
      w = pre.width;
      h = pre.height;
      scale = Math.min(1, maxW / w, maxH / h);

      w = Math.round(w * scale);
      h = Math.round(h * scale);

      img.src = item.href;
      img.width = w;
      img.height = h;
      img.alt = item.title || '';
      box.style.width = w + 'px';

      caption.innerHTML = '';
      if (item.title) {
        caption.appendChild(document.createTextNode(item.title));
        caption.style.display = 'block';
      } else {
        caption.style.display = 'none';
      }

      if (group.length > 1) {
        counter.innerHTML = 'Image ' + (index + 1) + ' of ' + group.length;
        counter.style.display = 'block';
      } else {
        counter.style.display = 'none';
      }

      prevLink.style.display = (index > 0) ? 'block' : 'none';
      nextLink.style.display = (index < group.length - 1) ? 'block' : 'none';

      loading.style.display = 'none';
      box.style.display = 'inline-block';
      pre.onload = null;

      preloadNeighbours(index);
    };

    pre.onerror = function () {
      if (myId !== loadId) { return; }
      loading.innerHTML = 'Sorry, the image could not be loaded.';
      loading.className = 'lb-error';  /* swaps the loading picture for the message */
    };

    /* set src after the handlers so cached images still fire onload */
    pre.src = item.href;
  }

  /* fetch the images either side in the background so moving through feels quicker */
  function preloadNeighbours(index) {
    var p;
    if (index + 1 < group.length) {
      p = new Image();
      p.src = group[index + 1].href;
    }
    if (index > 0) {
      p = new Image();
      p.src = group[index - 1].href;
    }
  }

  function goPrev() {
    if (current > 0) { showImage(current - 1); }
  }

  function goNext() {
    if (current < group.length - 1) { showImage(current + 1); }
  }

  function hide() {
    loadId += 1;  /* cancels any image still loading */
    overlay.style.display = 'none';
    img.removeAttribute('src');
  }

  /* one click handler for the whole page: finds the nearest link with a lightbox rel */
  function onPageClick(e) {
    var el;
    e = e || window.event;
    el = e.target || e.srcElement;

    while (el && el.nodeName !== 'A') { el = el.parentNode; }

    if (el && isLightbox(el.getAttribute('rel'))) {
      stopEvent(e);
      collectGroup(el);
      showImage(current);
    }
  }

  addEvent(window, 'load', function () {
    build();
    addEvent(document, 'click', onPageClick);
  });
})();
