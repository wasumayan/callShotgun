import { Request, Response } from 'express';

export const sendMessage = async (req: Request, res: Response) => {
  // TODO: Implement send message
  res.json({ message: 'Message sent (stub)' });
};

export const getGroupMessages = async (req: Request, res: Response) => {
  // TODO: Implement fetch group messages
  res.json([]);
};

export const getDirectMessages = async (req: Request, res: Response) => {
  // TODO: Implement fetch direct messages
  res.json([]);
}; 