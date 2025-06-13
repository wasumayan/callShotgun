import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export const authenticateToken = (req: Request, res: Response, next: NextFunction) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

    if (!token) {
        return res.status(401).json({ message: 'No token provided' });
    }

    try {
        const user = jwt.verify(token, process.env.JWT_SECRET || 'default_secret');
        (req as any).user = user;
        next();
    } catch (error) {
        return res.status(403).json({ message: 'Invalid token' });
    }
}; 