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
        const { name, email, phone, address, postal, city, personalization, amount } = req.body;

        // Generate order ID
        const orderId = 'COD-' + Date.now() + '-' + Math.random().toString(36).substr(2, 9).toUpperCase();

        // In production, save to database and send email notification
        console.log('COD Order:', {
            orderId,
            customer: { name, email, phone },
            shipping: { address, postal, city },
            personalization: personalization || 'Sin personalización',
            amount: amount / 100 + '€',
            product: 'Porta-Dardos Diana',
            paymentMethod: 'Contrareembolso',
            createdAt: new Date().toISOString()
        });

        res.status(200).json({ orderId });
    } catch (error) {
        console.error('Order error:', error);
        res.status(500).json({ error: error.message });
    }
}
