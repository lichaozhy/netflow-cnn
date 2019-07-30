const Koa = require('koa');
const KoaRouter = require('koa-router');
const http = require('http');
const Capture = require('./pacp');

const KB = 1024;
const MB = 1024 * 1024;
const MAX_LENGTH = 64 * MB;
const store = {
	buffer: Buffer.alloc(MAX_LENGTH, 0)
};

const capture = Capture();

capture.on('received', chunk => {
	const origin = store.buffer;
	const data = Buffer.concat([origin, chunk], origin.length + chunk.length);

	store.buffer = data.slice(data.length - MAX_LENGTH);
});

const app = new Koa();
const router = new KoaRouter().get('/flow/:size', ctx => {
	const size = Number(ctx.params.size);

	ctx.body = {
		hex: store.buffer.slice(MAX_LENGTH - size).toString('hex')
	};
});

app.use(router.routes());

http.createServer(app.callback()).listen(8000, '127.0.0.1');