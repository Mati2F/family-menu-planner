import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Download, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import jsPDF from "jspdf";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Sample ingredients data with quantities - in a real app this would come from a database
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

// Ingredient categories
const INGREDIENT_CATEGORIES = {
  "Proteínas": [
    "Pollo entero", "Pollo", "Salmón", "Huevos", "Carne para milanesas", "Atún en lata", "Lenteja", "Quinoa"
  ],
  "Lácteos": [
    "Leche", "Mantequilla", "Queso mozzarella", "Queso parmesano", "Yogurt natural"
  ],
  "Verduras": [
    "Papa", "Tomate", "Cebolla", "Ajo", "Zanahoria", "Arveja", "Lechuga", "Lechuga romana", 
    "Pepino", "Cebolla morada", "Pimiento", "Calabacín", "Apio", "Palta"
  ],
  "Frutas": [
    "Manzana", "Banana", "Limón", "Fruta del bosque"
  ],
  "Granos y Cereales": [
    "Pan integral", "Pan", "Harina", "Pasta", "Arroz", "Avena", "Granola", "Pan rallado", "Tortilla"
  ],
  "Condimentos y Especias": [
    "Sal", "Pimienta", "Romero", "Albahaca", "Eneldo", "Miel", "Canela", "Cilantro"
  ],
  "Aceites y Salsas": [
    "Aceite de oliva", "Mayonesa", "Salsa de tomate"
  ],
  "Otros": [
    "Azúcar", "Polvo de hornear", "Levadura", "Caldo de verduras", "Tomate en lata"
  ]
};

// Function to normalize ingredient names
const normalizeIngredient = (ingredient: string): string => {
  const normalizations: { [key: string]: string } = {
    "tomates": "tomate",
    "papas": "papa", 
    "arvejas": "arveja",
    "lentejas": "lenteja",
    "tortillas": "tortilla",
    "frutas del bosque": "fruta del bosque"
  };
  
  const lower = ingredient.toLowerCase();
  return normalizations[lower] || ingredient;
};

// Function to sum quantities numerically
const sumQuantities = (quantities: string[]): string => {
  // Handle special cases first
  if (quantities.some((q) => q.trim() === 'al gusto')) return 'al gusto';

  // Helper to parse a quantity string into numeric value and unit
  const parseQty = (raw: string): { value: number; unit: string } => {
    const qty = raw.trim();

    // Mixed number: "1 1/2 unidad(es)"
    let m = qty.match(/^(\d+)\s+(\d+)\/(\d+)\s*(.*)$/);
    if (m) {
      const whole = parseFloat(m[1]);
      const num = parseFloat(m[2]);
      const den = parseFloat(m[3]);
      const unit = (m[4] || '').trim();
      return { value: whole + num / den, unit };
    }

    // Simple fraction: "1/2 unidad(es)"
    m = qty.match(/^(\d+)\/(\d+)\s*(.*)$/);
    if (m) {
      const num = parseFloat(m[1]);
      const den = parseFloat(m[2]);
      const unit = (m[3] || '').trim();
      return { value: num / den, unit };
    }

    // Decimal or integer: "2.5 unidades" o "2 unidades"
    m = qty.match(/^(\d+(?:\.\d+)?)\s*(.*)$/);
    if (m) {
      const unit = (m[2] || '').trim();
      return { value: parseFloat(m[1]), unit };
    }

    return { value: 0, unit: '' };
  };

  // Sum numeric values and keep the first non-empty unit
  let unit = '';
  const total = quantities.reduce((sum, q) => {
    const { value, unit: u } = parseQty(q);
    if (!unit && u) unit = u;
    return sum + value;
  }, 0);

  const EPS = 1e-6;
  if (total > 0) {
    const whole = Math.round(total);
    const frac = total - Math.floor(total);

    // Exact integer
    if (Math.abs(total - whole) < EPS) {
      const result = `${whole}`;
      return unit ? `${result} ${unit}` : result;
    }

    // Half increments
    const wholeDown = Math.floor(total + EPS);
    if (Math.abs(frac - 0.5) < EPS) {
      const result = wholeDown > 0 ? `${wholeDown} 1/2` : `1/2`;
      return unit ? `${result} ${unit}` : result;
    }

    // Fallback to one decimal
    const result = `${total.toFixed(1)}`;
    return unit ? `${result} ${unit}` : result;
  }

  // If nothing was parsed, return the raw list
  return quantities.join(', ');
};
interface ShoppingListProps {
  selectedMeals: { [key: string]: { breakfast?: string; lunch?: string; dinner?: string } };
}

