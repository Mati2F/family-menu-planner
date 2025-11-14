import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Clock, Users, Search, Filter } from "lucide-react";
import { useState } from "react";

const SAMPLE_DISHES = {
  breakfast: [
    { name: "Tostadas con Palta", time: "10 min", servings: 2, ingredients: ["pan", "palta", "tomate"] },
    { name: "Huevos Revueltos", time: "15 min", servings: 2, ingredients: ["huevos", "leche", "mantequilla"] },
    { name: "Pancakes", time: "20 min", servings: 4, ingredients: ["harina", "huevos", "leche", "azúcar"] },
    { name: "Avena con Frutas", time: "5 min", servings: 2, ingredients: ["avena", "leche", "frutas"] },
    { name: "Yogurt con Granola", time: "5 min", servings: 1, ingredients: ["yogurt", "granola", "frutas"] },
  ],
  lunch: [
    { name: "Pollo al Horno con Papas", time: "45 min", servings: 4, ingredients: ["pollo", "papas", "aceite", "especias"] },
    { name: "Pasta con Salsa de Tomate", time: "25 min", servings: 4, ingredients: ["pasta", "tomate", "ajo", "aceite"] },
    { name: "Ensalada César", time: "15 min", servings: 2, ingredients: ["lechuga", "pollo", "queso", "pan"] },
    { name: "Arroz con Verduras", time: "30 min", servings: 4, ingredients: ["arroz", "verduras", "aceite", "ajo"] },
    { name: "Sándwich de Atún", time: "10 min", servings: 2, ingredients: ["pan", "atún", "mayonesa", "lechuga"] },
    { name: "Sopa de Lentejas", time: "40 min", servings: 6, ingredients: ["lentejas", "verduras", "cebolla", "ajo"] },
  ],
  dinner: [
    { name: "Salmón a la Plancha", time: "20 min", servings: 2, ingredients: ["salmón", "limón", "aceite", "especias"] },
    { name: "Pizza Casera", time: "35 min", servings: 4, ingredients: ["harina", "tomate", "queso", "aceite"] },
    { name: "Ensalada de Quinoa", time: "15 min", servings: 3, ingredients: ["quinoa", "verduras", "limón", "aceite"] },
    { name: "Tacos de Pollo", time: "25 min", servings: 4, ingredients: ["pollo", "tortillas", "verduras", "especias"] },
    { name: "Sopa de Verduras", time: "30 min", servings: 4, ingredients: ["verduras", "cebolla", "ajo", "aceite"] },
    { name: "Milanesas con Puré", time: "35 min", servings: 4, ingredients: ["carne", "pan rallado", "papas", "leche"] },
  ]
};

// Lista única de todos los ingredientes disponibles
const ALL_INGREDIENTS = Array.from(
  new Set(
    Object.values(SAMPLE_DISHES)
      .flat()
      .flatMap(dish => dish.ingredients)
  )
).sort();

interface MealSelectorProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (dish: string) => void;
  mealType: 'breakfast' | 'lunch' | 'dinner';
  selectedIngredients: string[];
  onIngredientsChange: (ingredients: string[]) => void;
}

export const MealSelector = ({ 
  isOpen, 
  onClose, 
  onSelect, 
  mealType, 
  selectedIngredients, 
  onIngredientsChange 
}: MealSelectorProps) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  const dishes = SAMPLE_DISHES[mealType] || [];
  
  const mealTitles = {
    breakfast: "Desayuno",
    lunch: "Almuerzo", 
    dinner: "Cena"
  };

  const toggleIngredient = (ingredient: string) => {
    if (selectedIngredients.includes(ingredient)) {
      onIngredientsChange(selectedIngredients.filter(i => i !== ingredient));
    } else {
      onIngredientsChange([...selectedIngredients, ingredient]);
    }
  };

  const filteredDishes = dishes.filter(dish => {
    // Filtrar por búsqueda de texto
    const matchesSearch = dish.name.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtrar por ingredientes seleccionados (debe contener AL MENOS uno de los seleccionados)
    const matchesIngredients = selectedIngredients.length === 0 || 
      selectedIngredients.some(ingredient => dish.ingredients.includes(ingredient));
    
    return matchesSearch && matchesIngredients;
  });

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle className="text-center">
            Seleccionar {mealTitles[mealType]}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
            <Input
              placeholder="Buscar plato..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <div>
            <Button
              variant="outline"
              className="w-full justify-start"
              onClick={() => setShowFilters(!showFilters)}
            >
              <Filter className="w-4 h-4 mr-2" />
              Filtrar por ingredientes {selectedIngredients.length > 0 && `(${selectedIngredients.length})`}
            </Button>
            
            {showFilters && (
              <div className="mt-4 p-4 border rounded-lg bg-muted/50">
                <ScrollArea className="h-[200px]">
                  <div className="grid grid-cols-2 gap-3">
                    {ALL_INGREDIENTS.map(ingredient => (
                      <div key={ingredient} className="flex items-center space-x-2">
                        <Checkbox
                          id={ingredient}
                          checked={selectedIngredients.includes(ingredient)}
                          onCheckedChange={() => toggleIngredient(ingredient)}
                        />
                        <label
                          htmlFor={ingredient}
                          className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer"
                        >
                          {ingredient}
                        </label>
                      </div>
                    ))}
                  </div>
                </ScrollArea>
                {selectedIngredients.length > 0 && (
                  <Button
                    variant="ghost"
                    size="sm"
                    className="mt-3 w-full"
                    onClick={() => onIngredientsChange([])}
                  >
                    Limpiar filtros
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
        
        <ScrollArea className="max-h-[300px] mt-4">
          <div className="space-y-3 p-1">
            {filteredDishes.length === 0 ? (
              <p className="text-center text-muted-foreground py-8">
                {selectedIngredients.length > 0 
                  ? "No hay platos con los ingredientes seleccionados"
                  : `No se encontraron platos que coincidan con "${searchTerm}"`
                }
              </p>
            ) : (
              filteredDishes.map((dish, index) => (
              <Button
                key={index}
                variant="outline"
                className="w-full h-auto p-4 flex flex-col items-start gap-2 hover:bg-accent/50 transition-colors"
                onClick={() => onSelect(dish.name)}
              >
                <span className="font-medium text-left">{dish.name}</span>
                <div className="flex gap-3 text-sm text-muted-foreground flex-wrap">
                  <div className="flex items-center gap-1">
                    <Clock className="w-4 h-4" />
                    <span>{dish.time}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{dish.servings} personas</span>
                  </div>
                </div>
                <div className="flex flex-wrap gap-1 mt-1">
                  {dish.ingredients.map(ing => (
                    <Badge 
                      key={ing} 
                      variant={selectedIngredients.includes(ing) ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {ing}
                    </Badge>
                  ))}
                </div>
              </Button>
              ))
            )}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};