# vttizer

[![NPM Version](https://img.shields.io/npm/v/vttizer.svg)](https://www.npmjs.com/package/vttizer)

> A library to render many subtitles format on HTML5 video in the browser.

## Demo
> https://u4bi.github.io/vttizer/example

## Install

```html
<script src="https://cdn.rawgit.com/u4bi/vttizer/master/dist/vttizer.min.js"></script>
```

## Usage

```javascript
var subtitles = `...`,
    format    = 'smi' || 'srt' || 'vtt';

var vttizer = new Vttizer(subtitles, format);
vttizer.render(videoElement);
```

## Support

### ✔ SAMI(.smi)
- https://en.wikipedia.org/wiki/SAMI

![SMI](example/media/image/smi.gif)

### ✔ SubRip(.srt)
- https://en.wikipedia.org/wiki/SubRip

![SRT](example/media/image/srt.gif)

### ✔ WebVTT(.vtt)
- https://en.wikipedia.org/wiki/WebVTT

![VTT](example/media/image/vtt.gif)

### ✔ Movie Sub
- The.Ritual.2017.1080p.WEB-DL.DD5.1.H264-FGT.smi

![MOVIE_SUB](example/media/image/movie_sub.gif)

---------------------------------------

> # Have Fun! 👀 💥
> ![CASE_0](example/media/image/case_0.png)
> ![CASE_1](example/media/image/case_1.png)

## License
[MIT](LICENSE)