import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from "@/components/ui/command";
import { Edit, Plus, Trash2, Check, ChevronsUpDown } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

const ALL_DISHES = [
  // Desayunos
  { 
    name: "Tostadas con Palta", 
    type: "breakfast", 
    time: "10 min", 
    servings: 2,
    ingredients: [
      { name: "Pan integral", quantity: "4 rebanadas" },
      { name: "Palta", quantity: "1 unidad" },
      { name: "Sal", quantity: "al gusto" },
      { name: "Limón", quantity: "1/2 unidad" }
    ]
  },
  { 
    name: "Huevos Revueltos", 
    type: "breakfast", 
    time: "15 min", 
    servings: 2,
    ingredients: [
      { name: "Huevos", quantity: "4 unidades" },
      { name: "Leche", quantity: "50ml" },
      { name: "Mantequilla", quantity: "20g" },
      { name: "Sal", quantity: "al gusto" }
    ]
  },
  { 
    name: "Pancakes", 
    type: "breakfast", 
    time: "20 min", 
    servings: 4,
    ingredients: [
      { name: "Harina", quantity: "200g" },
      { name: "Huevos", quantity: "2 unidades" },
      { name: "Leche", quantity: "250ml" },
      { name: "Azúcar", quantity: "2 cucharadas" },
      { name: "Polvo de hornear", quantity: "1 cucharadita" }
    ]
  },
  { 
    name: "Avena con Frutas", 
    type: "breakfast", 
    time: "5 min", 
    servings: 2,
    ingredients: [
      { name: "Avena", quantity: "100g" },
      { name: "Leche", quantity: "300ml" },
      { name: "Banana", quantity: "1 unidad" },
      { name: "Fresas", quantity: "100g" },
      { name: "Miel", quantity: "2 cucharadas" }
    ]
  },
  { 
    name: "Yogurt con Granola", 
    type: "breakfast", 
    time: "5 min", 
    servings: 1,
    ingredients: [
      { name: "Yogurt natural", quantity: "200g" },
      { name: "Granola", quantity: "50g" },
      { name: "Arándanos", quantity: "30g" },
      { name: "Miel", quantity: "1 cucharada" }
    ]
  },
  // Almuerzos
  { 
    name: "Pollo al Horno con Papas", 
    type: "lunch", 
    time: "45 min", 
    servings: 4,
    ingredients: [
      { name: "Pechuga de pollo", quantity: "800g" },
      { name: "Papas", quantity: "600g" },
      { name: "Aceite de oliva", quantity: "3 cucharadas" },
      { name: "Ajo", quantity: "3 dientes" },
      { name: "Romero", quantity: "al gusto" },
      { name: "Sal y pimienta", quantity: "al gusto" }
    ]
  },
  { 
    name: "Pasta con Salsa de Tomate", 
    type: "lunch", 
    time: "25 min", 
    servings: 4,
    ingredients: [
      { name: "Pasta", quantity: "400g" },
      { name: "Tomates", quantity: "500g" },
      { name: "Cebolla", quantity: "1 unidad" },
      { name: "Ajo", quantity: "2 dientes" },
      { name: "Albahaca", quantity: "al gusto" },
      { name: "Aceite de oliva", quantity: "2 cucharadas" }
    ]
  },
  { 
    name: "Ensalada César", 
    type: "lunch", 
    time: "15 min", 
    servings: 2,
    ingredients: [
      { name: "Lechuga romana", quantity: "1 unidad" },
      { name: "Pechuga de pollo", quantity: "200g" },
      { name: "Pan", quantity: "100g" },
      { name: "Queso parmesano", quantity: "50g" },
      { name: "Salsa César", quantity: "100ml" }
    ]
  },
  { 
    name: "Arroz con Verduras", 
    type: "lunch", 
    time: "30 min", 
    servings: 4,
    ingredients: [
      { name: "Arroz", quantity: "300g" },
      { name: "Zanahoria", quantity: "2 unidades" },
      { name: "Arvejas", quantity: "150g" },
      { name: "Pimiento", quantity: "1 unidad" },
      { name: "Cebolla", quantity: "1 unidad" },
      { name: "Salsa de soja", quantity: "2 cucharadas" }
    ]
  },
  { 
    name: "Sándwich de Atún", 
    type: "lunch", 
    time: "10 min", 
    servings: 2,
    ingredients: [
      { name: "Pan", quantity: "4 rebanadas" },
      { name: "Atún en lata", quantity: "200g" },
      { name: "Mayonesa", quantity: "2 cucharadas" },
      { name: "Lechuga", quantity: "4 hojas" },
      { name: "Tomate", quantity: "1 unidad" }
    ]
  },
  { 
    name: "Sopa de Lentejas", 
    type: "lunch", 
    time: "40 min", 
    servings: 6,
    ingredients: [
      { name: "Lentejas", quantity: "300g" },
      { name: "Zanahoria", quantity: "2 unidades" },
      { name: "Cebolla", quantity: "1 unidad" },
      { name: "Chorizo", quantity: "200g" },
      { name: "Caldo de verduras", quantity: "1.5 litros" },
      { name: "Pimentón", quantity: "1 cucharadita" }
    ]
  },
  // Cenas
  { 
    name: "Salmón a la Plancha", 
    type: "dinner", 
    time: "20 min", 
    servings: 2,
    ingredients: [
      { name: "Filete de salmón", quantity: "400g" },
      { name: "Limón", quantity: "1 unidad" },
      { name: "Aceite de oliva", quantity: "2 cucharadas" },
      { name: "Sal y pimienta", quantity: "al gusto" },
      { name: "Espárragos", quantity: "200g" }
    ]
  },
  { 
    name: "Pizza Casera", 
    type: "dinner", 
    time: "35 min", 
    servings: 4,
    ingredients: [
      { name: "Masa de pizza", quantity: "1 unidad" },
      { name: "Salsa de tomate", quantity: "200ml" },
      { name: "Queso mozzarella", quantity: "250g" },
      { name: "Pepperoni", quantity: "100g" },
      { name: "Orégano", quantity: "al gusto" }
    ]
  },
  { 
    name: "Ensalada de Quinoa", 
    type: "dinner", 
    time: "15 min", 
    servings: 3,
    ingredients: [
      { name: "Quinoa", quantity: "200g" },
      { name: "Tomate cherry", quantity: "150g" },
      { name: "Pepino", quantity: "1 unidad" },
      { name: "Queso feta", quantity: "100g" },
      { name: "Aceite de oliva", quantity: "3 cucharadas" }
    ]
  },
  { 
    name: "Tacos de Pollo", 
    type: "dinner", 
    time: "25 min", 
    servings: 4,
    ingredients: [
      { name: "Tortillas", quantity: "8 unidades" },
      { name: "Pechuga de pollo", quantity: "500g" },
      { name: "Lechuga", quantity: "1 unidad" },
      { name: "Tomate", quantity: "2 unidades" },
      { name: "Queso rallado", quantity: "100g" },
      { name: "Crema agria", quantity: "100ml" }
    ]
  },
  { 
    name: "Sopa de Verduras", 
    type: "dinner", 
    time: "30 min", 
    servings: 4,
    ingredients: [
      { name: "Zanahoria", quantity: "2 unidades" },
      { name: "Zapallo", quantity: "300g" },
      { name: "Apio", quantity: "2 tallos" },
      { name: "Cebolla", quantity: "1 unidad" },
      { name: "Caldo de verduras", quantity: "1 litro" }
    ]
  },
  { 
    name: "Milanesas con Puré", 
    type: "dinner", 
    time: "35 min", 
    servings: 4,
    ingredients: [
      { name: "Carne para milanesa", quantity: "600g" },
      { name: "Pan rallado", quantity: "150g" },
      { name: "Huevos", quantity: "2 unidades" },
      { name: "Papas", quantity: "800g" },
      { name: "Leche", quantity: "100ml" },
      { name: "Mantequilla", quantity: "50g" }
    ]
  },
];

