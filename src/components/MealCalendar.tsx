import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChefHat, Coffee, Sun, Moon, Plus, X, Shuffle, Check } from "lucide-react";
import { MealSelector } from "./MealSelector";
import { Badge } from "@/components/ui/badge";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const MEALS = {
  breakfast: { name: "Desayuno", icon: Coffee, color: "bg-gradient-warm" },
  lunch: { name: "Almuerzo", icon: Sun, color: "bg-gradient-fresh" },
  dinner: { name: "Cena", icon: Moon, color: "bg-primary" }
} as const;

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

type MealType = keyof typeof MEALS;

interface MealData {
  [key: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

interface ProgressData {
  [key: string]: {
    breakfast?: boolean;
    lunch?: boolean;
    dinner?: boolean;
  };
}

interface MealCalendarProps {
  onMealsChange: (meals: MealData) => void;
  initialMeals?: MealData;
}

export const MealCalendar = ({ onMealsChange, initialMeals = {} }: MealCalendarProps) => {
  const [meals, setMeals] = useState<MealData>(initialMeals);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; meal: MealType } | null>(null);
  const [progress, setProgress] = useState<ProgressData>({});

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

  const handleRemoveMeal = (day: string, meal: MealType) => {
    const updatedMeals = { ...meals };
    if (updatedMeals[day]) {
      delete updatedMeals[day][meal];
      if (Object.keys(updatedMeals[day]).length === 0) {
        delete updatedMeals[day];
      }
    }
    setMeals(updatedMeals);
    onMealsChange(updatedMeals);

    // Remove from progress too
    const updatedProgress = { ...progress };
    if (updatedProgress[day]) {
      delete updatedProgress[day][meal];
      if (Object.keys(updatedProgress[day]).length === 0) {
        delete updatedProgress[day];
      }
    }
    setProgress(updatedProgress);
  };

  const handleGenerateRandom = () => {
    const randomMeals: MealData = {};
    
    DAYS.forEach(day => {
      randomMeals[day] = {};
      Object.keys(MEALS).forEach(mealKey => {
        const mealType = mealKey as MealType;
        const dishes = SAMPLE_DISHES[mealType];
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
        randomMeals[day][mealType] = randomDish.name;
      });
    });

    setMeals(randomMeals);
    onMealsChange(randomMeals);
    setProgress({});
  };

  const toggleProgress = (day: string, meal: MealType) => {
    const updatedProgress = {
      ...progress,
      [day]: {
        ...progress[day],
        [meal]: !progress[day]?.[meal]
      }
    };
    setProgress(updatedProgress);
  };

  return (
    <>
      <div className="mb-6 flex gap-3">
        <Button 
          onClick={handleGenerateRandom}
          className="bg-gradient-warm hover:opacity-90"
          size="lg"
        >
          <Shuffle className="w-4 h-4 mr-2" />
          Generar Programa Aleatorio
        </Button>
        <div className="flex items-center gap-2 ml-auto">
          <Badge variant="secondary" className="text-sm">
            Progreso: {Object.values(progress).reduce((total, dayProgress) => 
              total + Object.values(dayProgress).filter(Boolean).length, 0
            )} / {Object.values(meals).reduce((total, dayMeals) => 
              total + Object.keys(dayMeals).length, 0
            )} completados
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
        {DAYS.map((day) => (
          <Card key={day} className="p-4 shadow-card">
            <h3 className="font-semibold text-center mb-4 text-foreground">{day}</h3>
            <div className="space-y-3">
              {Object.entries(MEALS).map(([mealKey, meal]) => {
                const MealIcon = meal.icon;
                const selectedDish = meals[day]?.[mealKey as MealType];
                
                const isCompleted = progress[day]?.[mealKey as MealType];
                
                return (
                  <div key={mealKey} className="space-y-2">
                    <div className="flex items-center gap-2">
                      <div className={`p-1.5 rounded-full ${meal.color}`}>
                        <MealIcon className="w-3 h-3 text-white" />
                      </div>
                      <span className="text-sm font-medium text-muted-foreground">
                        {meal.name}
                      </span>
                      {selectedDish && (
                        <Button
                          size="sm"
                          variant="ghost"
                          className={`ml-auto p-1 h-6 w-6 ${isCompleted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                          onClick={() => toggleProgress(day, mealKey as MealType)}
                        >
                          <Check className="w-3 h-3" />
                        </Button>
                      )}
                    </div>
                    
                    {selectedDish ? (
                      <div className="relative group">
                        <Button 
                          variant="secondary"
                          className={`w-full h-auto p-3 text-left justify-start transition-all ${
                            isCompleted ? 'opacity-60 line-through' : ''
                          }`}
                          onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                        >
                          <span className="text-sm">{selectedDish}</span>
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          className="absolute top-1 right-1 p-1 h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity bg-destructive/10 hover:bg-destructive text-destructive"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleRemoveMeal(day, mealKey as MealType);
                          }}
                        >
                          <X className="w-3 h-3" />
                        </Button>
                      </div>
                    ) : (
                      <Button 
                        variant="outline"
                        className="w-full h-auto p-3 text-left justify-start"
                        onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                      >
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Plus className="w-4 h-4" />
                          <span className="text-sm">Agregar plato</span>
                        </div>
                      </Button>
                    )}
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