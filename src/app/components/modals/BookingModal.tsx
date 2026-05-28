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
import { Calendar, Clock, MapPin, User, Loader2 } from 'lucide-react';

interface BookingModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  training: {
    title: string;
    trainer: string;
    date: string;
    time: string;
    location: string;
    spots?: number;
  };
  onConfirm: () => void;
}

export function BookingModal({
  open,
  onOpenChange,
  training,
  onConfirm,
}: BookingModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleConfirm = async () => {
    setIsLoading(true);
    await onConfirm();
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Подтверждение записи</DialogTitle>
          <DialogDescription className="text-gray-500">
            Вы записываетесь на тренировку
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gray-50 rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {training.title}
            </h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-gray-600">
              <User className="w-4 h-4" />
              <span>Тренер: {training.trainer}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Calendar className="w-4 h-4" />
              <span>{training.date}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <Clock className="w-4 h-4" />
              <span>{training.time}</span>
            </div>
            <div className="flex items-center gap-3 text-gray-600">
              <MapPin className="w-4 h-4" />
              <span>{training.location}</span>
            </div>
            {training.spots !== undefined && (
              <div className="bg-green-50 rounded-lg p-3 mt-4">
                <div className="text-xs text-gray-500 mb-1">Свободно мест</div>
                <div className="text-lg font-bold text-green-600">{training.spots}</div>
              </div>
            )}
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
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Записываем...
              </>
            ) : (
              'Подтвердить запись'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}