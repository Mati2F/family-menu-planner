import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MealCalendar } from "@/components/MealCalendar";
import { ShoppingList } from "@/components/ShoppingList";
import { InitialScreen } from "@/components/InitialScreen";

interface MealData {
  [key: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

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

const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];
const WEEK_1_DAYS = DAYS.map(day => day);
const WEEK_2_DAYS = DAYS.map(day => `${day} - Semana 2`);

const generateRandomMealsTwoWeeks = (): MealData => {
  const randomMeals: MealData = {};
  const allDays = [...WEEK_1_DAYS, ...WEEK_2_DAYS];

  allDays.forEach(day => {
    randomMeals[day] = {};
    Object.keys(SAMPLE_DISHES).forEach(mealKey => {
      const mealType = mealKey as keyof typeof SAMPLE_DISHES;
      const dishes = SAMPLE_DISHES[mealType];
      const randomDish = dishes[Math.floor(Math.random() * dishes.length)];
      randomMeals[day][mealType] = randomDish.name;
    });
  });

  return randomMeals;
};

const Index = () => {
  const [selectedMeals, setSelectedMeals] = useState<MealData>({});
  const [currentMode, setCurrentMode] = useState<'initial' | 'app'>('initial');

  const handleModeSelect = (mode: 'manual' | 'random') => {
    if (mode === 'random') {
      const randomMeals = generateRandomMealsTwoWeeks();
      setSelectedMeals(randomMeals);
    }
    setCurrentMode('app');
  };

  if (currentMode === 'initial') {
    return <InitialScreen onSelectMode={handleModeSelect} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <AppHeader />
      
      <main className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          {/* Calendar Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Calendario de Comidas
              </h2>
              <p className="text-muted-foreground">
                Selecciona qué preparar cada día de la semana
              </p>
            </div>
            <MealCalendar onMealsChange={setSelectedMeals} initialMeals={selectedMeals} />
          </section>

          {/* Shopping List Section */}
          <section>
            <div className="mb-6">
              <h2 className="text-2xl font-semibold text-foreground mb-2">
                Lista de Compras
              </h2>
              <p className="text-muted-foreground">
                Ingredientes necesarios para tus platos seleccionados
              </p>
            </div>
            <ShoppingList selectedMeals={selectedMeals} />
          </section>
        </div>
      </main>
    </div>
  );
};

export default Index;
