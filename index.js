import { config } from "dotenv";
config();
import writeUserData from "./firebase.js";
import Stripe from "stripe";
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
import express, { json, raw } from "express";
import cors from "cors";
const app = express();
app.use(cors());
app.use(json());
// This is your Stripe CLI webhook secret for testing your endpoint locally.
const endpointSecret = process.env.ENDPOINTSECRET;
const rep = {
  "receipt": {
    "store": {
      "name": "Microsoft Merchandise Store",
      "address": "359 KESLER MILL RD SALEM, VA 2413 5403890014",
      "webpage": "https://shop.googlemerchandisestore.com"
    },
    "order": {
      "dateTime": "2017-11-13T15:54:00.000Z",
      "id": "DYJB1QCD4ZS6C",
      "employee": "Hector"
    },
    "purchasedItems": [
      {
        "name": "Zestaw obiadowy",
        "quantity": 1,
        "price": "17.99"
      }
    ],
    "currency": "USD"
  }
}
// writeUserData(rep);

app.get("/", (req, res) => {
  res.send("welcome to supermarket webhook");
});
app.post("/webhook", raw({ type: "application/json" }), (request, response) => {
  const sig = request.headers["stripe-signature"];

  let event;
  let receipt = {};
  let checkoutSessionCompleted, paymentIntentCompleted;

  try {
    event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
  } catch (err) {
    response.status(400).send(`Webhook Error: ${err.message}`);
    return;
  }

  // Handle the event
  switch (event.type) {
    case "checkout.session.completed":
      checkoutSessionCompleted = event.data.object;
      console.log(checkoutSessionCompleted);

      // Then define and call a function to handle the event checkout.session.completed
      break;
    case "payment_intent.succeeded":
      paymentIntentCompleted = event.data.object;
      console.log(paymentIntentCompleted);
      // Then define and call a function to handle the event checkout.session.completed
      break;
    // ... handle other event types
    default:
      console.log(`Unhandled event type ${event.type}`);
  }

  receipt = {
    checkout: checkoutSessionCompleted,
    payment: paymentIntentCompleted,
  };

  // Return a 200 response to acknowledge receipt of the event
  writeUserData(receipt);
  response.json(receipt);
});

app.listen(4242, () => console.log("Running on port 4242"));
