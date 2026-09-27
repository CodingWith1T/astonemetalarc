import ProjectDetailsClient from "./_components/ProjectDetailsClient";
import { generateProjectStaticParams } from "@/app/admin/_lib/locations-data";

export const generateStaticParams = async () => {
  return generateProjectStaticParams();
};

export default function ProjectDetailsPage() {
  return <ProjectDetailsClient />;
}
