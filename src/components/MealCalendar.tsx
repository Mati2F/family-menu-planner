import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Coffee, Sun, Moon, Plus } from "lucide-react";
import { MealSelector } from "./MealSelector";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MEALS = {
  breakfast: { name: "Desayuno", icon: Coffee, color: "bg-gradient-warm" },
  lunch: { name: "Almuerzo", icon: Sun, color: "bg-gradient-fresh" },
  dinner: { name: "Cena", icon: Moon, color: "bg-primary" }
} as const;

type MealType = keyof typeof MEALS;

interface MealData {
  [key: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

interface MealCalendarProps {
  onMealsChange: (meals: MealData) => void;
}

export const MealCalendar = ({ onMealsChange }: MealCalendarProps) => {
  const [meals, setMeals] = useState<MealData>({});
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; meal: MealType } | null>(null);

  const handleMealSelect = (dish: string) => {
    if (!selectedSlot) return;
    
    const updatedMeals = {
      ...meals,
      [selectedSlot.day]: {
        ...meals[selectedSlot.day],
        [selectedSlot.meal]: dish
      }
    };
    
    setMeals(updatedMeals);
    onMealsChange(updatedMeals);
    setSelectedSlot(null);
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <Card key={day} className="p-4 shadow-card">
            <h3 className="font-semibold text-center mb-4 text-foreground">{day}</h3>
            <div className="space-y-3">
              {Object.entries(MEALS).map(([mealKey, meal]) => {
                const MealIcon = meal.icon;
                const selectedDish = meals[day]?.[mealKey as MealType];
                
                return (
                  <div key={mealKey} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${meal.color}`}>
                        <MealIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {meal.name}
                      </span>
                    </div>
                    <Button 
                      variant={selectedDish ? "secondary" : "outline"}
                      className="w-full h-auto p-3 text-left justify-start"
                      onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                    >
                      {selectedDish ? (
                        <span className="text-sm">{selectedDish}</span>
                      ) : (
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Agregar plato</span>
                        </div>
                      )}
                    </Button>
                  </div>
                );
              })}
            </div>
          </Card>
        ))}
      </div>

      {selectedSlot && (
        <MealSelector
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSelect={handleMealSelect}
          mealType={selectedSlot.meal}
        />
      )}
    </>
  );
};