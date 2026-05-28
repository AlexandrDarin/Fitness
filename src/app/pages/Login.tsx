import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dumbbell, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function Login() {
  const navigate = useNavigate();
  const { login, isLoading } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const success = await login(email, password);
    if (success) {
      // Для презентации: после логина ВСЕГДА идем на выбор роли!
      navigate("/role-select");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1771586791190-97ed536c54af?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBneW0lMjBlcXVpcG1lbnQlMjB0cmFpbmluZ3xlbnwxfHx8fDE3NzUwNjc2NjZ8MA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/90"></div>
      </div>

      {/* Login Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-card rounded-3xl p-8 md:p-10 border border-border shadow-2xl">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-primary p-3 rounded-xl">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-card-foreground">Wire Fitness</span>
              <span className="text-xs text-muted-foreground">Premium Club</span>
            </div>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-card-foreground mb-2">
              Вход в систему
            </h1>
            <p className="text-muted-foreground">
              Войдите в свой личный кабинет
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm mb-2 text-card-foreground">
                Email
              </label>
              <Input
                type="email"
                placeholder="your@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm mb-2 text-card-foreground">
                Пароль
              </label>
              <Input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                disabled={isLoading}
                minLength={6}
              />
            </div>

            <div className="flex items-center justify-between text-sm">
              <label className="flex items-center gap-2 text-muted-foreground cursor-pointer">
                <input type="checkbox" className="rounded" disabled={isLoading} />
                Запомнить меня
              </label>
              <a href="#" className="text-primary hover:underline">
                Забыли пароль?
              </a>
            </div>

            <Button type="submit" size="lg" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Вход...
                </>
              ) : (
                'Войти'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-muted-foreground">Нет аккаунта? </span>
            <Link to="/register" className="text-primary hover:underline font-semibold">
              Зарегистрироваться
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-border">
            <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors flex items-center justify-center">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}