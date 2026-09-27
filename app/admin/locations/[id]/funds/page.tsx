import LocationFundsClient from "../_components/LocationFundsClient";
import { initialLocations } from "@/app/admin/_lib/locations-data";

export const generateStaticParams = async () => {
  return initialLocations.map((loc) => ({
    id: loc.id,
  }));
};

export default function LocationFundsPage() {
  return <LocationFundsClient />;
}
