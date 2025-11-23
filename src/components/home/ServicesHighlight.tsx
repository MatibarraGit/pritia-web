import { Truck } from 'lucide-react';
import { cn } from '@/libs/utils';
import { ServiceType } from '@/types';

// TODO: Cambiar los servicios por los reales
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
    icon: <Truck />,
    title: 'Envíos a todo el país',
    description: 'Entregamos tus productos en la puerta de tu casa',
  },
  {
    id: 3,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10 text-accent">
        <path d="M19 14c1.49-1.46 3-3.21 3-5.5A5.5 5.5 0 0 0 16.5 3c-1.76 0-3 .5-4.5 2-1.5-1.5-2.74-2-4.5-2A5.5 5.5 0 0 0 2 8.5c0 2.3 1.5 4.05 3 5.5l7 7Z"/>
      </svg>
    ),
    title: 'Garantía de calidad',
    description: 'Todos nuestros productos con garantía',
  },
  {
    id: 4,
    icon: (
      <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="mx-auto h-10 w-10 text-primary">
        <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
      </svg>
    ),
    title: 'Atención personalizada',
    description: 'Asesores especializados a tu servicio',
  },
];

export const ServicesHighlight = () => {
  return (
    <section className="w-11/12 max-width-screen mx-auto py-12">
      <div className="container mx-auto">
        <h2 className="text-3xl font-subheading text-center mb-12 text-accent">Nuestros Servicios</h2>
        
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
              <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
              <p className="text-gray-600">{service.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

