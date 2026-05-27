import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { Button } from "../components/ui/button";
import { Input } from "../components/ui/input";
import { Dumbbell, Loader2 } from "lucide-react";
import { useAuth } from "../contexts/AuthContext";
import { PrivacyModal, OfferModal } from "../components/ui/Modals";

export default function Register() {
  const navigate = useNavigate();
  const { register, isLoading } = useAuth();
  const [showPrivacy, setShowPrivacy] = useState(false);
  const [showRules, setShowRules] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrors({});

    // Validation
    const newErrors: Record<string, string> = {};

    if (formData.password.length < 6) {
      newErrors.password = 'Пароль должен содержать минимум 6 символов';
    }

    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Пароли не совпадают';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const fullName = `${formData.firstName} ${formData.lastName}`;
    const success = await register(fullName, formData.email, formData.password, formData.phone);
    
    if (success) {
      navigate("/role-select");
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 py-12">
      {/* Background */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1772206605293-3fadeaa944e1?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxncm91cCUyMGZpdG5lc3MlMjBjbGFzcyUyMGV4ZXJjaXNlfGVufDF8fHx8MTc3NTA2NzY2N3ww&ixlib=rb-4.1.0&q=80&w=1080&utm_source=figma&utm_medium=referral"
          alt="Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/80"></div>
      </div>

      {/* Register Form */}
      <div className="relative z-10 w-full max-w-md">
        <div className="bg-white rounded-3xl p-8 md:p-10 shadow-2xl">
          {/* Logo */}
          <Link to="/" className="flex items-center justify-center gap-3 mb-8">
            <div className="bg-green-600 p-3 rounded-xl">
              <Dumbbell className="w-7 h-7 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-2xl font-bold text-gray-900">Wire Fitness</span>
              <span className="text-xs text-gray-500">Premium Club</span>
            </div>
          </Link>

          <div className="mb-8 text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Регистрация
            </h1>
            <p className="text-gray-600">
              Создайте аккаунт для начала тренировок
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Имя *
                </label>
                <Input
                  type="text"
                  name="firstName"
                  placeholder="Иван"
                  value={formData.firstName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Фамилия *
                </label>
                <Input
                  type="text"
                  name="lastName"
                  placeholder="Иванов"
                  value={formData.lastName}
                  onChange={handleChange}
                  required
                  disabled={isLoading}
                  className="bg-gray-50 border-gray-300 text-gray-900"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Email *
              </label>
              <Input
                type="email"
                name="email"
                placeholder="your@email.com"
                value={formData.email}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Телефон *
              </label>
              <Input
                type="tel"
                name="phone"
                placeholder="+7 (___) ___-__-__"
                value={formData.phone}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-gray-50 border-gray-300 text-gray-900"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Пароль *
              </label>
              <Input
                type="password"
                name="password"
                placeholder="••••••••"
                value={formData.password}
                onChange={handleChange}
                required
                disabled={isLoading}
                minLength={6}
                className="bg-gray-50 border-gray-300 text-gray-900"
              />
              {errors.password && (
                <p className="text-sm text-red-500 mt-1">{errors.password}</p>
              )}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Подтвердите пароль *
              </label>
              <Input
                type="password"
                name="confirmPassword"
                placeholder="••••••••"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                disabled={isLoading}
                className="bg-gray-50 border-gray-300 text-gray-900"
              />
              {errors.confirmPassword && (
                <p className="text-sm text-red-500 mt-1">{errors.confirmPassword}</p>
              )}
            </div>

            <div className="flex items-start gap-2 text-sm">
              <input type="checkbox" className="rounded mt-1 border-gray-300" required disabled={isLoading} />
              <label className="text-gray-600">
                Я согласен с{" "}
                <button 
                  type="button"
                  onClick={() => setShowPrivacy(true)} 
                  className="text-green-600 hover:underline font-medium"
                >
                  политикой конфиденциальности
                </button>{" "}
                и{" "}
                <button 
                  type="button"
                  onClick={() => setShowRules(true)} 
                  className="text-green-600 hover:underline font-medium"
                >
                  правилами клуба
                </button>
              </label>
            </div>

            <Button 
              type="submit" 
              size="lg" 
              className="w-full bg-green-600 hover:bg-green-700 text-white"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin mr-2" />
                  Регистрация...
                </>
              ) : (
                'Зарегистрироваться'
              )}
            </Button>
          </form>

          <div className="mt-6 text-center text-sm">
            <span className="text-gray-600">Уже есть аккаунт? </span>
            <Link to="/login" className="text-green-600 hover:underline font-semibold">
              Войти
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <Link to="/" className="text-sm text-gray-500 hover:text-green-600 transition-colors flex items-center justify-center">
              ← Вернуться на главную
            </Link>
          </div>
        </div>
      </div>

      {/* Модальные окна */}
      <PrivacyModal isOpen={showPrivacy} onClose={() => setShowPrivacy(false)} />
      <OfferModal isOpen={showRules} onClose={() => setShowRules(false)} />
    </div>
  );
}