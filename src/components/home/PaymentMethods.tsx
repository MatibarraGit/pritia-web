// TODO: Adaptar el nombre del componente y el contenido
export const PaymentMethods = () => {
  return (
    <div className="bg-gray-100 py-6">
      <div className="container w-11/12 max-width-screen mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
          
          {/* Payment methods */}
          <div className="flex items-center justify-center md:justify-start">
            <div className="flex items-center ">
              <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round" className="text-blue-600">
                <rect width="16" height="14" x="2" y="5" rx="2"/>
                <line x1="2" x2="18" y1="10" y2="10"/>
              </svg>
            </div>
            <span className="text-sm font-medium">Múltiples métodos de pago</span>
          </div>
          
          {/* Free shipping */}
          <div className="flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary mr-2">
              <path d="m8 12 3 3 5-5"/>
              <circle cx="12" cy="12" r="10"/>
            </svg>
            <span className="text-sm font-medium">Envíos a todo el país mediante Via Cargo</span>
          </div>
          
          {/* Store pickup */}
          <div className="flex items-center justify-center md:justify-end">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-secondary mr-2">
              <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z"/>
              <circle cx="12" cy="10" r="3"/>
            </svg>
            <span className="text-sm font-medium">Salguero 911 - Loma Hermosa </span>
          </div>
        </div>
      </div>
    </div>
  );
};

