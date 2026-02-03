import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

export default async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method not allowed' });
    }

    try {
        const { amount, name, email, phone, address, postal, city, personalization } = req.body;

        const paymentIntent = await stripe.paymentIntents.create({
            amount: amount,
            currency: 'eur',
            metadata: {
                customer_name: name,
                customer_email: email,
                customer_phone: phone,
                shipping_address: `${address}, ${postal} ${city}`,
                personalization: personalization || 'Sin personalización',
                product: 'Porta-Dardos Diana'
            },
            receipt_email: email
        });

        res.status(200).json({ clientSecret: paymentIntent.client_secret });
    } catch (error) {
        console.error('Payment error:', error);
        res.status(500).json({ error: error.message });
    }
}
