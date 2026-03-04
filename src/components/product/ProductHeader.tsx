interface ProductHeaderProps {
  name: string;
}

export function ProductHeader({ name }: ProductHeaderProps) {
  return (
    <h1 
      className="text-xl md:text-2xl"
      style={{ fontFamily: "var(--font-subheading)" }}
    >
      {name}
    </h1>
  );
}

