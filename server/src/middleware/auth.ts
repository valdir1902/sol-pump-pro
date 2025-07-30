import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

interface JwtPayload {
  userId: string;
  email: string;
}

export const authenticateToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1]; // Bearer TOKEN

  if (!token) {
    res.status(401).json({ error: 'Token de acesso requerido' });
    return;
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'default-secret') as JwtPayload;
    (req as any).userId = decoded.userId;
    (req as any).userEmail = decoded.email;
    next();
  } catch (error) {
    console.error('Erro na verificação do token:', error);
    res.status(403).json({ error: 'Token inválido' });
  }
};