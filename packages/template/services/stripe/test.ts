export const testJs = `const Stripe = require('stripe');

// Initialize with a fake key and point to the mock server
// The mock server accepts any API key
const stripe = new Stripe('sk_test_mock_123', {
  host: 'localhost',
  port: 12111,
  protocol: 'http',
});

(async () => {
    console.log('Connecting to Local Stripe Mock at http://localhost:12111...');

    try {
        // 1. Create a Customer
        console.log('\\n1. Creating a mock customer...');
        const customer = await stripe.customers.create({
            email: 'jane.doe@example.com',
            name: 'Jane Doe',
            description: 'My First Mock Customer'
        });
        console.log('✅ Customer created:', customer.id);
        console.log('   Email:', customer.email);

        // 2. Create a Product
        console.log('\\n2. Creating a mock product...');
        const product = await stripe.products.create({
            name: 'Gold Special',
            description: 'One-time gold plan',
        });
        console.log('✅ Product created:', product.id);

        // 3. Create a Price
        console.log('\\n3. Creating a price for the product...');
        const price = await stripe.prices.create({
            unit_amount: 2000,
            currency: 'usd',
            product: product.id,
        });
        console.log('✅ Price created:', price.id);

        // 4. Create a Payment Intent
        console.log('\\n4. Creating a payment intent...');
        const paymentIntent = await stripe.paymentIntents.create({
            amount: 2000,
            currency: 'usd',
            payment_method_types: ['card'],
            customer: customer.id,
        });
        console.log('✅ Payment Intent created:', paymentIntent.id);
        console.log('   Status:', paymentIntent.status); // likely 'requires_payment_method' in mock

        console.log('\\n🎉 Success! You are successfully talking to the local Stripe Mock.');
        console.log('For more examples, try running other Stripe API commands.');

    } catch (err) {
        console.error('❌ Error interacting with Stripe Mock:', err.message);
        console.error('Make sure the docker container is running with: npm run start');
    }
})();
`;