const AVAILABLE_INGREDIENTS = [
  "Pan integral", "Palta", "Sal", "Limón", "Huevos", "Leche", "Mantequilla",
  "Harina", "Azúcar", "Polvo de hornear", "Avena", "Banana", "Fresas", "Miel",
  "Yogurt natural", "Granola", "Arándanos", "Pechuga de pollo", "Papas",
  "Aceite de oliva", "Ajo", "Romero", "Pimienta", "Pasta", "Tomates", "Cebolla",
  "Albahaca", "Lechuga romana", "Queso parmesano", "Salsa César", "Arroz",
  "Zanahoria", "Arvejas", "Pimiento", "Salsa de soja", "Atún en lata", "Mayonesa",
  "Lechuga", "Tomate", "Lentejas", "Chorizo", "Caldo de verduras", "Pimentón",
  "Filete de salmón", "Espárragos", "Masa de pizza", "Salsa de tomate",
  "Queso mozzarella", "Pepperoni", "Orégano", "Quinoa", "Tomate cherry", "Pepino",
  "Queso feta", "Tortillas", "Queso rallado", "Crema agria", "Zapallo", "Apio",
  "Carne para milanesa", "Pan rallado"
].sort((a, b) => a.localeCompare(b, 'es'));

interface Ingredient {
  name: string;
  quantity: string;
}

