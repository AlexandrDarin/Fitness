import { Link, useNavigate } from "react-router";
import { Button } from "./ui/button";
import { Dumbbell, Menu, X, User } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../contexts/AuthContext";

export function Header() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    setMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleDashboardClick = () => {
    if (user?.role) {
      navigate(`/${user.role}`);
    } else {
      navigate('/role-select');
    }
  };

  // Оставляем только нужные пункты
  const menuItems = [
    { label: 'Направления', id: 'directions' },
    { label: 'Тренеры', id: 'trainers' },
    { label: 'Абонементы', id: 'memberships' },
    { label: 'Галерея', id: 'gallery' },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background/95 backdrop-blur-sm border-b border-border">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="flex items-center justify-between gap-4 h-16 lg:h-20">
          
          {/* Logo - слева */}
          <Link to="/" className="flex items-center gap-3 group shrink-0">
            <div className="bg-primary p-2 rounded-xl group-hover:scale-105 transition-transform">
              <Dumbbell className="w-5 h-5 lg:w-6 lg:h-6 text-primary-foreground" />
            </div>
            <div className="flex flex-col">
              <span className="text-lg lg:text-xl font-bold text-foreground">Wire Fitness</span>
              <span className="text-[10px] lg:text-xs text-muted-foreground">Premium Club</span>
            </div>
          </Link>

          {/* Desktop Navigation - по центру */}
          <nav className="hidden lg:flex items-center justify-center gap-1 xl:gap-2 flex-1">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => scrollToSection(item.id)}
                className="px-3 xl:px-4 py-2 text-sm font-medium text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all whitespace-nowrap"
              >
                {item.label}
              </button>
            ))}
          </nav>

          {/* Desktop Actions - только вход/регистрация/профиль */}
          <div className="hidden lg:flex items-center gap-2 shrink-0">
            {isAuthenticated ? (
              <Button 
                variant="ghost" 
                onClick={handleDashboardClick}
                className="text-foreground"
              >
                <User className="w-4 h-4 mr-2" />
                {user?.name}
              </Button>
            ) : (
              <>
                <Button 
                  variant="ghost" 
                  onClick={() => navigate('/login')}
                  className="text-foreground"
                >
                  Войти
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => navigate('/register')}
                >
                  Зарегистрироваться
                </Button>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="lg:hidden p-2 text-foreground hover:bg-secondary rounded-lg transition-colors shrink-0"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden py-4 border-t border-border">
            <nav className="flex flex-col gap-1">
              {menuItems.map((item) => (
                <button
                  key={item.id}
                  onClick={() => scrollToSection(item.id)}
                  className="px-4 py-3 text-left text-foreground/80 hover:text-foreground hover:bg-secondary/50 rounded-lg transition-all"
                >
                  {item.label}
                </button>
              ))}
              <div className="flex flex-col gap-2 mt-4 pt-4 border-t border-border">
                {isAuthenticated ? (
                  <Button 
                    variant="ghost" 
                    onClick={() => { setMobileMenuOpen(false); handleDashboardClick(); }}
                    className="w-full justify-start gap-2"
                  >
                    <User className="w-4 h-4" />
                    {user?.name}
                  </Button>
                ) : (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={() => { setMobileMenuOpen(false); navigate('/login'); }}
                      className="w-full justify-start"
                    >
                      Войти
                    </Button>
                    <Button 
                      variant="outline" 
                      onClick={() => { setMobileMenuOpen(false); navigate('/register'); }}
                      className="w-full justify-start"
                    >
                      Зарегистрироваться
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}