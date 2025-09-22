import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";

// Sample ingredients data - in a real app this would come from a database
const DISH_INGREDIENTS: { [key: string]: string[] } = {
  "Tostadas con Palta": ["Pan integral", "Palta", "Tomates", "Sal", "Limón"],
  "Huevos Revueltos": ["Huevos", "Leche", "Mantequilla", "Sal", "Pimienta"],
  "Pancakes": ["Harina", "Huevos", "Leche", "Azúcar", "Polvo de hornear", "Mantequilla"],
  "Pollo al Horno con Papas": ["Pollo entero", "Papas", "Cebolla", "Ajo", "Aceite de oliva", "Romero"],
  "Pasta con Salsa de Tomate": ["Pasta", "Tomates en lata", "Ajo", "Cebolla", "Albahaca", "Aceite de oliva"],
  "Salmón a la Plancha": ["Salmón", "Limón", "Aceite de oliva", "Sal", "Pimienta", "Eneldo"],
  "Pizza Casera": ["Harina", "Levadura", "Salsa de tomate", "Queso mozzarella", "Aceite de oliva"],
  "Ensalada César": ["Lechuga romana", "Queso parmesano", "Pan", "Ajo", "Limón", "Aceite de oliva"],
  "Arroz con Verduras": ["Arroz", "Zanahoria", "Arvejas", "Cebolla", "Ajo", "Caldo de verduras"],
  "Avena con Frutas": ["Avena", "Leche", "Manzana", "Banana", "Miel", "Canela"],
  "Yogurt con Granola": ["Yogurt natural", "Granola", "Miel", "Frutas del bosque"],
  "Sándwich de Atún": ["Pan", "Atún en lata", "Mayonesa", "Lechuga", "Tomate"],
  "Sopa de Lentejas": ["Lentejas", "Zanahoria", "Cebolla", "Apio", "Ajo", "Caldo de verduras"],
  "Ensalada de Quinoa": ["Quinoa", "Pepino", "Tomate", "Cebolla morada", "Limón", "Aceite de oliva"],
  "Tacos de Pollo": ["Tortillas", "Pollo", "Cebolla", "Pimiento", "Limón", "Cilantro"],
  "Sopa de Verduras": ["Zanahoria", "Calabacín", "Cebolla", "Apio", "Tomate", "Caldo de verduras"],
  "Milanesas con Puré": ["Carne para milanesas", "Pan rallado", "Huevos", "Papas", "Leche", "Mantequilla"]
};

interface ShoppingListProps {
  selectedMeals: { [key: string]: { breakfast?: string; lunch?: string; dinner?: string } };
}

export const ShoppingList = ({ selectedMeals }: ShoppingListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Collect all ingredients from selected meals
  const allIngredients = new Set<string>();
  Object.values(selectedMeals).forEach(dayMeals => {
    Object.values(dayMeals).forEach(dish => {
      if (dish && DISH_INGREDIENTS[dish]) {
        DISH_INGREDIENTS[dish].forEach(ingredient => allIngredients.add(ingredient));
      }
    });
  });

  const ingredientsList = Array.from(allIngredients).sort();

  const toggleItem = (ingredient: string) => {
    const newChecked = new Set(checkedItems);
    if (newChecked.has(ingredient)) {
      newChecked.delete(ingredient);
    } else {
      newChecked.add(ingredient);
    }
    setCheckedItems(newChecked);
  };

  const checkedCount = checkedItems.size;
  const totalCount = ingredientsList.length;

  return (
    <Card className="shadow-card">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <div className="p-2 bg-gradient-warm rounded-full">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            Lista de Compras
          </CardTitle>
          {totalCount > 0 && (
            <Badge variant="secondary" className="text-sm">
              {checkedCount}/{totalCount} completados
            </Badge>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {totalCount === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Agrega platos al calendario para generar tu lista de compras
          </p>
        ) : (
          <div className="space-y-2">
            {ingredientsList.map((ingredient) => {
              const isChecked = checkedItems.has(ingredient);
              return (
                <Button
                  key={ingredient}
                  variant="ghost"
                  className={`w-full justify-start h-auto p-3 ${
                    isChecked ? 'opacity-60 line-through' : ''
                  }`}
                  onClick={() => toggleItem(ingredient)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded border-2 flex items-center justify-center ${
                      isChecked 
                        ? 'bg-primary border-primary' 
                        : 'border-muted-foreground/30'
                    }`}>
                      {isChecked && <Check className="w-3 h-3 text-white" />}
                    </div>
                    <span className="text-left">{ingredient}</span>
                  </div>
                </Button>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};