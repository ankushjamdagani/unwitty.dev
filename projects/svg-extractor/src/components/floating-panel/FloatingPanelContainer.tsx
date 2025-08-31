function FloatingPanelContainer({ children }: React.PropsWithChildren) {
  return (
    <section className="grid grid-cols-12 grid-rows-8 absolute top-10 left-10 right-10 bottom-10 z-10">
      {children}
    </section>
  );
}

export default FloatingPanelContainer;
