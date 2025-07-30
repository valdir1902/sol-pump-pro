import { Router } from 'express';
import { SpinnerBotController } from '../controllers/SpinnerBotController';
import { authenticateToken } from '../middleware/auth';

const router = Router();

// Todas as rotas requerem autenticação
router.use(authenticateToken);

// Configurações do bot
router.get('/config', SpinnerBotController.getBotConfig);
router.put('/config', SpinnerBotController.updateBotConfig);

// Controle do bot
router.post('/start', SpinnerBotController.startBot);
router.post('/stop', SpinnerBotController.stopBot);
router.post('/reset', SpinnerBotController.resetBotTrades);

// Estatísticas e dados
router.get('/stats', SpinnerBotController.getBotStats);
router.get('/tokens/recommended', SpinnerBotController.getRecommendedTokens);
router.get('/tokens/new', SpinnerBotController.getNewTokens);
router.get('/tokens/hot', SpinnerBotController.getHotTokens);

export default router;