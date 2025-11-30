interface ProductHeaderProps {
  name: string;
}

export function ProductHeader({ name }: ProductHeaderProps) {
  return (
    <div>
      <h1 className="text-2xl md:text-3xl font-subheading text-gray-900">
        {name}
      </h1>
    </div>
  );
}

