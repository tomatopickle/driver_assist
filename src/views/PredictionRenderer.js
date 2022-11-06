export default class PredictionRenderer {
  render(predictions, ctx) {
    //color
    const color = "#41b883";
    // Font options.
    const font = "16px sans-serif";
    ctx.font = font;
    ctx.textBaseline = "top";

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const width = prediction.bbox[2];
      const height = prediction.bbox[3];
      // Draw the bounding box.
      ctx.strokeStyle = color;
      ctx.lineWidth = 4;
      ctx.strokeRect(x, y, width, height);
      // Draw the label background.
      ctx.fillStyle = color;
      const textWidth = ctx.measureText(prediction.class).width;
      const textHeight = parseInt(font, 10); // base 10
      ctx.fillRect(x, y, textWidth + 4, textHeight + 4);
    });

    predictions.forEach((prediction) => {
      const x = prediction.bbox[0];
      const y = prediction.bbox[1];
      const height = document.documentElement.clientHeight;
      const width = document.documentElement.clientWidth;
      // Draw the text last to ensure it's on top.
      ctx.fillStyle = "#000000";
      console.log(prediction.bbox);
      ctx.fillText(
        prediction.class +
          "width:" +
          Math.round((prediction.bbox[2] / width) * 100) +
          " height:" +
          Math.round((prediction.bbox[3] / height) * 100) +
          " danger:" +
          Math.round(
            (Math.round((prediction.bbox[2] / width) * 100) /
              Math.round((prediction.bbox[3] / height) * 100)) *
              100
          ),
        x,
        y
      );
    });
  }
}
