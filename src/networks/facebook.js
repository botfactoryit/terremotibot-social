const FB     = require('fb');
const config = require('../config')('facebook');

let fb = new FB.Facebook();

fb.setAccessToken(config.accessToken);

module.exports.upload = function(options, callback) {
	let req = {
		source: {
			value: options['buffer'],
			options: {
				contentType: 'image/jpeg',
				filename: 'terremoto.jpg' // because facebook
			}
		},
		backdated_time: Math.round(options['date'].getTime() / 1000),
		caption: options['text']
	};
	
	fb.api(config.pageId + '/photos', 'post', req, (res) => {
		if (res.error) {
			callback && callback(res.error);
		}
		else {
			callback && callback(null, res);
		}
	});
};
