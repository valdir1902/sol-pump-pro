import { startServer } from './app';

// Iniciar o servidor
startServer().catch((error) => {
  console.error('❌ Falha ao iniciar servidor:', error);
  process.exit(1);
});