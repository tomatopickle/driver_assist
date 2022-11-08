<template>
  <div>
    <div id="loading">
      <div v-show="loading">
        <h1>Loading</h1>
        <br />
        <v-progress-circular
          :size="70"
          :width="7"
          color="teal"
          indeterminate
        ></v-progress-circular>
      </div>
    </div>
    <div v-show="!loading" class="video-player" style="overflow: hidden">
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

         if (!screen.orientation.type.includes('landscape')){
            this.$router.push('/orientationError')
        }
        const video = await this.initWebcam(this.$refs.video);

        this.predictionInterval = setInterval(() => {
            if (this.loading){
                return;
            }
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
                            width: window.innerWidth,
                            height: window.innerHeight,
                            facingMode: 'environment',

                        }
                    })
                    .then(stream => {

                        const video = videoRef;
                        if(!this.$refs.canvas){
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
