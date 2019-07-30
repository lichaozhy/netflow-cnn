<template>

<b-container class="py-5">
	<b-row>
		<b-col>
			<b-form-group
				label="Buffer Size (Byte)"
			>
				<b-form-select
					v-model="size"
					size="sm"
				>
					<option :value="16*1024">16 KB</option>
					<option :value="32*1024">32 KB</option>
					<option :value="64*1024">64 KB</option>
					<option :value="128*1024">128 KB</option>
					<option :value="256*1024">256 KB</option>
					<option :value="512*1024">512 KB</option>
					<option :value="1024*1024">1 MB</option>
					<option :value="2*1024*1024">2 MB</option>
					<option :value="4*1024*1024">4 MB</option>
					<option :value="8*1024*1024">8 MB</option>
					<!-- <option :value="16*1024*1024">16 MB</option> -->
					<!-- <option :value="32*1024*1024">32 MB</option> -->
				</b-form-select>
			</b-form-group>
		</b-col>
		<b-col>
			<b-form-group
				label="Chunk Side Length"
			>
				<b-form-select
					v-model="chunk"
					size="sm"
				>
					<option :value="16">16 Byte</option>
					<option :value="32">32 Byte</option>
					<option :value="64">64 Byte</option>
					<option :value="128">128 Byte</option>
					<option :value="256">256 Byte</option>
				</b-form-select>
			</b-form-group>
		</b-col>
		<b-col>
			<b-form-group
				label="Threshold"
			>
				<b-form-input
					v-model="renderer.threshold"
					size="sm"
				/>
			</b-form-group>
		</b-col>
		<b-col>
			<b-form-group
				label="Operation"
			>
				<b-button
					variant="primary"
					size="sm"
					@click="render"
				>Render</b-button>
			</b-form-group>
		</b-col>
	</b-row>
	<div id="canvas">
		<app-canvas
			v-for="(data, index) in data"
			:key="index"
			:array="data"
			:side="renderer.side"
			:threshold="renderer.threshold"
		></app-canvas>

		<div style="clear:both"></div>
	</div>
</b-container>

</template>

<script>
import axios from 'axios';
import AppCanvas from './Canvas';

const DOUBLE_EXP = /\w{2}/g;

export default {
	components: {
		AppCanvas
	},
	data() {
		return {
			chunk: 128,
			size: 64*1024,
			data: [],
			renderer: {
				side: 128,
				threshold: 100
			}
		};
	},
	methods: {
		async render() {
			this.data = [];
			const { data } = await axios.get(`/flow/${this.size}`);
			const { hex } = data;

			const length = Math.pow(this.chunk, 2) * 2;
			const newData = [];
			
			this.data = hex.match(new RegExp(`\\w{${length}}`, 'g')).map(chunk => {
				return chunk.match(DOUBLE_EXP).map(hex => parseInt(hex, 16))
			});

			this.renderer.side = this.chunk;
		}
	}
}
</script>

<style>
#canvas canvas {
	float: left;
}
</style>
