const AWS      = require('aws-sdk');
const Consumer = require('sqs-consumer');
const async    = require('async');
const config   = require('./config');
const networks = require('./networks');
const logger   = require('bole')('social');

const sqs = Consumer.create({
	queueUrl: config('sqs').queueUrl,
	messageAttributeNames: ['Card'],
	handleMessage: handleMessage,
	sqs: new AWS.SQS({
		accessKeyId: config('sqs').accessKeyId,
		secretAccessKey: config('sqs').secretAccessKey,
		region: config('sqs').region,
		apiVersion: config('sqs').apiVersion
	}),
	batchSize: 1
});

sqs.on('error', (err) => {
	logger.error(err);
});

sqs.start();

function handleMessage(message, done) {
	logger.info('Received new message');
	
	let body = JSON.parse(message['Body']);
	let buffer = message.MessageAttributes.Card.BinaryValue;
	
	logger.info('Event ', body);
	
	let date = new Date(body['date']);
	let time = ('0' + date.getHours()).slice(-2) + ':' + ('0' + date.getMinutes()).slice(-2);
	
	let magnitude = body['magnitude']['value'].toFixed(1);
	let uncertainty = body['magnitude']['uncertainty'];
	let type = body['magnitude']['type'];
	let city = body['city'];
	
	let text = `#terremoto alle ${time}\n\nEpicentro: ${city}\nMagnitudo: ${magnitude} ± ${uncertainty} (${type})`;
	
	async.waterfall([
		function(cb) {
			logger.info('Uploading to Twitter');
			
			// Remove epicentre details if the tweet would be too long
			if (text.length > 140) {
				text = `#terremoto alle ${time}\n\nMagnitudo: ${magnitude} ± ${uncertainty} (${type})`;
			}
			
			let options = {
				origin: body['origin'],
				text: text,
				buffer: buffer,
				date: date
			};
				
			networks.twitter.upload(options, (err) => {
				if (err) {
					logger.error(err);
					cb(err);
					return;
				}
				
				cb();
			});
		},
		
		function(cb) {
			logger.info('Uploading to Facebook');
			
			let options = {
				origin: body['origin'],
				text: text,
				buffer: buffer,
				date: date
			};
			
			networks.facebook.upload(options, (err) => {
				if (err) {
					logger.error(err);
				}
				
				logger.info('Done');
				cb();
			});
		}
	], done);
}
