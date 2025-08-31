function FloatingPanel({ children }: React.PropsWithChildren) {
  return (
    <div className="flex items-center justify-center gap-2 px-2 py-1.5 border border-gray-200 bg-gray-100 rounded-4xl">
      {children}
    </div>
  );
}

export default FloatingPanel;
