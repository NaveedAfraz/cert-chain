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

        // Define plan limits based on unified product tiers
        const getLimit = (planName) => {
            if (planName === 'ENTERPRISE') return Infinity;
            if (planName === 'PRO') return 1000;
            if (planName === 'BASIC') return 200;
            if (planName === 'TRIAL') return 100;
            return 10; // FREE plan default
        };

        let planName = 'FREE';

        // 2. Determine Effective Plan
        if (subs.length > 0) {
            const subscription = subs[0];
            // Check Expiry - if expired, fallback to FREE instead of rejecting immediately
            if (!subscription.expires_at || new Date() <= new Date(subscription.expires_at)) {
                planName = subscription.plan_name;
            }
        }

        const limit = getLimit(planName);

        // 3. Check Count Limits
        if (limit !== Infinity) {
            const [counts] = await db.query(
                'SELECT COUNT(*) as total FROM Certificates WHERE institution_id = ?',
                [institutionId]
            );

            if (counts[0].total >= limit) {
                return res.status(403).json({ 
                    message: `Plan limit reached (${limit} credentials on ${planName} plan). Please upgrade your subscription.`,
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
