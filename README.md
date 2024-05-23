# stripe-webhook
The stripe webhook get called when a customer buys a products from ![SuperM](https://supermarkets123.netlify.app/)(online groceries store) and saved transactions details in firebase.

## How It's Made:

**Tech used:** Nodejs and Ngrok

## Installation:

1. Clone repo
1. run `cp .env.example .env` and enter your stripe webhook endpoint and secret keys.
1. go to firebase console to generate your service account key and copy the file inside the project root directory. "Settings > Service Accounts"
1. rename the new file to `serviceAccountKey.json`
1. run `yarn install`

## Usage:

1. run `yarn start`
1. run ngrok on port 4242
1. copy your ngrok endpoint to stripe webhook url. e.g `ngrokEndpoint/webhook`
1. add webhook event type "payment_intent.succeeded"
1. then save

Note: for production update the stripe webhook url to productions url. Don't forget to add `/webhook` to the endpoint