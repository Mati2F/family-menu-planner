import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Check, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import jsPDF from "jspdf";

// Sample ingredients data - in a real app this would come from a database
const DISH_INGREDIENTS: { [key: string]: string[] } = {
  "Tostadas con Palta": ["Pan integral", "Palta", "Tomate", "Sal", "Limón"],
  "Huevos Revueltos": ["Huevos", "Leche", "Mantequilla", "Sal", "Pimienta"],
  "Pancakes": ["Harina", "Huevos", "Leche", "Azúcar", "Polvo de hornear", "Mantequilla"],
  "Pollo al Horno con Papas": ["Pollo entero", "Papa", "Cebolla", "Ajo", "Aceite de oliva", "Romero"],
  "Pasta con Salsa de Tomate": ["Pasta", "Tomate en lata", "Ajo", "Cebolla", "Albahaca", "Aceite de oliva"],
  "Salmón a la Plancha": ["Salmón", "Limón", "Aceite de oliva", "Sal", "Pimienta", "Eneldo"],
  "Pizza Casera": ["Harina", "Levadura", "Salsa de tomate", "Queso mozzarella", "Aceite de oliva"],
  "Ensalada César": ["Lechuga romana", "Queso parmesano", "Pan", "Ajo", "Limón", "Aceite de oliva"],
  "Arroz con Verduras": ["Arroz", "Zanahoria", "Arveja", "Cebolla", "Ajo", "Caldo de verduras"],
  "Avena con Frutas": ["Avena", "Leche", "Manzana", "Banana", "Miel", "Canela"],
  "Yogurt con Granola": ["Yogurt natural", "Granola", "Miel", "Fruta del bosque"],
  "Sándwich de Atún": ["Pan", "Atún en lata", "Mayonesa", "Lechuga", "Tomate"],
  "Sopa de Lentejas": ["Lenteja", "Zanahoria", "Cebolla", "Apio", "Ajo", "Caldo de verduras"],
  "Ensalada de Quinoa": ["Quinoa", "Pepino", "Tomate", "Cebolla morada", "Limón", "Aceite de oliva"],
  "Tacos de Pollo": ["Tortilla", "Pollo", "Cebolla", "Pimiento", "Limón", "Cilantro"],
  "Sopa de Verduras": ["Zanahoria", "Calabacín", "Cebolla", "Apio", "Tomate", "Caldo de verduras"],
  "Milanesas con Puré": ["Carne para milanesas", "Pan rallado", "Huevos", "Papa", "Leche", "Mantequilla"]
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

interface ShoppingListProps {
  selectedMeals: { [key: string]: { breakfast?: string; lunch?: string; dinner?: string } };
}

export const ShoppingList = ({ selectedMeals }: ShoppingListProps) => {
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set());

  // Collect all ingredients from selected meals and normalize
  const allIngredients = new Set<string>();
  Object.values(selectedMeals).forEach(dayMeals => {
    Object.values(dayMeals).forEach(dish => {
      if (dish && DISH_INGREDIENTS[dish]) {
        DISH_INGREDIENTS[dish].forEach(ingredient => {
          allIngredients.add(normalizeIngredient(ingredient));
        });
      }
    });
  });

  // Categorize ingredients
  const categorizedIngredients: { [category: string]: string[] } = {};
  
  Object.entries(INGREDIENT_CATEGORIES).forEach(([category, categoryIngredients]) => {
    const foundIngredients = Array.from(allIngredients).filter(ingredient =>
      categoryIngredients.some(catIngredient => 
        normalizeIngredient(catIngredient).toLowerCase() === ingredient.toLowerCase()
      )
    );
    if (foundIngredients.length > 0) {
      categorizedIngredients[category] = foundIngredients.sort();
    }
  });

  const totalIngredients = Array.from(allIngredients);

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
  const totalCount = totalIngredients.length;

  const downloadPDF = () => {
    const doc = new jsPDF();
    
    // Title
    doc.setFontSize(20);
    doc.text("Lista de Compras", 20, 30);
    
    // Date
    doc.setFontSize(12);
    doc.text(`Generada el: ${new Date().toLocaleDateString('es-ES')}`, 20, 45);
    
    let yPosition = 65;
    
    // Categories and ingredients
    Object.entries(categorizedIngredients).forEach(([category, ingredients]) => {
      // Category title
      doc.setFontSize(14);
      doc.setFont(undefined, 'bold');
      doc.text(category, 20, yPosition);
      yPosition += 10;
      
      // Ingredients
      doc.setFontSize(11);
      doc.setFont(undefined, 'normal');
      ingredients.forEach(ingredient => {
        const isChecked = checkedItems.has(ingredient);
        const checkbox = isChecked ? '☑' : '☐';
        doc.text(`${checkbox} ${ingredient}`, 25, yPosition);
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
            {Object.entries(categorizedIngredients).map(([category, ingredients]) => (
              <div key={category}>
                <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2">
                  <div className="w-2 h-2 rounded-full bg-primary"></div>
                  {category}
                </h4>
                <div className="space-y-2 ml-4">
                  {ingredients.map((ingredient) => {
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
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};