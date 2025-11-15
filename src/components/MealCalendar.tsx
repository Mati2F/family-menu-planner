import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { ChefHat, Coffee, Sun, Moon, Plus, X, Shuffle, Check } from "lucide-react";
import { MealSelector } from "./MealSelector";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";

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

type MealType = keyof typeof MEALS;

interface MealData {
  [key: string]: {
    breakfast?: { name: string; servings: number };
    lunch?: { name: string; servings: number };
    dinner?: { name: string; servings: number };
  };
}

interface ProgressData {
  [key: string]: boolean;
}

interface MealCalendarProps {
  onMealsChange: (meals: MealData) => void;
  initialMeals?: MealData;
  defaultServings?: number;
}

export const MealCalendar = ({ onMealsChange, initialMeals = {}, defaultServings = 2 }: MealCalendarProps) => {
  const [defaultServingsState, setDefaultServingsState] = useState(2);
  const [meals, setMeals] = useState<MealData>(initialMeals);
  const [selectedSlot, setSelectedSlot] = useState<{ day: string; meal: MealType } | null>(null);
  const [progress, setProgress] = useState<ProgressData>({});
  const [inputValue, setInputValue] = useState<string>(defaultServingsState.toString());

  const [servingsInputs, setServingsInputs] = useState<
    { [day: string]: { [meal in MealType]?: string } }
  >({});



  const handleMealSelect = (dish: string) => {
    if (!selectedSlot) return;
    
    // Find the dish's default servings
    const dishData = SAMPLE_DISHES[selectedSlot.meal].find(d => d.name === dish);
    const defaultServings = dishData?.servings || 2;
    
    const updatedMeals = {
      ...meals,
      [selectedSlot.day]: {
        ...meals[selectedSlot.day],
        [selectedSlot.meal]: { name: dish, servings: defaultServings }
      }
    };
    
    setMeals(updatedMeals);
    onMealsChange(updatedMeals);
    setSelectedSlot(null);
  };

  useEffect(() => {
    // cada vez que cambia defaultServingsState → actualizar todos los inputs
    setServingsInputs(prev => {
      const updated = { ...prev };

      for (const day in meals) {
        for (const mealKey in meals[day]) {
          const meal = mealKey as MealType;

          updated[day] = updated[day] || {};
          updated[day][meal] = defaultServingsState.toString();
        }
      }

      return updated;
    });

    // actualizar estado real de meals también
    for (const day in meals) {
      for (const mealKey in meals[day]) {
        const meal = mealKey as MealType;
        handleServingsChange(day, meal, defaultServingsState);
      }
    }
  }, [defaultServingsState]);

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

    // Remove from progress too if day has no more meals
    const updatedProgress = { ...progress };
    if (updatedMeals[day] && Object.keys(updatedMeals[day]).length === 0) {
      delete updatedProgress[day];
      setProgress(updatedProgress);
    }
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

  const handleServingsChange = (day: string, meal: MealType, servings: number) => {
    const currentMeal = meals[day]?.[meal];
    if (!currentMeal) return;

    const updatedMeals = {
      ...meals,
      [day]: {
        ...meals[day],
        [meal]: { ...currentMeal, servings: Math.max(1, servings) }
      }
    };

    setMeals(updatedMeals);
    onMealsChange(updatedMeals);
  };

  const toggleDayProgress = (day: string) => {
    const updatedProgress = {
      ...progress,
      [day]: !progress[day]
    };
    setProgress(updatedProgress);
  };

  const setServingsInputValue = (day: string, meal: MealType, value: string) => {
    setServingsInputs(prev => ({
      ...prev,
      [day]: {
        ...prev[day],
        [meal]: value
      }
    }));
  };



  return (
    <TooltipProvider>
      <div className="mb-6">
        <Card className="shadow-card">
          <CardContent className="pt-6">
            <div className="flex  sm:flex-row items-center gap-4">
              <Label htmlFor="defaultServings" className="text-base whitespace-nowrap">
                Porciones por defecto:
              </Label>
              <Input
                id="defaultServings"
                type="number"
                min="1"
                value={inputValue}
                onChange={(e) => {
                  const value = e.target.value;

                  // Permitir borrar
                  if (value === "") {
                    setInputValue("");
                    return;
                  }

                  // Validar número
                  const parsed = parseInt(value, 10);
                  if (!isNaN(parsed)) {
                    setInputValue(value);
                  }
                }}
                onBlur={() => {
                  // Si queda vacío al salir, usar valor por defecto 2
                  if (inputValue === "") {
                    setDefaultServingsState(2);
                    setInputValue("2");
                    return;
                  }

                  // Actualizar tu estado real (int)
                  const parsed = Math.max(1, parseInt(inputValue, 10));
                  setDefaultServingsState(parsed);
                  setInputValue(parsed.toString());
                }}
                className="w-24 text-center border-2"
              />
              <p className="text-sm text-muted-foreground">
                Esta será la cantidad inicial de porciones para cada plato
              </p>

              <Button onClick={generateRandomMeals} variant="outline" className="gap-2 ml-auto bg-[#F06833] hover:bg-[#F4956E] hover:text-white text-white">
                <Shuffle className="w-4 h-4" />
                Generar Programa Aleatorio
              </Button>

            </div>
          </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        {/* Semana 1 */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Semana del 17/11/25</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {WEEK_1_DAYS.map((day) => {
              const isDayCompleted = progress[day];
              const hasMeals = meals[day] && Object.keys(meals[day]).length > 0;
              
              return (
                <Card key={day} className={`p-4 shadow-card transition-all ${isDayCompleted ? 'bg-green-600/20 border-green-600/30' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold text-center text-foreground ${isDayCompleted ? 'line-through' : ''}`}>{day}</h3>
                    {hasMeals && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`p-1 h-6 w-6 ${isDayCompleted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        onClick={() => toggleDayProgress(day)}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {Object.entries(MEALS).map(([mealKey, meal]) => {
                      const MealIcon = meal.icon;
                      const selectedMeal = meals[day]?.[mealKey as MealType];
                      
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
                          
                          {selectedMeal ? (
                            <div className="space-y-2">
                              <div className="relative group">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="secondary"
                                      className="w-full h-auto p-3 text-left justify-start transition-all"
                                      onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                                    >
                                      <span className={`text-sm ${isDayCompleted ? 'line-through' : ''}`}>{selectedMeal.name}</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-sm">
                                    <div className="space-y-1">
                                      <p className="font-semibold text-sm">Ingredientes:</p>
                                      {DISH_INGREDIENTS[selectedMeal.name] ? (
                                        <ul className="text-xs space-y-0.5">
                                          {Object.entries(DISH_INGREDIENTS[selectedMeal.name]).map(([ingredient, quantity]) => (
                                            <li key={ingredient}>• {ingredient}: {quantity}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-xs text-muted-foreground">Ingredientes no disponibles</p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
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
                              <div className="flex items-center gap-2 pl-1 min-h-[26px]">
                                <label className="text-xs text-muted-foreground">Porciones:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={
                                    servingsInputs[day]?.[mealKey as MealType] ??
                                    defaultServingsState.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    // Permitir borrar por completo
                                    if (value === "") {
                                      setServingsInputValue(day, mealKey as MealType, "");
                                      return;
                                    }

                                    // permitir solo números válidos
                                    if (!isNaN(parseInt(value))) {
                                      setServingsInputValue(day, mealKey as MealType, value);
                                    }
                                  }}
                                  onBlur={() => {
                                    const raw = servingsInputs[day]?.[mealKey as MealType];

                                    // Si se dejó vacío → volver al default
                                    if (!raw || raw.trim() === "") {
                                      const val = defaultServingsState.toString();
                                      setServingsInputValue(day, mealKey as MealType, val);
                                      handleServingsChange(day, mealKey as MealType, defaultServingsState);
                                      return;
                                    }

                                    // Si tiene número válido
                                    const parsed = Math.max(1, parseInt(raw, 10));
                                    handleServingsChange(day, mealKey as MealType, parsed);
                                    setServingsInputValue(day, mealKey as MealType, parsed.toString());
                                  }}
                                  className="w-16 px-2 py-1 text-xs border-2 border-border rounded bg-background text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Button 
                                variant="outline"
                                className="w-full h-auto p-3 text-left justify-start"
                                onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                              >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Plus className="w-4 h-4" />
                                  <span className={`text-sm ${isDayCompleted ? 'line-through' : ''}`}>Agregar plato</span>
                                </div>
                              </Button>
                              <div className="min-h-[26px]"></div>
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  </Card>
                );
              })}
            </div>
          </div>

        {/* Semana 2 */}
        <div>
          <h2 className="text-lg font-semibold mb-4 text-foreground">Semana del 24/11/25</h2>
          <div className="grid grid-cols-1 md:grid-cols-7 gap-4">
            {WEEK_2_DAYS.map((day) => {
              const isDayCompleted = progress[day];
              const hasMeals = meals[day] && Object.keys(meals[day]).length > 0;
              
              return (
                <Card key={day} className={`p-4 shadow-card transition-all ${isDayCompleted ? 'bg-green-600/20 border-green-600/30' : ''}`}>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className={`font-semibold text-center text-foreground ${isDayCompleted ? 'line-through' : ''}`}>{day.replace(' - Semana 2', '')}</h3>
                    {hasMeals && (
                      <Button
                        size="sm"
                        variant="ghost"
                        className={`p-1 h-6 w-6 ${isDayCompleted ? 'text-primary' : 'text-muted-foreground hover:text-primary'}`}
                        onClick={() => toggleDayProgress(day)}
                      >
                        <Check className="w-3 h-3" />
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {Object.entries(MEALS).map(([mealKey, meal]) => {
                      const MealIcon = meal.icon;
                      const selectedMeal = meals[day]?.[mealKey as MealType];
                      
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
                          
                          {selectedMeal ? (
                            <div className="space-y-2">
                              <div className="relative group">
                                <Tooltip>
                                  <TooltipTrigger asChild>
                                    <Button 
                                      variant="secondary"
                                      className="w-full h-auto p-3 text-left justify-start transition-all"
                                      onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                                    >
                                      <span className={`text-sm ${isDayCompleted ? 'line-through' : ''}`}>{selectedMeal.name}</span>
                                    </Button>
                                  </TooltipTrigger>
                                  <TooltipContent side="right" className="max-w-sm">
                                    <div className="space-y-1">
                                      <p className="font-semibold text-sm">Ingredientes:</p>
                                      {DISH_INGREDIENTS[selectedMeal.name] ? (
                                        <ul className="text-xs space-y-0.5">
                                          {Object.entries(DISH_INGREDIENTS[selectedMeal.name]).map(([ingredient, quantity]) => (
                                            <li key={ingredient}>• {ingredient}: {quantity}</li>
                                          ))}
                                        </ul>
                                      ) : (
                                        <p className="text-xs text-muted-foreground">Ingredientes no disponibles</p>
                                      )}
                                    </div>
                                  </TooltipContent>
                                </Tooltip>
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
                              <div className="flex items-center gap-2 pl-1 min-h-[26px]">
                                <label className="text-xs text-muted-foreground">Porciones:</label>
                                <input
                                  type="number"
                                  min="1"
                                  value={
                                    servingsInputs[day]?.[mealKey as MealType] ??
                                    defaultServingsState.toString()
                                  }
                                  onChange={(e) => {
                                    const value = e.target.value;

                                    // Permitir borrar por completo
                                    if (value === "") {
                                      setServingsInputValue(day, mealKey as MealType, "");
                                      return;
                                    }

                                    // permitir solo números válidos
                                    if (!isNaN(parseInt(value))) {
                                      setServingsInputValue(day, mealKey as MealType, value);
                                    }
                                  }}
                                  onBlur={() => {
                                    const raw = servingsInputs[day]?.[mealKey as MealType];

                                    // Si se dejó vacío → volver al default
                                    if (!raw || raw.trim() === "") {
                                      const val = defaultServingsState.toString();
                                      setServingsInputValue(day, mealKey as MealType, val);
                                      handleServingsChange(day, mealKey as MealType, defaultServingsState);
                                      return;
                                    }

                                    // Si tiene número válido
                                    const parsed = Math.max(1, parseInt(raw, 10));
                                    handleServingsChange(day, mealKey as MealType, parsed);
                                    setServingsInputValue(day, mealKey as MealType, parsed.toString());
                                  }}
                                  className="w-16 px-2 py-1 text-xs border-2 border-border rounded bg-background text-foreground [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              </div>
                            </div>
                          ) : (
                            <div className="space-y-2">
                              <Button 
                                variant="outline"
                                className="w-full h-auto p-3 text-left justify-start"
                                onClick={() => setSelectedSlot({ day, meal: mealKey as MealType })}
                              >
                                <div className="flex items-center gap-2 text-muted-foreground">
                                  <Plus className="w-4 h-4" />
                                  <span className={`text-sm ${isDayCompleted ? 'line-through' : ''}`}>Agregar plato</span>
                                </div>
                              </Button>
                              <div className="min-h-[26px]"></div>
                            </div>
                          )}
                          </div>
                        );
                      })}
                    </div>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>

      {selectedSlot && (
        <MealSelector
          isOpen={!!selectedSlot}
          onClose={() => setSelectedSlot(null)}
          onSelect={handleMealSelect}
          mealType={selectedSlot.meal}
        />
      )}
    </TooltipProvider>
  );
};