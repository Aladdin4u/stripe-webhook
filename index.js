const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");
const { getUser, createTransaction } = require("./firebase");

const app = express();
dotenv.config();

const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

app.use(cors());
const endpointSecret = process.env.ENDPOINTSECRET;

app.get("/", (req, res) => {
  res.send("welcome to supermarket webhook");
});

app.post(
  "/webhook",
  express.raw({ type: "application/json" }),
  async (request, response) => {
    const sig = request.headers["stripe-signature"];

    let event;

    try {
      event = stripe.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (err) {
      response.status(400).send(`Webhook Error: ${err.message}`);
      return;
    }

    // Handle the event
    switch (event.type) {
      case "payment_intent.succeeded":
        const paymentIntentSucceeded = event.data.object;
        const email = paymentIntentSucceeded.receipt_email;
        const chargeId = paymentIntentSucceeded.latest_charge;
        const charge = await stripe.charges.retrieve(chargeId);
        try {
          const user = await getUser(email);
          if (user) {
            await createTransaction(user, charge.receipt_url);
          }
        } catch (error) {
          console.log(error);
        }
        // Then define and call a function to handle the event payment_intent.succeeded
        break;
      // ... handle other event types
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.send();
  }
);

app.use(express.json());

app.listen(4242, () => console.log("Running on port 4242"));
