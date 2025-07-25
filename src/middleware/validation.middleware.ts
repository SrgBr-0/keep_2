import { Request, Response, NextFunction } from 'express';

export function validateEmail(req: Request, res: Response, next: NextFunction) {
    const { email } = req.body;

    if (!email || typeof email !== 'string') {
        return res.status(400).json({ error: 'Email is required' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        return res.status(400).json({ error: 'Invalid email format' });
    }

    next();
}

export function validateCode(req: Request, res: Response, next: NextFunction) {
    const { code } = req.body;

    if (!code || typeof code !== 'string') {
        return res.status(400).json({ error: 'Code is required' });
    }

    if (!/^\d{6}$/.test(code)) {
        return res.status(400).json({ error: 'Code must be 6 digits' });
    }

    next();
}

export function rateLimiter(windowMs: number, maxRequests: number) {
    const requests = new Map();

    return (req: Request, res: Response, next: NextFunction) => {
        const key = req.body.email || req.ip;
        const now = Date.now();
        const windowStart = now - windowMs;

        if (!requests.has(key)) {
            requests.set(key, []);
        }

        const userRequests = requests.get(key);
        const validRequests = userRequests.filter((time: number) => time > windowStart);

        if (validRequests.length >= maxRequests) {
            return res.status(429).json({
                error: 'Too many requests. Please try again later.'
            });
        }

        validRequests.push(now);
        requests.set(key, validRequests);
        next();
    };
}