export const EditMealDialog = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<string>("");
  const [time, setTime] = useState("");
  const [servings, setServings] = useState("");
  const [ingredients, setIngredients] = useState<Ingredient[]>([
    { name: "", quantity: "" }
  ]);
  const [openPopovers, setOpenPopovers] = useState<Record<number, boolean>>({});
  const { toast } = useToast();

  const handleDishSelect = (dishName: string) => {
    const dish = ALL_DISHES.find(d => d.name === dishName);
    if (dish) {
      setSelectedDish(dishName);
      setTime(dish.time);
      setServings(dish.servings.toString());
      // Set actual ingredients from the dish
      setIngredients(dish.ingredients || [{ name: "", quantity: "" }]);
    }
  };

  const handleAddIngredient = () => {
    setIngredients([...ingredients, { name: "", quantity: "" }]);
  };

  const handleRemoveIngredient = (index: number) => {
    setIngredients(ingredients.filter((_, i) => i !== index));
  };

  const handleIngredientChange = (index: number, field: 'name' | 'quantity', value: string) => {
    const newIngredients = [...ingredients];
    newIngredients[index][field] = value;
    setIngredients(newIngredients);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    toast({
      title: "¡Plato modificado exitosamente!",
      description: `Los cambios en "${selectedDish}" han sido guardados.`,
    });

    setIsOpen(false);
    
    // Reset form
    setTimeout(() => {
      setSelectedDish("");
      setTime("");
      setServings("");
      setIngredients([{ name: "", quantity: "" }]);
    }, 300);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="gap-2 ml-auto bg-[#F06833] hover:bg-[#F4956E] hover:text-white text-white">
          <Edit className="w-4 h-4"  />
          Modificar Plato
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Modificar Plato</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Selector de plato */}
          <div className="space-y-2">
            <Label htmlFor="dish-select">Seleccionar Plato</Label>
            <Select value={selectedDish} onValueChange={handleDishSelect}>
              <SelectTrigger id="dish-select">
                <SelectValue placeholder="Elige un plato para modificar" />
              </SelectTrigger>
              <SelectContent>
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground">
                  Desayunos
                </div>
                {ALL_DISHES.filter(d => d.type === "breakfast").map((dish) => (
                  <SelectItem key={dish.name} value={dish.name}>
                    {dish.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                  Almuerzos
                </div>
                {ALL_DISHES.filter(d => d.type === "lunch").map((dish) => (
                  <SelectItem key={dish.name} value={dish.name}>
                    {dish.name}
                  </SelectItem>
                ))}
                <div className="px-2 py-1.5 text-sm font-semibold text-muted-foreground mt-2">
                  Cenas
                </div>
                {ALL_DISHES.filter(d => d.type === "dinner").map((dish) => (
                  <SelectItem key={dish.name} value={dish.name}>
                    {dish.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {selectedDish && (
            <>
              {/* Tiempo de preparación */}
              <div className="space-y-2">
                <Label htmlFor="time">Tiempo de Preparación</Label>
                <Input
                  id="time"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  placeholder="Ej: 30 min"
                  required
                />
              </div>

              {/* Cantidad de porciones */}
              <div className="space-y-2">
                <Label htmlFor="servings">Cantidad de Porciones</Label>
                <Input
                  id="servings"
                  type="number"
                  value={servings}
                  onChange={(e) => setServings(e.target.value)}
                  placeholder="Ej: 4"
                  min="1"
                  required
                  className="[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                />
              </div>

              {/* Ingredientes */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <Label>Ingredientes</Label>
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={handleAddIngredient}
                    className="gap-1"
                  >
                    <Plus className="w-4 h-4" />
                    Agregar
                  </Button>
                </div>
                
                <div className="space-y-3">
                  {ingredients.map((ingredient, index) => (
                    <div key={index} className="flex gap-2 items-start">
                      <div className="flex-1 space-y-1">
                        <Label htmlFor={`ingredient-name-${index}`} className="text-xs text-muted-foreground">
                          Ingrediente
                        </Label>
                        <Popover 
                          open={openPopovers[index]} 
                          onOpenChange={(open) => setOpenPopovers(prev => ({ ...prev, [index]: open }))}
                        >
                          <PopoverTrigger asChild>
                            <Button
                              variant="outline"
                              role="combobox"
                              aria-expanded={openPopovers[index]}
                              className="w-full justify-between"
                            >
                              {ingredient.name || "Seleccionar ingrediente"}
                              <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-[var(--radix-popover-trigger-width)] p-0" align="start">
                            <Command>
                              <CommandInput placeholder="Buscar ingrediente..." />
                              <CommandList>
                                <CommandEmpty>No se encontró el ingrediente.</CommandEmpty>
                                <CommandGroup>
                                  {AVAILABLE_INGREDIENTS.map((ing) => (
                                    <CommandItem
                                      key={ing}
                                      value={ing}
                                      onSelect={() => {
                                        handleIngredientChange(index, 'name', ing);
                                        setOpenPopovers(prev => ({ ...prev, [index]: false }));
                                      }}
                                    >
                                      <Check
                                        className={cn(
                                          "mr-2 h-4 w-4",
                                          ingredient.name === ing ? "opacity-100" : "opacity-0"
                                        )}
                                      />
                                      {ing}
                                    </CommandItem>
                                  ))}
                                </CommandGroup>
                              </CommandList>
                            </Command>
                          </PopoverContent>
                        </Popover>
                      </div>
                      <div className="w-32 space-y-1">
                        <Label htmlFor={`ingredient-quantity-${index}`} className="text-xs text-muted-foreground">
                          Cantidad
                        </Label>
                        <Input
                          id={`ingredient-quantity-${index}`}
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                          placeholder="Ej: 200g"
                          required
                        />
                      </div>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-destructive hover:text-destructive mt-6 border-2 border-border"
                        >
                          <Trash2 className="w-4 h-4 " />
                        </Button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Botones de acción */}
              <div className="flex gap-3 pt-4">
                <Button type="submit" className="flex-1">
                  Guardar Cambios
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsOpen(false)}
                >
                  Cancelar
                </Button>
              </div>
            </>
          )}
        </form>
      </DialogContent>
    </Dialog>
  );
};