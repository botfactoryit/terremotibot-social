# terremotibot-social

Integration for [TerremotiBot](https://github.com/botfactoryit/terremotibot).

Receives earthquakes details and image cards through [Amazon SQS](https://aws.amazon.com/sqs/) for every 'big' earthquake, and publishes text and image to Twitter and Facebook.

## How to run

```js
node index.js
```

But before...

## Configuration

A `config.json` file should be placed in the `src/config` directory. The template for the configuration file is `example.config.json`.

| Key | Required | Explanation |
| --- | -------- | ----------- |
| `sqs.*` | Yes | [Amazon SQS](https://aws.amazon.com/sqs/) queue configuration |
| `facebook.accessToken` | Yes | Generate a permanent access token for the page you want to publish to. See [Facebook docs](https://developers.facebook.com/docs/marketing-api/authentication) or [StackOverflow](http://stackoverflow.com/questions/17197970/facebook-permanent-page-access-token) |
| `facebook.pageId`| Yes | The ID of the page you want to publish the post to |
| `twitter.*` | Yes | Twitter keys |
