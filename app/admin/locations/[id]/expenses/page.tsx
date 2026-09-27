import ExpensesClient from "./_components/ExpensesClient";
import { locationStaticParams } from "@/app/admin/_lib/locations-data";

export const generateStaticParams = async () => locationStaticParams;

export default function ExpensesPage() {
  return <ExpensesClient />;
}
