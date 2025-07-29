import { Router } from 'express';
import { WalletController } from '../controllers/WalletController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

router.get('/balance', WalletController.getBalance);
router.post('/withdraw', WalletController.withdraw);
router.get('/deposit-address', WalletController.getDepositAddress);
router.post('/validate-address', WalletController.validateAddress);
router.get('/transactions', WalletController.getTransactions);
router.get('/transactions/:signature', WalletController.getTransaction);

export default router;