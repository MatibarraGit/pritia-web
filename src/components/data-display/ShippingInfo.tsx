import { Car, Mail, MapPin, Truck } from "lucide-react";

export const ShippingInfo = () => {
  const localShippingZones = [
    "Cañuelas",
    "Virrey del Pino",
    "G. Catán",
    "G. Laferrere",
    "San Justo",
    "Morón",
  ];

  return (
    <>
      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/10">
          <Truck className="w-5 h-5 text-primary" />
        </div>
        <h2 className="text-xl font-subheading">Información de Envíos</h2>
      </div>

      {/* Sección envíos locales */}
      <div className="mb-6">
        <div className="flex items-center gap-2 mb-3">
          <Car className="w-5 h-5 text-green-600" />
          <h3 className="text-base font-subheading">Envíos por Nuestra Cuenta</h3>
        </div>

        <p className="mb-4 text-sm text-gray-600">
          Realizamos envíos gratuitos o con costo reducido a las siguientes
          zonas:
        </p>

        <div className="grid grid-cols-2 gap-2 md:grid-cols-3">
          {localShippingZones.map((zone) => (
            <div key={zone} className="flex items-center gap-2 p-2 rounded-md bg-green-500/10">
              <MapPin className="w-4 h-4 text-green-600 shrink-0" />
              <span className="text-sm text-gray-700">{zone}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Sección envíos nacionales */}
      <div className="mb-2 pt-6 border-t border-gray-200">
        <div className="flex items-center gap-2 mb-3">
          <Mail className="w-4 h-4 text-primary" />
          <h3 className="text-base font-subheading">Envíos a Todo el País</h3>
        </div>
        <p className="text-sm text-gray-600">
          Enviamos a cualquier lugar de Argentina mediante correo postal. Los
          gastos de envío corren por cuenta del comprador y se calculan según
          destino y peso del paquete.
        </p>
      </div>

      {/* Nota */}
      <div className="p-4 rounded-lg bg-primary/10 border border-primary/20">
        <div className="text-sm font-medium text-primary">
          Consultá disponibilidad y costos de envío antes de realizar tu compra
        </div>
      </div>
    </>
  );
};

