# Infinity loop animation frames

The scroll animation on the home page plays 60 pre-rendered frames from `assets/sequence/`.
They come from `scene.html`, a three.js scene of the gold infinity loop.

To re-render them (needs Node.js and Microsoft Edge or Chrome):

```bash
cd tools/infinity
npm install puppeteer-core
node render.js frames ../../assets/sequence 60
```

`node render.js preview out` saves five PNG previews instead.
Set `BROWSER` to your Chrome path if you don't use Edge.
