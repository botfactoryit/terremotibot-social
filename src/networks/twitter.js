const Twit   = require('twit');
const config = require('../config')('twitter');

let tw = new Twit({
	consumer_key: config.consumerKey,
	consumer_secret: config.consumerSecret,
	access_token: config.accessToken,
	access_token_secret: config.accessTokenSecret
});

module.exports.upload = function upload(options, callback) {
	let b64 = options['buffer'].toString('base64');
	
	tw.post('media/upload', { media_data: b64 }, (err, data, response) => {
		if (err) {
			callback && callback(err);
			return;
		}
		
		let mediaId = data['media_id_string'];
		
		let params = {
			status: options['text'],
			lat: options['origin']['lat'],
			long: options['origin']['lon'],
			media_ids: [mediaId]
		};
		
		tw.post('statuses/update', params, (err, data, response) => {
			if (err) {
				callback && callback(err);
			}
			else {
				callback && callback(null, data);
			}
		});
	});
};
