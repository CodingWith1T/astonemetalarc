import ProjectsClient from "./_components/ProjectsClient";
import { locationStaticParams } from "@/app/admin/_lib/locations-data";

export const generateStaticParams = async () => locationStaticParams;

export default function ProjectsPage() {
  return <ProjectsClient />;
}
