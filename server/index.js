const Koa = require('koa');
const KoaRouter = require('koa-router');
const serve = require('koa-static');
const http = require('http');
const Capture = require('./pacp');
const fs = require('fs');
const path = require('path');

const config = JSON.parse(fs.readFileSync(path.resolve('config.json'), 'utf-8'));

const KB = 1024;
const MB = 1024 * 1024;
const MAX_LENGTH = 2 * MB;
const store = {
	buffer: Buffer.alloc(MAX_LENGTH, 0)
};

const capture = Capture(config.pcap.device, config.pcap.filter);

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
app.use(serve(path.join(process.cwd(), 'dist')));

http.createServer(app.callback()).listen(config.server.port, config.server.host);