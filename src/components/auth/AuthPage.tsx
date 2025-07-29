import { useState } from "react";
import { LoginForm } from "./LoginForm";
import { SignupForm } from "./SignupForm";
import spinnerLogo from "@/assets/spinner-logo.jpg";

export const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-6xl grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
        {/* Hero Section */}
        <div className="text-center lg:text-left space-y-6">
          <div className="space-y-4">
            <img 
              src={spinnerLogo} 
              alt="Spinner Bot" 
              className="h-20 mx-auto lg:mx-0 rounded-lg shadow-glow"
            />
            <h1 className="text-4xl lg:text-6xl font-bold">
              <span className="bg-gradient-primary bg-clip-text text-transparent">
                Spinner Bot
              </span>
            </h1>
            <p className="text-xl text-muted-foreground max-w-lg">
              Bot avançado para operações automatizadas na rede Solana com tokens recém-listados no PumpFun
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8">
            <div className="bg-gradient-card p-4 rounded-lg border border-border/50 shadow-card">
              <div className="text-2xl font-bold text-accent">⚡</div>
              <h3 className="font-semibold mt-2">Operações Rápidas</h3>
              <p className="text-sm text-muted-foreground">Execução instantânea de trades</p>
            </div>
            <div className="bg-gradient-card p-4 rounded-lg border border-border/50 shadow-card">
              <div className="text-2xl font-bold text-accent">🔒</div>
              <h3 className="font-semibold mt-2">Carteira Segura</h3>
              <p className="text-sm text-muted-foreground">Carteira única por usuário</p>
            </div>
            <div className="bg-gradient-card p-4 rounded-lg border border-border/50 shadow-card">
              <div className="text-2xl font-bold text-accent">📊</div>
              <h3 className="font-semibold mt-2">Analytics</h3>
              <p className="text-sm text-muted-foreground">Dados em tempo real</p>
            </div>
          </div>
        </div>

        {/* Auth Form */}
        <div className="flex justify-center">
          {isLogin ? (
            <LoginForm onToggleMode={() => setIsLogin(false)} />
          ) : (
            <SignupForm onToggleMode={() => setIsLogin(true)} />
          )}
        </div>
      </div>
    </div>
  );
};