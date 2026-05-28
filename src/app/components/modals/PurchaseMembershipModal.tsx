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
import { Check, Loader2 } from 'lucide-react';

interface Membership {
  id: string;
  name: string;
  price: number;
  duration: string;
  features: string[];
}

interface PurchaseMembershipModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  membership: Membership | null;
  onConfirm: (membershipId: string) => void;
}

export function PurchaseMembershipModal({
  open,
  onOpenChange,
  membership,
  onConfirm,
}: PurchaseMembershipModalProps) {
  const [isLoading, setIsLoading] = useState(false);

  if (!membership) return null;

  const handlePurchase = async () => {
    setIsLoading(true);
    await onConfirm(membership.id);
    setIsLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg bg-white">
        <DialogHeader>
          <DialogTitle className="text-gray-900">Покупка абонемента</DialogTitle>
          <DialogDescription className="text-gray-500">
            Подтвердите покупку выбранного абонемента
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 border-2 border-green-200">
          <div className="mb-6">
            <h3 className="text-2xl font-bold text-gray-900 mb-2">
              {membership.name}
            </h3>
            <div className="flex items-baseline gap-2">
              <span className="text-4xl font-bold text-green-600">
                {membership.price.toLocaleString()} ₽
              </span>
              <span className="text-gray-500">/ {membership.duration}</span>
            </div>
          </div>

          <div className="space-y-3">
            {membership.features.map((feature, index) => (
              <div key={index} className="flex items-start gap-3">
                <div className="bg-green-200 rounded-full p-1 mt-0.5">
                  <Check className="w-3 h-3 text-green-700" />
                </div>
                <span className="text-sm text-gray-700">{feature}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-gray-50 rounded-lg p-4 text-sm text-gray-600">
          <p>
            После подтверждения покупки с вашей карты будет списана сумма{' '}
            <span className="font-semibold text-gray-900">
              {membership.price.toLocaleString()} ₽
            </span>
          </p>
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
            onClick={handlePurchase}
            disabled={isLoading}
            className="w-full sm:w-auto bg-green-600 hover:bg-green-700 text-white"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Обработка...
              </>
            ) : (
              'Оплатить'
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}