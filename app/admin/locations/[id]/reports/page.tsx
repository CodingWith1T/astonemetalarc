import ReportsClient from "./_components/ReportsClient";
import { locationStaticParams } from "@/app/admin/_lib/locations-data";

export const generateStaticParams = async () => locationStaticParams;

export default function ReportsPage() {
  return <ReportsClient />;
}
