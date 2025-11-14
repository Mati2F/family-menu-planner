import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ChefHat, Coffee, Sun, Moon, Plus, X, Shuffle, Check, Minus } from "lucide-react";
import { MealSelector } from "./MealSelector";
import { Badge } from "@/components/ui/badge";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEK_1_DAYS = DAYS.map(day => day);
const WEEK_2_DAYS = DAYS.map(day => `${day} - Semana 2`);
const MEALS = {
  breakfast: { name: "Desayuno", icon: Coffee, color: "bg-gradient-warm" },
  lunch: { name: "Almuerzo", icon: Sun, color: "bg-gradient-fresh" },
  dinner: { name: "Cena", icon: Moon, color: "bg-primary" }
} as const;

// Sample ingredients data for tooltips
const DISH_INGREDIENTS: { [key: string]: { [ingredient: string]: string } } = {
  "Tostadas con Palta": {"Pan integral": "4 rebanadas", "Palta": "2 unidades", "Tomate": "1 unidad", "Sal": "al gusto", "Limón": "1/2 unidad"},
  "Huevos Revueltos": {"Huevos": "6 unidades", "Leche": "1/2 taza", "Mantequilla": "2 cucharadas", "Sal": "al gusto", "Pimienta": "al gusto"},
  "Pancakes": {"Harina": "2 tazas", "Huevos": "2 unidades", "Leche": "1 1/2 tazas", "Azúcar": "2 cucharadas", "Polvo de hornear": "2 cucharaditas", "Mantequilla": "3 cucharadas"},
  "Pollo al Horno con Papas": {"Pollo entero": "1 unidad", "Papa": "1 kg", "Cebolla": "2 unidades", "Ajo": "4 dientes", "Aceite de oliva": "3 cucharadas", "Romero": "2 ramas"},
  "Pasta con Salsa de Tomate": {"Pasta": "500g", "Tomate en lata": "1 lata", "Ajo": "3 dientes", "Cebolla": "1 unidad", "Albahaca": "hojas frescas", "Aceite de oliva": "2 cucharadas"},
  "Salmón a la Plancha": {"Salmón": "4 filetes", "Limón": "2 unidades", "Aceite de oliva": "2 cucharadas", "Sal": "al gusto", "Pimienta": "al gusto", "Eneldo": "ramitas frescas"},
  "Pizza Casera": {"Harina": "3 tazas", "Levadura": "1 sobre", "Salsa de tomate": "1/2 taza", "Queso mozzarella": "200g", "Aceite de oliva": "2 cucharadas"},
  "Ensalada César": {"Lechuga romana": "2 cabezas", "Queso parmesano": "100g", "Pan": "4 rebanadas", "Ajo": "2 dientes", "Limón": "1 unidad", "Aceite de oliva": "3 cucharadas"},
  "Arroz con Verduras": {"Arroz": "2 tazas", "Zanahoria": "2 unidades", "Arveja": "1 taza", "Cebolla": "1 unidad", "Ajo": "2 dientes", "Caldo de verduras": "4 tazas"},
  "Avena con Frutas": {"Avena": "1 taza", "Leche": "2 tazas", "Manzana": "2 unidades", "Banana": "2 unidades", "Miel": "2 cucharadas", "Canela": "1 cucharadita"},
  "Yogurt con Granola": {"Yogurt natural": "2 tazas", "Granola": "1/2 taza", "Miel": "2 cucharadas", "Fruta del bosque": "1 taza"},
  "Sándwich de Atún": {"Pan": "8 rebanadas", "Atún en lata": "2 latas", "Mayonesa": "3 cucharadas", "Lechuga": "hojas", "Tomate": "2 unidades"},
  "Sopa de Lentejas": {"Lenteja": "2 tazas", "Zanahoria": "3 unidades", "Cebolla": "1 unidad", "Apio": "2 tallos", "Ajo": "3 dientes", "Caldo de verduras": "6 tazas"},
  "Ensalada de Quinoa": {"Quinoa": "1 1/2 tazas", "Pepino": "2 unidades", "Tomate": "3 unidades", "Cebolla morada": "1/2 unidad", "Limón": "2 unidades", "Aceite de oliva": "3 cucharadas"},
  "Tacos de Pollo": {"Tortilla": "8 unidades", "Pollo": "500g", "Cebolla": "1 unidad", "Pimiento": "2 unidades", "Limón": "2 unidades", "Cilantro": "1 manojo"},
  "Sopa de Verduras": {"Zanahoria": "2 unidades", "Calabacín": "2 unidades", "Cebolla": "1 unidad", "Apio": "2 tallos", "Tomate": "2 unidades", "Caldo de verduras": "6 tazas"},
  "Milanesas con Puré": {"Carne para milanesas": "8 unidades", "Pan rallado": "2 tazas", "Huevos": "3 unidades", "Papa": "1 kg", "Leche": "1/2 taza", "Mantequilla": "3 cucharadas"}
};

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

