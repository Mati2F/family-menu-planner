import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Clock, Users } from "lucide-react";

const SAMPLE_DISHES = {
  breakfast: [
    { name: "Tostadas con Palta", time: "10 min", servings: 2 },
    { name: "Huevos Revueltos", time: "15 min", servings: 2 },
    { name: "Pancakes", time: "20 min", servings: 4 },
    { name: "Avena con Frutas", time: "5 min", servings: 2 },
    { name: "Yogurt con Granola", time: "5 min", servings: 1 },
  ],
  lunch: [
    { name: "Pollo al Horno con Papas", time: "45 min", servings: 4 },
    { name: "Pasta con Salsa de Tomate", time: "25 min", servings: 4 },
    { name: "Ensalada César", time: "15 min", servings: 2 },
    { name: "Arroz con Verduras", time: "30 min", servings: 4 },
    { name: "Sándwich de Atún", time: "10 min", servings: 2 },
    { name: "Sopa de Lentejas", time: "40 min", servings: 6 },
  ],
  dinner: [
    { name: "Salmón a la Plancha", time: "20 min", servings: 2 },
    { name: "Pizza Casera", time: "35 min", servings: 4 },
    { name: "Ensalada de Quinoa", time: "15 min", servings: 3 },
    { name: "Tacos de Pollo", time: "25 min", servings: 4 },
    { name: "Sopa de Verduras", time: "30 min", servings: 4 },
    { name: "Milanesas con Puré", time: "35 min", servings: 4 },
  ]
};

interface MealSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dish: string) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
}

export const MealSelector = ({ isOpen, onClose, onSelect, mealType }: MealSelectorProps) => {
  const dishes = SAMPLE_DISHES[mealType] || [];
  
  const mealTitles = {
    breakfast: "Desayuno",
    lunch: "Almuerzo", 
    dinner: "Cena"
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-center">
            Seleccionar {mealTitles[mealType]}
          </DialogTitle>
        </DialogHeader>
        
        <ScrollArea className="max-h-[400px]">
          <div className="space-y-3 p-1">
            {dishes.map((dish, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-accent/50 transition-colors"
                onClick={() => onSelect(dish.name)}
              >
                <span className="font-medium text-left">{dish.name}</span>
                <div className="flex gap-3 text-sm text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{dish.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{dish.servings} personas</span>
                  </div>
                </div>
              </Button>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};