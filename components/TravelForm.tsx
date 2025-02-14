
import React from "react";
import { DateRange } from "react-day-picker";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { DatePickerWithRange } from "./DatePickerWithRange";
import { ScrollArea } from "./ui/scroll-area";

export function TravelForm() {
  const [loading, setLoading] = React.useState(false);
  const [date, setDate] = React.useState<DateRange | undefined>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    // Add form submission logic here
    setTimeout(() => setLoading(false), 2000);
  };

  return (
    <Card className="w-full max-w-xl glass-card">
      <CardHeader>
        <CardTitle className="text-2xl font-semibold">Plan Your Journey</CardTitle>
        <CardDescription>
          Tell us about your dream destination and preferences
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="destination">Destination</Label>
            <Input
              id="destination"
              placeholder="Where would you like to go?"
              className="backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label>Travel Dates</Label>
            <DatePickerWithRange date={date} setDate={setDate} />
          </div>

          <div className="space-y-2">
            <Label htmlFor="preferences">Travel Preferences</Label>
            <Textarea
              id="preferences"
              placeholder="Tell us about your interests (e.g., adventure, relaxation, culture)"
              className="h-24 backdrop-blur-sm"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="budget">Budget Level</Label>
            <select
              id="budget"
              className="w-full rounded-md border border-input bg-transparent px-3 py-2 backdrop-blur-sm"
            >
              <option value="budget">Budget</option>
              <option value="moderate">Moderate</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email Address</Label>
            <Input
              id="email"
              type="email"
              placeholder="Where should we send your itinerary?"
              className="backdrop-blur-sm"
            />
          </div>

          <Button
            type="submit"
            className="w-full bg-black text-white hover:bg-black/90"
            disabled={loading}
          >
            {loading ? "Generating Your Plan..." : "Generate Travel Plan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