interface MealData {
  [key: string]: {
    breakfast?: { name: string; servings: number };
    lunch?: { name: string; servings: number };
    dinner?: { name: string; servings: number };
  };
}

interface MealCalendarProps {
  onMealsChange: (meals: MealData) => void;
  initialMeals?: MealData;
  defaultServings?: number;
}

export const MealCalendar = ({ onMealsChange, initialMeals = {}, defaultServings = 2 }: MealCalendarProps) => {
  const [meals, setMeals] = useState<MealData>(initialMeals);
  const [selectorOpen, setSelectorOpen] = useState(false);
  const [currentMealType, setCurrentMealType] = useState<'breakfast' | 'lunch' | 'dinner'>('breakfast');
  const [currentDay, setCurrentDay] = useState<string>('');
  const [selectedDish, setSelectedDish] = useState<string>('');
  const [servings, setServings] = useState<number>(0);
  const [selectedIngredients, setSelectedIngredients] = useState<string[]>([]);

  useEffect(() => {
    setMeals(initialMeals);
  }, [initialMeals]);

  useEffect(() => {
    onMealsChange(meals);
  }, [meals, onMealsChange]);

  const handleOpenSelector = (day: string, mealType: 'breakfast' | 'lunch' | 'dinner') => {
    setCurrentDay(day);
    setCurrentMealType(mealType);
    const existingMeal = meals[day]?.[mealType];
    setSelectedDish(existingMeal?.name || '');
    setServings(existingMeal?.servings || defaultServings);
    setSelectorOpen(true);
  };

  const handleMealSelect = (dish: string) => {
    setSelectedDish(dish);
  };

  const handleSaveMeal = () => {
    if (selectedDish && currentDay) {
      const finalServings = servings === 0 ? 1 : servings;
      setMeals((prevMeals) => ({
        ...prevMeals,
        [currentDay]: {
          ...prevMeals[currentDay],
          [currentMealType]: { name: selectedDish, servings: finalServings }
        }
      }));
      setSelectorOpen(false);
      setSelectedDish('');
      setServings(0);
    }
  };

  const handleClearMeal = (day: string, mealType: keyof typeof MEALS) => {
    setMeals((prevMeals) => {
      const newMeals = { ...prevMeals };
      if (newMeals[day]) {
        const dayMeals = { ...newMeals[day] };
        delete dayMeals[mealType];
        newMeals[day] = dayMeals;
      }
      return newMeals;
    });
  };

  const generateRandomMeals = () => {
    const randomMeals: MealData = {};
    const allDays = [...WEEK_1_DAYS, ...WEEK_2_DAYS];

    allDays.forEach(day => {
      randomMeals[day] = {};
      Object.keys(SAMPLE_DISHES).forEach(mealKey => {
        const mealType = mealKey as keyof typeof SAMPLE_DISHES;
        const dishes = SAMPLE_DISHES[mealType];
        const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
        randomMeals[day][mealType] = { name: randomDish.name, servings: randomDish.servings };
      });
    });

    setMeals(randomMeals);
  };

  const MealCard = ({ day, mealType }: { day: string, mealType: keyof typeof MEALS }) => {
    const meal = meals[day]?.[mealType];
    const mealInfo = MEALS[mealType];
    const MealIcon = mealInfo.icon;
    const ingredients = meal?.name ? DISH_INGREDIENTS[meal.name] : null;

    return (
      <div className="relative">
        <Card className="p-4 hover:shadow-card transition-all cursor-pointer group" 
              onClick={() => handleOpenSelector(day, mealType)}>
          <div className="flex items-start justify-between gap-2">
            <div className="flex items-center gap-2 mb-2">
              <div className={`p-2 rounded-full ${mealInfo.color} flex items-center justify-center`}>
                <MealIcon className="w-4 h-4 text-white" />
              </div>
              <span className="font-medium text-sm">{mealInfo.name}</span>
            </div>
            {meal && (
              <Button
                variant="ghost"
                size="icon"
                className="h-6 w-6 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClearMeal(day, mealType);
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          {meal ? (
            <div className="space-y-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <p className="text-sm text-foreground font-medium cursor-help">
                      {meal.name}
                    </p>
                  </TooltipTrigger>
                  {ingredients && (
                    <TooltipContent side="right" className="max-w-xs">
                      <div className="space-y-2">
                        <p className="font-semibold text-sm">Ingredientes:</p>
                        <div className="space-y-1">
                          {Object.entries(ingredients).map(([ingredient, quantity]) => (
                            <div key={ingredient} className="flex justify-between gap-4 text-xs">
                              <span>{ingredient}:</span>
                              <span className="text-muted-foreground">{quantity}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </TooltipContent>
                  )}
                </Tooltip>
              </TooltipProvider>
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <Badge variant="secondary" className="text-xs">
                  {meal.servings} {meal.servings === 1 ? 'porción' : 'porciones'}
                </Badge>
              </div>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-sm text-muted-foreground group-hover:text-foreground transition-colors">
              <Plus className="w-4 h-4" />
              <span>Agregar plato</span>
            </div>
          )}
        </Card>
      </div>
    );
  };

  const WeekSection = ({ weekDays, title }: { weekDays: string[], title: string }) => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
        <ChefHat className="w-5 h-5" />
        {title}
      </h3>
      <div className="space-y-4">
        {weekDays.map((day) => (
          <div key={day} className="space-y-2">
            <h4 className="font-medium text-foreground">{day.replace(' - Semana 2', '')}</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              {(Object.keys(MEALS) as Array<keyof typeof MEALS>).map((mealType) => (
                <MealCard key={`${day}-${mealType}`} day={day} mealType={mealType} />
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <Button onClick={generateRandomMeals} variant="outline" className="gap-2">
          <Shuffle className="w-4 h-4" />
          Generar Programa Aleatorio
        </Button>
      </div>

      <WeekSection weekDays={WEEK_1_DAYS} title="Semana 1" />
      <WeekSection weekDays={WEEK_2_DAYS} title="Semana 2" />

      <MealSelector
        isOpen={selectorOpen}
        onClose={() => setSelectorOpen(false)}
        onSelect={handleMealSelect}
        mealType={currentMealType}
        selectedIngredients={selectedIngredients}
        onIngredientsChange={setSelectedIngredients}
      />

      {selectorOpen && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50" />
      )}
      
      {selectorOpen && selectedDish && (
        <div className="fixed bottom-0 left-0 right-0 bg-background border-t border-border p-4 z-50 shadow-lg">
          <div className="container mx-auto max-w-md">
            <div className="flex items-center justify-between gap-4">
              <div className="flex-1">
                <p className="text-sm font-medium mb-2">{selectedDish}</p>
                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground whitespace-nowrap">Porciones:</span>
                  <div className="flex items-center gap-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-2"
                      onClick={() => setServings(Math.max(1, servings - 1))}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                    <Input
                      type="number"
                      min="1"
                      value={servings === 0 ? '' : servings}
                      onChange={(e) => {
                        const value = e.target.value;
                        if (value === '') {
                          setServings(0);
                        } else {
                          setServings(Math.max(1, parseInt(value) || 1));
                        }
                      }}
                      onBlur={() => {
                        if (servings === 0) {
                          setServings(1);
                        }
                      }}
                      className="w-20 text-center border-2"
                      style={{
                        MozAppearance: 'textfield',
                        WebkitAppearance: 'none',
                        appearance: 'none'
                      }}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      className="h-10 w-10 border-2"
                      onClick={() => setServings(servings + 1)}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              <Button onClick={handleSaveMeal} className="gap-2">
                <Check className="w-4 h-4" />
                Guardar
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
