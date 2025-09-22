import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Shuffle, Plus } from "lucide-react";

interface InitialScreenProps {
  onSelectMode: (mode: 'manual' | 'random') => void;
}

export const InitialScreen = ({ onSelectMode }: InitialScreenProps) => {
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card className="shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer" 
                onClick={() => onSelectMode('random')}>
            <CardHeader className="text-center">
              <div className="mx-auto mb-4 p-4 bg-gradient-warm rounded-full w-16 h-16 flex items-center justify-center">
                <Shuffle className="w-8 h-8 text-white" />
              </div>
              <CardTitle className="text-xl">Programa Predefinido</CardTitle>
              <CardDescription>
                Obtén una programación completa generada automáticamente
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
                Generar Programa
              </Button>
            </CardContent>
          </Card>

          <Card className="shadow-card hover:shadow-soft transition-all duration-300 cursor-pointer"
                onClick={() => onSelectMode('manual')}>
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
                Comenzar Vacío
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};