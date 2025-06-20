import { Router } from 'express';
import { AuthService } from '../services/AuthService';

const router = Router();
const authService = new AuthService();

router.post('/register', async (req, res) => {
  try {
    const { email, password, firstName, lastName } = req.body;
    const result = await authService.register({
      email,
      password,
      firstName,
      lastName
    });
    res.json(result);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await authService.login(email, password);
    res.json(result);
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
});

export default router; 