import type { Tour } from "@/types/tour";
import { TourCard } from "@/components/molecules/tour-card";

export function ToursGrid({ tours }: { tours: Tour[] }) {
  return (
    <div className="grid gap-8 sm:grid-cols-2 xl:grid-cols-3">
      {tours.map((tour, index) => (
        <TourCard key={tour._id} tour={tour} index={index} />
      ))}
    </div>
  );
}
