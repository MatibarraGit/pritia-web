import Image from "next/image";

interface MagnifyingGlassProps {
  className?: string;
  type?: "button" | "submit" | "reset";
}

export const MagnifyingGlass = ({ className, type = "button" }: MagnifyingGlassProps) => {
  return (
    <button className={className} type={type}>
      <Image
        src="/icons/magnifying-glass.svg"
        alt="Lupa"
        width={20}
        height={20}
        className="center-flex"
      />
    </button>
  );
};



