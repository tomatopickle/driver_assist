<template>
  <div>
    <div id="loading">
      <div v-show="loading">
        <h1>Loading</h1>
        <br />
        <v-progress-circular :size="70" :width="7" color="teal" indeterminate></v-progress-circular>
      </div>
    </div>
    <v-snackbar v-model="snackbar.show" :color='snackbar.color + " dark -2"' :timeout="2500">
      {{ snackbar.text }}
    </v-snackbar>
    <div v-show="!loading" @click="setSpeed" class="video-player" style="overflow: hidden">
      <video ref="video" />
      <canvas width="640" height="480" ref="canvas" />
    </div>
  </div>
</template>

<script lang="js">
import * as cocoSSD from "@tensorflow-models/coco-ssd";
import PredictionRenderer from "./PredictionRenderer";

var predictionRenderer = new PredictionRenderer();


window.speed = prompt('Speed:', 60);
export default {
  data: () => {
    return {
      predictionRenderer: predictionRenderer,
      predictionInterval: Number,
      model: cocoSSD.ObjectDetection,
      loading: true,
      snackbar: {
        show: false,
        text: 'Loading',
        color: 'grey',
      }
    };
  },
  props: {
  },
  async created() {
    this.model = await cocoSSD.load();
    this.loading = false;
  },
  async mounted() {

    if (!screen.orientation.type.includes('landscape')) {
      this.$router.push('/orientationError')
    }
    const video = await this.initWebcam(this.$refs.video);

    this.predictionInterval = setInterval(() => {
      if (this.loading) {
        return;
      }
      this.analyzeVideoFrame(video);
    }, 50);
  },

  beforeDestroy() {
    clearInterval(this.predictionInterval);
  },
  methods: {
    action(danger) {
      this.snackbar.text = danger.text;
      let color = 'orange';

      if (danger.severity == 'ultra' || danger.severity == 'high') {
        color = 'red';
        beep(1000, 600);
      } else {
        if (!window.speechSynthesis.speaking) {
          window.speechSynthesis.speak(new SpeechSynthesisUtterance(danger.text));
        }

      }
      this.snackbar.color = color;
      this.snackbar.show = true;

    },
    setSpeed() {
      window.speed = prompt('New Speed:')
    },
    initWebcam(videoRef) {

      return new Promise(resolve => {

        navigator.mediaDevices
          .getUserMedia({
            video: {
              width: window.innerWidth,
              height: window.innerHeight,
              facingMode: 'environment',
            }
          })
          .then(stream => {

            const video = videoRef;
            if (!this.$refs.canvas) {
              return
            }
            this.$refs.canvas.height = window.innerHeight;
            this.$refs.canvas.width = window.innerWidth;
            this.$refs.canvas.style.marginLeft = (-1 * window.innerWidth) + 'px'
            video.srcObject = stream;
            video.onloadedmetadata = () => {
              video.play();
              resolve(video);
            }
          });
      });
    },

    analyzeVideoFrame(video) {
      this.model.detect(video).then((predictions) => {
        let ctx;
        const canvas = this.$refs.canvas;
        if (!canvas) {
          return;
        }
        ctx = canvas.getContext("2d");

        ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
        this.predictionRenderer.render(predictions, ctx, (dangerVal) => {
          let speed = window.speed;
          if (speed == 0 || dangerVal == 0) { return; }
          if (dangerVal >= 15) {
            if (speed >= 30) {
              speed = 0;
              this.action({ text: 'Apply Brakes', severity: 'ultra' });
            } else if (speed >= 15) {
              this.action({ text: 'Apply Brakes to Speed: 15', severity: 'high' });
            } else if (speed >= 10) {
              this.action({ text: 'Close Car', severity: 'mid' });
            }
          } else if (dangerVal > 10) {
            if (speed > 120) {
              this.action({ text: 'Apply Brakes', severity: 'ultra' });
            } else if (speed > 50) {
              this.action({ text: 'Slow Down', severity: 'high' });
            }
          } else if (dangerVal < 10 && dangerVal > 4) {
            if (speed >= 120) {
              this.action({ text: 'Slow Down', severity: 'mid' });
            }
          } else if (speed > 130) {
            this.action({ text: 'Slow Down', severity: 'low' });
          }
        });
      });
    }
  },
}
var audioCtx = new (window.AudioContext || window.webkitAudioContext || window.audioContext);

function beep(duration, frequency, volume, type, callback) {
  var oscillator = audioCtx.createOscillator();
  var gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  if (volume) { gainNode.gain.value = volume; }
  if (frequency) { oscillator.frequency.value = frequency; }
  if (type) { oscillator.type = type; }
  if (callback) { oscillator.onended = callback; }

  oscillator.start(audioCtx.currentTime);
  oscillator.stop(audioCtx.currentTime + ((duration || 500) / 1000));
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
html,
body {
  overflow-y: hidden;
}

.video-player {
  position: relative;
  width: max-content;
  display: block;
  margin: auto;

  canvas,
  video {
    border-radius: 5px;
  }

  canvas {
    position: absolute;
  }
}

#loading {
  position: fixed;
  top: 45%;
  left: 50%;
  transform: translateX(-50%) translateY(-50%);

  .v-progress-circular {
    margin: auto;
    display: block;
  }
}
</style>
