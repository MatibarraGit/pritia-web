import { Badge } from "@/components/ui/badge";
import { formatPrice } from "@/utils";

interface ProductPricingProps {
  price: number;
  discountPercent: number;
  originalPrice?: number;
}

export function ProductPricing({
  price,
  discountPercent,
  originalPrice
}: ProductPricingProps) {

  // TODO: Eliminar al finalizar HotSale
  // Inicializamos con null pero especificamos el tipo de la interfaz
  // const [timeLeft, setTimeLeft] = useState<TimeLeft | null>(null);

  // useEffect(() => {
  //   function tick() {
  //     const now = new Date();
  //     const diff = DEADLINE.getTime() - now.getTime();

  //     if (diff <= 0) {
  //       setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  //       return;
  //     }

  //     setTimeLeft({
  //       days: Math.floor(diff / 86400000),
  //       hours: Math.floor((diff % 86400000) / 3600000),
  //       minutes: Math.floor((diff % 3600000) / 60000),
  //       seconds: Math.floor((diff % 60000) / 1000),
  //     });
  //   }

  //   tick();
  //   const id = setInterval(tick, 1000);
  //   return () => clearInterval(id);
  // }, []);

  // Comprobación de seguridad para el renderizado
  // const isExpired = timeLeft && Object.values(timeLeft).every((v) => v === 0);
  
  const hasDiscount = discountPercent > 0 && originalPrice;
  // const isHotSale = EVENTS.IS_HOT_SALE && hasDiscount;
  const savings = hasDiscount ? originalPrice - price : 0;

  return (
    <div className="h-full flex flex-col border-l-4 border-lime-500 pl-4 lg:flex-row lg:items-center lg:justify-between lg:gap-8">

      <div className="py-2">
        {originalPrice && (
          <div className="flex items-center gap-2">
            <span className="text-md line-through text-gray-500">
              {formatPrice(originalPrice)}
            </span>
          </div>
        )}

        <div className="flex items-center gap-2">
          <p className="text-3xl font-subheading leading-tight text-gray-950">
            {formatPrice(price)}
          </p>

          {discountPercent > 0 && (
            // <Badge className={`text-white ${isHotSale ? 'bg-orange-500' : 'bg-primary'}`}>
            <Badge className={`text-white bg-primary`}>
              {discountPercent}% OFF
            </Badge>
          )}
        </div>

        <div className="my-1 flex flex-col gap-2 text-xs text-green-600">
        {/* Ahorro en pesos */}
          {hasDiscount && (
            <div className="flex gap-1"> 
              <strong>Ahorrás</strong>
              <span>{formatPrice(savings)}</span>
            </div>
          )}

          {/* {isHotSale && (
            <span className="w-fit px-2 flex gap-1 rounded-lg bg-green-400/20"> 
              Envío 
              <strong>GRATIS</strong>
            </span>
          )} */}
        </div>
      </div>

      <div className="flex gap-3 text-sm text-gray-500 lg:order-2">
        <span className="mt-1 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-lime-100 text-sm font-subheading text-lime-700">
          $
        </span>
        <div>
          <p className="font-subheading text-lime-700">Precio especial Pritia</p>
          <p>Pagando en efectivo, transferencia o depósito bancario</p>
        </div>
      </div>
    </div>
  );
}


// <div 
      // className="-mt-3"
      // style={{
      //   background: `${discountPercent > 0 && isHotSale && "linear-gradient(to bottom, #ffffff, #ffba6f)"}`
      // }}    
    // >
      {/* {discountPercent > 0 && (
        <div className="flex flex-col justify-center-center gap-2">
          {(isHotSale && isExpired) ? (
            <span className="font-black text-lg leading-none tracking-tight text-gray-900">
              ¡El Hot Sale ha finalizado!
            </span>
          ) : timeLeft && (
            <div 
              className="w-full flex items-center justify-center flex-col gap-2 text-lg leading-none tracking-tight text-black px-2 py-2 md:flex-row gap md:justify-between"
              style={{
                background: "linear-gradient(90deg, #ffa356 20%, #f71316 100%)"
              }}  
            > 
              <strong className="text-white italic">LA OFERTA FINALIZA EN</strong>

              <div className="flex items-center gap-2 font-subheading">
                <span className="w-fit p-1 bg-white/55 rounded-lg">{pad(timeLeft.days)}</span>
                <span>:</span>
                <span className="w-fit p-1 bg-white/55 rounded-lg">{pad(timeLeft.hours)}</span>
                <span>:</span>
                <span className="w-fit p-1 bg-white/55 rounded-lg">{pad(timeLeft.minutes)}</span>
                <span>:</span>
                <span className="w-fit p-1 bg-white/55 rounded-lg">{pad(timeLeft.seconds)}</span>
              </div>
            </div>
          )}
        </div>
      )} */}
      
    // {/* </div> */}