import "./projects.styles.css";
import { BreadCrumb } from "../_components/Breadcrumb";

export default function ProjectsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="project-wrapper">
      <BreadCrumb
        options={[
          { path: "/", label: "Home" },
          { path: "/projects", label: "Projects" },
          { label: "Current" },
        ]}
      />
      {children}
    </div>
  );
}
