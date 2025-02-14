
import { TravelForm } from "@/components/TravelForm";

const Index = () => {
  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-b from-primary to-background">
      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
      <div className="container relative">
        <div className="flex flex-col items-center justify-center min-h-screen text-center space-y-8 py-16">
          <div className="space-y-4 animate-floating">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tighter">
              Your Perfect Trip Awaits
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground max-w-[600px] mx-auto">
              Let AI craft your personalized travel itinerary based on your preferences
            </p>
          </div>
          <TravelForm />
        </div>
      </div>
    </div>
  );
};

export default Index;
