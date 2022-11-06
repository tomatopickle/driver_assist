<template>
  <div>
    <div class="video-player" style="overflow: hidden">
      <video ref="video" />
      <canvas width="640" height="480" ref="canvas" />
    </div>
  </div>
</template>

<script lang="js">
import * as cocoSSD from "@tensorflow-models/coco-ssd";
import PredictionRenderer from "./PredictionRenderer";

var predictionRenderer = new PredictionRenderer();

export default {
    data: () => {
        return {
            predictionRenderer: predictionRenderer,
            predictionInterval: Number,
            model: cocoSSD.ObjectDetection,
            loading: true
        };
    },
    props: {
    },
    async created() {
        this.model = await cocoSSD.load();
        this.loading = false;
    },
    async mounted() {
        const video = await this.initWebcam(this.$refs.video);
        this.predictionInterval = setInterval(() => {
            this.analyzeVideoFrame(video);
        }, 50);
    },

    beforeDestroy() {
        clearInterval(this.predictionInterval);
    },
    methods: {
        initWebcam(videoRef) {

            return new Promise(resolve => {

                navigator.mediaDevices
                    .getUserMedia({
                        video: {
                            width: document.documentElement.clientWidth,
                            height: document.documentElement.clientHeight
                        }
                    })
                    .then(stream => {

                        const video = videoRef;
                        this.$refs.canvas.height = document.documentElement.clientHeight
                        this.$refs.canvas.width = document.documentElement.clientWidth
                        this.$refs.canvas.style.marginLeft = (-1 * document.documentElement.clientWidth) + 'px'
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

                const canvas = this.$refs.canvas;
                const ctx = canvas.getContext("2d");

                ctx.clearRect(0, 0, ctx.canvas.width, ctx.canvas.height);
                this.predictionRenderer.render(predictions, ctx);
            });
        }
    },


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
</style>
