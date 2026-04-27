import { useNavigate, Link } from "react-router";
import { Button } from "../components/ui/button";
import { User, Dumbbell as DumbbellIcon, Shield } from "lucide-react";
import { Dumbbell } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";

export default function RoleSelect() {
  const navigate = useNavigate();
  const { user, setUser } = useAuth();

  const handleRoleSelect = (role: 'client' | 'trainer' | 'admin', path: string) => {
    if (user) {
      setUser({ ...user, role });
      navigate(path);
    }
  };

  const roles = [
    {
      id: "client",
      title: "Клиент",
      description: "Личный кабинет для управления тренировками и абонементом",
      icon: User,
      path: "/client",
      color: "primary",
    },
    {
      id: "trainer",
      title: "Тренер",
      description: "Кабинет тренера для работы с клиентами и расписанием",
      icon: DumbbellIcon,
      path: "/trainer",
      color: "primary",
    },
    {
      id: "admin",
      title: "Администратор",
      description: "Панель управления клубом и аналитика",
      icon: Shield,
      path: "/admin",
      color: "primary",
    },
  ];

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1766031263281-43cdaa6e624a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxtb2Rlcm4lMjBmaXRuZXNzJTIwY2x1YiUyMGV4dGVyaW9yJTIwYnVpbGRpbmd8ZW58MXx8fHwxNzc1MDY3NjY2fDA&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-background/90"></div>
      </div>

      {/* Role Selection */}
      <div className="relative z-10 w-full max-w-4xl">
        <div className="text-center mb-12">
          {/* Logo */}
          <Link to="/" className="inline-flex items-center gap-3 mb-8">
            <div className="bg-primary p-3 rounded-xl">
              <Dumbbell className="w-7 h-7 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-foreground">ECO FITNESS</span>
              <span className="text-xs text-muted-foreground">Premium Club</span>
            </div>
          </Link>

          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            Выберите роль
          </h1>
          <p className="text-lg text-muted-foreground">
            Перейдите в нужный раздел системы
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <div
                key={role.id}
                className="bg-card rounded-3xl p-8 border border-border hover:border-primary/50 transition-all duration-300 group cursor-pointer"
                onClick={() => handleRoleSelect(role.id as 'client' | 'trainer' | 'admin', role.path)}
              >
                <div className="flex flex-col items-center text-center">
                  <div className="bg-primary/10 w-20 h-20 rounded-2xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                    <Icon className="w-10 h-10 text-primary" />
                  </div>
                  <h3 className="text-2xl font-bold text-card-foreground mb-3">
                    {role.title}
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    {role.description}
                  </p>
                  <Button 
                    className="w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleRoleSelect(role.id as 'client' | 'trainer' | 'admin', role.path);
                    }}
                  >
                    Войти как {role.title}
                  </Button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-12 text-center">
          <Link to="/" className="text-muted-foreground hover:text-primary transition-colors">
            ← Вернуться на главную
          </Link>
        </div>
      </div>
    </div>
  );
}