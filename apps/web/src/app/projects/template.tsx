export default function ProjectsWrapper({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div>
      <h1>Project</h1>
      <main>{children}</main>
    </div>
  );
}
