import { ChefHat, Calendar, Users } from "lucide-react";

export const AppHeader = () => {
  return (
    <header className="bg-gradient-soft border-b border-border/50">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-3 bg-gradient-warm rounded-2xl shadow-soft">
              <ChefHat className="w-8 h-8 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                Menú Familiar
              </h1>
              <p className="text-muted-foreground">
                Planifica tus comidas semanales
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
