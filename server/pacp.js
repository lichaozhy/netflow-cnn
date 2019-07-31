const { Cap, decoders } = require('cap');
const { PROTOCOL } = decoders;
const EventEmitter = require('events');

module.exports = function Capture(deviceName, filter) {
	const capture = new EventEmitter();
	const cap = new Cap();
	const device = Cap.findDevice(deviceName);
	const bufSize = 10 * 1024 * 1024;
	const buffer = Buffer.alloc(65535);
	const linkType = cap.open(device, filter, bufSize, buffer);

	cap.setMinBytes && cap.setMinBytes(0);
	
	cap.on('packet', (nbytes, trunc) => {
		// console.log('packet: length ' + nbytes + ' bytes, truncated? '
		//             + (trunc ? 'yes' : 'no'));
	
		// raw packet data === buffer.slice(0, nbytes)
	
		if (linkType === 'ETHERNET') {
			var ret = decoders.Ethernet(buffer);
	
			if (ret.info.type === PROTOCOL.ETHERNET.IPV4) {
				// console.log('Decoding IPv4 ...');
	
				ret = decoders.IPV4(buffer, ret.offset);
				// console.log('from: ' + ret.info.srcaddr + ' to ' + ret.info.dstaddr);
	
				if (ret.info.protocol === PROTOCOL.IP.TCP) {
					var datalen = ret.info.totallen - ret.hdrlen;
	
					// console.log('Decoding TCP ...');
	
					ret = decoders.TCP(buffer, ret.offset);
					// console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
					datalen -= ret.hdrlen;
					// console.log(buffer.toString('binary', ret.offset, ret.offset + datalen));
					// console.log(buffer.toString('hex', ret.offset, ret.offset + datalen));

					capture.emit('received', buffer.slice(ret.offset, ret.offset + datalen))
				} else if (ret.info.protocol === PROTOCOL.IP.UDP) {
					console.log('Decoding UDP ...');
	
					ret = decoders.UDP(buffer, ret.offset);
					console.log(' from port: ' + ret.info.srcport + ' to port: ' + ret.info.dstport);
					console.log(buffer.toString('binary', ret.offset, ret.offset + ret.info.length));
				} else
					console.log('Unsupported IPv4 protocol: ' + PROTOCOL.IP[ret.info.protocol]);
			} else
				console.log('Unsupported Ethertype: ' + PROTOCOL.ETHERNET[ret.info.type]);
		}
	});

	return capture;
};