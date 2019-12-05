# Mike's p5-playground
## Games and fun visuals in JavaScript with p5.js
Available to interact with [here](https://mikecroall.github.io/p5-playground/).

### Sketch ideas
- Matter.js pool game
- Some game(s) implemented and played with neuroevolution of bots

Try out p5.js [here](https://p5js.org/).

### Capture video frames
For sketches that include video capture code, the frames can be stitched with `ffmpeg`. For example,
```bash
ffmpeg -r 25 -s 1920x1080 -i "%07d.png" -vcodec libx264 -crf 17 -pix_fmt yuv420p output.mp4
```
