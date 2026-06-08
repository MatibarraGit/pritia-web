import { CreditCard, Truck } from 'lucide-react';
import { cn } from '@/libs/utils';
import { ServiceType } from '@/types';

const services: ServiceType[] = [
  {
    id: 1,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10 text-primary">
        <rect width="20" height="14" x="2" y="7" rx="2" ry="2"/>
        <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>
      </svg>
    ),
    title: 'Amplio catálogo',
    description: 'Miles de productos para tu hogar',
  },
  {
    id: 2,
    icon: (<Truck size={40} color='#20B156' className="mx-auto" />),
    title: 'Envíos a todo el país',
    description: 'Entregamos tus productos en la puerta de tu casa',
  },
  {
    id: 3,
    icon: (<CreditCard size={40} color='#20B156' className="mx-auto" />),
    title: 'Pagá con tarjeta',
    description: 'Aceptamos todos los métodos de pago de Mercado Pago',
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10 text-primary">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    title: 'Atención personalizada',
    description: 'Te ayudamos a encontrar la solución que necesitas',
  },
];

export const ServicesHighlight = () => {
  return (
    <section className="w-11/12 max-w-content mx-auto pt-8 pb-12">
      <div className="container mx-auto">
        <h2 className="mb-6 text-2xl font-subheading text-center md:text-3xl">Nuestros Servicios</h2>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {services.map((service) => (
            <div 
              key={service.id}
              className={cn(
                "bg-white rounded-lg shadow-md p-6 text-center transition-transform hover:transform hover:scale-105"
              )}
            >
              <div className="mb-4">
                {typeof service.icon === 'function' ? (
                  <service.icon className="mx-auto h-10 w-10 text-primary" />
                ) : (
                  service.icon
                )}
              </div>
              <h3 className="text-xl mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

