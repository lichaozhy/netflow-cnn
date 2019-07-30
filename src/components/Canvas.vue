<template>

<canvas
	:style="{
		'background-color': flag ? 'blue' : 'transparent'
	}"
	ref="canvas"
	:width="side"
	:height="side"
></canvas>

</template>

<script>
export default {
	data() {
		return {
			flag: true
		}
	},
	props: ['array', 'side', 'threshold'],
	mounted() {
		const ctx = this.$refs.canvas.getContext('2d');
		const imageData = ctx.getImageData(0, 0, this.side, this.side);

		for(let i = 0; i < this.array.length; i++) {
			const start = 4 * i;

			imageData.data[start] = imageData.data[start + 1] = imageData.data[start + 2] = this.array[i];
			imageData.data[start + 3] = 200;
		}

		ctx.putImageData(imageData, 0, 0);
		const avg = this.array.reduce((sum, current) => sum + current, 0) / this.array.length;
		this.flag = avg > this.threshold;
	}
}
</script>
