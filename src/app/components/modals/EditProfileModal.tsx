import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "../ui/dialog";
import { Button } from "../ui/button";
import { Input } from "../ui/input";
import { Label } from "../ui/label";
import { Loader2 } from 'lucide-react';

interface ProfileData {
  name: string;
  email: string;
  phone: string;
  birthDate: string;
}

interface EditProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  initialData: ProfileData;
  onSave: (data: ProfileData) => void;
}

export function EditProfileModal({
  open,
  onOpenChange,
  initialData,
  onSave,
}: EditProfileModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState<ProfileData>(initialData);

  const handleSave = async () => {
    setIsLoading(true);
    await onSave(formData);
    setIsLoading(false);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Редактирование профиля</DialogTitle>
          <DialogDescription className="text-gray-500">
            Обновите информацию вашего профиля
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-gray-700">Имя</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              disabled={isLoading}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="email" className="text-gray-700">Email</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              disabled={isLoading}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="phone" className="text-gray-700">Телефон</Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
              disabled={isLoading}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="birthDate" className="text-gray-700">Дата рождения</Label>
            <Input
              id="birthDate"
              type="date"
              value={formData.birthDate}
              onChange={(e) => setFormData({ ...formData, birthDate: e.target.value })}
              disabled={isLoading}
              className="bg-gray-50 border-gray-300 text-gray-900"
            />
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto text-gray-700 border-gray-300"
          >
            Отмена
          </Button>
          <Button
            onClick={handleSave}
            disabled={isLoading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Сохранение...
              </>
            ) : (
              'Сохранить'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}