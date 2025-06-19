import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// This would normally come from a database
const users: any[] = [];

export const registerUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password, name } = req.body;
        
        // Check if user exists
        if (users.find(u => u.email === email)) {
            res.status(400).json({ message: 'User already exists' });
            return;
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create user
        const user = {
            id: users.length + 1,
            email,
            name,
            password: hashedPassword
        };
        
        users.push(user);
        
        res.status(201).json({ message: 'User created successfully' });
    } catch (error) {
        next(error);
    }
};

export const loginUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const { email, password } = req.body;
        
        // Find user
        const user = users.find(u => u.email === email);
        if (!user) {
            res.status(400).json({ message: 'User not found' });
            return;
        }

        // Check password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) {
            res.status(400).json({ message: 'Invalid password' });
            return;
        }

        // Create token
        const token = jwt.sign(
            { userId: user.id },
            process.env.JWT_SECRET || 'default_secret',
            { expiresIn: '24h' }
        );

        res.json({ token });
    } catch (error) {
        next(error);
    }
};

export const getUserProfile = async (req: Request, res: Response, next: NextFunction) => {
    try {
        // req.user is set by the auth middleware
        const user = users.find(u => u.id === (req as any).user.userId);
        if (!user) {
            res.status(404).json({ message: 'User not found' });
            return;
        }

        // Don't send password
        const { password, ...userWithoutPassword } = user;
        res.json(userWithoutPassword);
    } catch (error) {
        next(error);
    }
}; 