# Payment

The RA allows for payment. Currently, the following payment providers are supported:

- Stripe
- Paypal

## Stripe

Stripe is a powerful online payment platform that is also developer friendly.

To test locally with stripe, you should install the Stripe CLI. You can find instructions [here](https://stripe.com/docs/stripe-cli). The CLI allows you both detect incoming webhooks on your local machine as well as send test events to your webhook endpoint.

### Webhook Listener & Local Https

The Stripe CLI will throw an error that the CA is untrusted because we are using local https with a self-signed certificate. When using the `listen` command, make sure to use the `--skip-verify` flag:

```bash
stripe listen --forward-to https://localhost:3000/api/checkout/webhook --skip-verify
```

# Paypal

We also support Paypal as a payment processor using the `@paypal/react-paypal-js` library provided by PayPal.

Although Paypal supports webhooks, we are not using them. Instead, we pass the result from `onApprove` of the `PaypalButtons` to the webhooks.ts endpoint for final processing.
