import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { MealCalendar } from "@/components/MealCalendar";
import { ShoppingList } from "@/components/ShoppingList";

interface MealData {
  [key: string]: {
    breakfast?: string;
    lunch?: string;
    dinner?: string;
  };
}

const Index = () => {
  const [selectedMeals, setSelectedMeals] = useState<MealData>({});

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
            <MealCalendar onMealsChange={setSelectedMeals} />
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
