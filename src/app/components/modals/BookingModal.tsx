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
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Подтверждение записи</DialogTitle>
          <DialogDescription>
            Вы записываетесь на тренировку
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-secondary rounded-xl p-6 space-y-4">
          <div>
            <h3 className="font-semibold text-lg text-card-foreground mb-2">
              {training.title}
            </h3>
          </div>
          
          <div className="space-y-3 text-sm">
            <div className="flex items-center gap-3 text-muted-foreground">
              <User className="w-4 h-4" />
              <span>Тренер: {training.trainer}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Calendar className="w-4 h-4" />
              <span>{training.date}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <Clock className="w-4 h-4" />
              <span>{training.time}</span>
            </div>
            <div className="flex items-center gap-3 text-muted-foreground">
              <MapPin className="w-4 h-4" />
              <span>{training.location}</span>
            </div>
            {training.spots !== undefined && (
              <div className="bg-primary/10 rounded-lg p-3 mt-4">
                <div className="text-xs text-muted-foreground mb-1">Свободно мест</div>
                <div className="text-lg font-bold text-primary">{training.spots}</div>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="flex-col sm:flex-row gap-2">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isLoading}
            className="w-full sm:w-auto"
          >
            Отмена
          </Button>
          <Button
            onClick={handleConfirm}
            disabled={isLoading}
            className="w-full sm:w-auto"
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