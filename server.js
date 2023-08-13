import express from "express";
import dotenv from "dotenv";
import exp from "constants";
import Stripe from "stripe";

// loading variables
dotenv.config();

// start server
const app = express();

app.use(express.static("public"));
app.use(express.json());


// home route
app.get("/", (req, res) => {
    res.sendFile("albekantstore.html", { root: "public" });
});

// successful payment
app.get("/successfulpayment", (req, res) => {
    res.sendFile("successfulpayment.html", { root: "public" });
});
// cancelled payment
app.get("/cancelledpayment", (req, res) => {
    res.sendFile("cancelledpayment.html", { root: "public" });
});

// Stripe
let stripeGateway = Stripe(process.env.stripe_api);
let DOMAIN = process.env.DOMAIN;

app.post("/stripe-checkout", async(req, res) => {
    const lineItems = req.body.items.map((item) => {
        const unitAmount = parseInt(item.price.replace(/[^0-9.-]+/g, "") * 100);
        console.log("item-price:", item.price);
        console.log("unitAmount:", unitAmount);
        return {
            price_data: {
                currency: "usd",
                product_data: {
                    name: item.title,
                    images: [item.productImg],
                },
                unit_amount: unitAmount,
            },
            quantity: item.quantity,
        };
    });
    console.log("lineItems:", lineItems);

    // creating a checkout session
    const session = await stripeGateway.checkout.sessions.create({
        payment_method_types: ["card"],
        mode: "payment",
        success_url: `${DOMAIN}/successfulpayment`,
        cancel_url: `${DOMAIN}/cancelledpayment`,
        line_items: lineItems,
        // asking for address in Stripe checkout page
        billing_address_collection: "required",
    });
    res.json(session.url);
});

app.listen(3000, () => {
    console.log("listening on port 3000;");
});