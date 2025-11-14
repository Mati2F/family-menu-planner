import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Shuffle, Plus } from "lucide-react";
import { useState } from "react";

interface InitialScreenProps {
  onSelectMode: (mode: 'manual' | 'random', defaultServings?: number) => void;
}

export const InitialScreen = ({ onSelectMode }: InitialScreenProps) => {
  const [defaultServings, setDefaultServings] = useState<number>(2);
  return (
    <div className="min-h-screen bg-gradient-soft flex items-center justify-center p-4">
      <div className="max-w-4xl w-full">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-foreground mb-4">
            ¡Bienvenido a tu Menú Familiar!
          </h1>
          <p className="text-lg text-muted-foreground">
            Elige cómo quieres comenzar a planificar tus comidas
          </p>
        </div>

        <div className="mb-6">
          <Card className="shadow-card">
            <CardContent className="pt-6">
              <div className="flex flex-col sm:flex-row items-center gap-4">
                <Label htmlFor="defaultServings" className="text-base whitespace-nowrap">
                  Porciones por defecto:
                </Label>
                <Input
                  id="defaultServings"
                  type="number"
                  min="1"
                  value={defaultServings}
                  onChange={(e) => setDefaultServings(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center border-2"
                  style={{
                    MozAppearance: 'textfield',
                    WebkitAppearance: 'none',
                    appearance: 'none'
                  }}
                />
                <p className="text-sm text-muted-foreground">
                  Esta será la cantidad inicial de porciones para cada plato
                </p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer" 
                onClick={() => onSelectMode('random', defaultServings)}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-warm rounded-full w-16 h-16 flex items-center justify-center">
                <Shuffle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Programa Predefinido</CardTitle>
              <CardDescription>
                <p>Obtén una programación completa</p>
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• Programación completa para toda la semana</li>
                <li>• Variedad balanceada de platos</li>
                <li>• Lista de compras automática</li>
                <li>• Perfecto para familias ocupadas</li>
              </ul>
              <Button className="w-full bg-gradient-warm hover:opacity-90" size="lg">
                Generar Programa con Platos
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer"
                onClick={() => onSelectMode('manual', defaultServings)}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-fresh rounded-full w-16 h-16 flex items-center justify-center">
                <Plus className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Planificación Manual</CardTitle>
              <CardDescription>
                Selecciona tus platos favoritos día por día
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground mb-6">
                <li>• Control total sobre tu menú</li>
                <li>• Agrega solo lo que te gusta</li>
                <li>• Flexibilidad completa</li>
                <li>• Ideal para gustos específicos</li>
              </ul>
              <Button className="w-full bg-gradient-fresh hover:opacity-90" size="lg">
                <p>Generar Programa sin Platos</p>
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};