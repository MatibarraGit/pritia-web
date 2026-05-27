interface ProductDescriptionProps {
  description?: string | null;
}

export const ProductDescription = ({ description }: ProductDescriptionProps) => {
  const specs =
    (description ?? "")
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);

  const hasSpecs = specs.length > 0;

  return (
    <section className="bg-white px-6 py-4 rounded-lg border">
      <h2 className="text-lg font-semibold mb-4">Descripción</h2>

      {hasSpecs ? (
        <ul className="list-disc space-y-1 pl-5 text-gray-700 text-sm md:text-base">
          {specs.map((spec, index) => (
            spec.startsWith("*") ? (
              <li key={index}>{spec.slice(1)}</li>
            ) : (
              <li 
                key={index} 
                className={`list-none pl-0 ${index !== 0 ? "mt-6" : ""}`}
              >
                <span className="font-subheading">{spec}</span>
              </li>      
            )
          ))}
        </ul>
      ) : (
        <p className="text-gray-500 text-sm">
          No hay una descripción disponible para este producto.
        </p>
      )}
    </section>
  );
};
