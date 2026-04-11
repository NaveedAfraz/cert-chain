const db = require('../config/db');

const checkSubscriptionLimit = async (req, res, next) => {
    try {
        const institutionId = req.user.institutionId;

        if (!institutionId) {
            return res.status(403).json({ message: 'Institution identification required' });
        }

        // 1. Get Subscription info
        const [subs] = await db.query(
            'SELECT plan_name, expires_at FROM Subscriptions WHERE institution_id = ?',
            [institutionId]
        );

        if (subs.length === 0) {
            return res.status(403).json({ message: 'No active subscription found. Please contact support.' });
        }

        const subscription = subs[0];

        // 2. Check Expiry
        if (subscription.expires_at && new Date() > new Date(subscription.expires_at)) {
            return res.status(403).json({ message: 'Subscription expired. Please upgrade to continue issuing credentials.' });
        }

        // 3. Check Count Limits (For Trial and Basic)
        if (subscription.plan_name === 'TRIAL' || subscription.plan_name === 'BASIC') {
            const limit = subscription.plan_name === 'TRIAL' ? 100 : 500;
            
            const [counts] = await db.query(
                'SELECT COUNT(*) as total FROM Certificates WHERE institution_id = ?',
                [institutionId]
            );

            if (counts[0].total >= limit) {
                return res.status(403).json({ 
                    message: `Plan limit reached (${limit} credentials). Please upgrade your subscription to the PRO tier.`,
                    limitReached: true
                });
            }
        }

        next();
    } catch (error) {
        console.error('Subscription Check Error:', error);
        res.status(500).json({ message: 'Error verifying subscription limits' });
    }
};

module.exports = { checkSubscriptionLimit };