export const ShoppingList = ({ selectedMeals }: ShoppingListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());
  const [selectedDay, setSelectedDay] = useState<string>("cualquiera");

  const DAYS = ["Lunes", "Martes", "Miércoles", "Jueves", "Viernes", "Sábado", "Domingo"];

  // Collect all ingredients from all days with their quantities
  const allIngredients: { [ingredient: string]: string[] } = {};
  
  Object.entries(selectedMeals).forEach(([day, dayMeals]) => {
    // If a specific day is selected, only process that day
    if (selectedDay !== "cualquiera" && day !== selectedDay) return;
    
    Object.values(dayMeals).forEach(dish => {
      if (dish && DISH_INGREDIENTS[dish]) {
        Object.entries(DISH_INGREDIENTS[dish]).forEach(([ingredient, quantity]) => {
          const normalizedIngredient = normalizeIngredient(ingredient);
          if (!allIngredients[normalizedIngredient]) {
            allIngredients[normalizedIngredient] = [];
          }
          allIngredients[normalizedIngredient].push(quantity);
        });
      }
    });
  });

  // Sum quantities for each ingredient
  const consolidatedIngredients: { [ingredient: string]: string } = {};
  Object.entries(allIngredients).forEach(([ingredient, quantities]) => {
    consolidatedIngredients[ingredient] = sumQuantities(quantities);
  });

  // Group ingredients by category
  const ingredientsByCategory: { [category: string]: { [ingredient: string]: string } } = {};
  
  Object.entries(consolidatedIngredients).forEach(([ingredient, quantity]) => {
    let category = "Otros";
    
    // Find the category for this ingredient
    for (const [cat, ingredients] of Object.entries(INGREDIENT_CATEGORIES)) {
      if (ingredients.some(catIngredient => 
        normalizeIngredient(catIngredient).toLowerCase() === ingredient.toLowerCase()
      )) {
        category = cat;
        break;
      }
    }
    
    if (!ingredientsByCategory[category]) {
      ingredientsByCategory[category] = {};
    }
    ingredientsByCategory[category][ingredient] = quantity;
  });

  const totalIngredients = Object.keys(consolidatedIngredients).length;

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
  const totalCount = totalIngredients;

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text("Lista de Compras", 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generada el: ${new Date().toLocaleDateString('es-ES')}`, 20, 45);
    
    // Selected day filter
    if (selectedDay !== "cualquiera") {
      doc.text(`Día seleccionado: ${selectedDay}`, 20, 55);
    }
    
    let yPosition = selectedDay !== "cualquiera" ? 75 : 65;
    
    // Categories and ingredients
    Object.entries(ingredientsByCategory).forEach(([category, ingredients]) => {
      if (Object.keys(ingredients).length === 0) return;
      
      // Category title
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(category, 20, yPosition);
      yPosition += 10;
      
      // Ingredients for this category
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      Object.entries(ingredients).forEach(([ingredient, quantity]) => {
        const isChecked = checkedItems.has(ingredient);
        const checkbox = isChecked ? '☑' : '☐';
        
        doc.text(`${checkbox} ${ingredient} (${quantity})`, 25, yPosition);
        yPosition += 8;
        
        // Add new page if needed
        if (yPosition > 270) {
          doc.addPage();
          yPosition = 30;
        }
      });
      
      yPosition += 5; // Space between categories
    });
    
    // Save the PDF
    doc.save('lista-de-compras.pdf');
  };

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
          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={downloadPDF}
                  className="flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  Descargar PDF
                </Button>
                <Badge variant="secondary" className="text-sm">
                  {checkedCount}/{totalCount} completados
                </Badge>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {totalCount === 0 ? (
          <p className="text-center text-muted-foreground py-8">
            Agrega platos al calendario para generar tu lista de compras
          </p>
        ) : (
          <div className="space-y-6">
            {/* Day Filter */}
            <div className="flex items-center gap-3">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    {selectedDay === "cualquiera" ? "Cualquiera" : selectedDay}
                    <ChevronDown className="w-4 h-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem onClick={() => setSelectedDay("cualquiera")}>
                    Cualquiera
                  </DropdownMenuItem>
                  {DAYS.map(day => (
                    <DropdownMenuItem key={day} onClick={() => setSelectedDay(day)}>
                      {day}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              <span className="text-sm text-muted-foreground">
                Haga click para seleccionar los ingredientes de un día específico
              </span>
            </div>

            {/* Ingredients by Category */}
            {Object.entries(ingredientsByCategory).map(([category, ingredients]) => {
              if (Object.keys(ingredients).length === 0) return null;
              
              return (
                <div key={category}>
                  <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-primary"></div>
                    {category}
                  </h4>
                  <div className="space-y-2 ml-4">
                    {Object.entries(ingredients).map(([ingredient, quantity]) => {
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
                          <div className="flex items-center gap-3 w-full">
                            <div className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                              isChecked 
                                ? 'bg-primary border-primary' 
                                : 'border-muted-foreground/30'
                            }`}>
                              {isChecked && <Check className="w-3 h-3 text-white" />}
                            </div>
                            <div className="flex-1 text-left">
                              <div className="font-medium">{ingredient}</div>
                              <div className="text-sm text-muted-foreground">{quantity}</div>
                            </div>
                          </div>
                        </Button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};