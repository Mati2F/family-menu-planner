import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Edit, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

const ALL_DISHES = [
  // Desayunos
  { name: "Tostadas con Palta", type: "breakfast", time: "10 min", servings: 2 },
  { name: "Huevos Revueltos", type: "breakfast", time: "15 min", servings: 2 },
  { name: "Pancakes", type: "breakfast", time: "20 min", servings: 4 },
  { name: "Avena con Frutas", type: "breakfast", time: "5 min", servings: 2 },
  { name: "Yogurt con Granola", type: "breakfast", time: "5 min", servings: 1 },
  // Almuerzos
  { name: "Pollo al Horno con Papas", type: "lunch", time: "45 min", servings: 4 },
  { name: "Pasta con Salsa de Tomate", type: "lunch", time: "25 min", servings: 4 },
  { name: "Ensalada César", type: "lunch", time: "15 min", servings: 2 },
  { name: "Arroz con Verduras", type: "lunch", time: "30 min", servings: 4 },
  { name: "Sándwich de Atún", type: "lunch", time: "10 min", servings: 2 },
  { name: "Sopa de Lentejas", type: "lunch", time: "40 min", servings: 6 },
  // Cenas
  { name: "Salmón a la Plancha", type: "dinner", time: "20 min", servings: 2 },
  { name: "Pizza Casera", type: "dinner", time: "35 min", servings: 4 },
  { name: "Ensalada de Quinoa", type: "dinner", time: "15 min", servings: 3 },
  { name: "Tacos de Pollo", type: "dinner", time: "25 min", servings: 4 },
  { name: "Sopa de Verduras", type: "dinner", time: "30 min", servings: 4 },
  { name: "Milanesas con Puré", type: "dinner", time: "35 min", servings: 4 },
];

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
  const { toast } = useToast();

  const handleDishSelect = (dishName: string) => {
    const dish = ALL_DISHES.find(d => d.name === dishName);
    if (dish) {
      setSelectedDish(dishName);
      setTime(dish.time);
      setServings(dish.servings.toString());
      // Set some example ingredients
      setIngredients([
        { name: "Ingrediente 1", quantity: "200g" },
        { name: "Ingrediente 2", quantity: "1 unidad" },
      ]);
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
        <Button variant="outline" className="gap-2">
          <Edit className="w-4 h-4" />
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
                    <div key={index} className="flex gap-2">
                      <div className="flex-1">
                        <Input
                          value={ingredient.name}
                          onChange={(e) => handleIngredientChange(index, 'name', e.target.value)}
                          placeholder="Nombre del ingrediente"
                          required
                        />
                      </div>
                      <div className="w-32">
                        <Input
                          value={ingredient.quantity}
                          onChange={(e) => handleIngredientChange(index, 'quantity', e.target.value)}
                          placeholder="Cantidad"
                          required
                        />
                      </div>
                      {ingredients.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveIngredient(index)}
                          className="text-destructive hover:text-destructive"
                        >
                          <Trash2 className="w-4 h-4" />
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