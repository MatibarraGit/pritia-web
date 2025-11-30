// TODO: Agregar los datos reales del negocio
// TODO: Adaptar estilos e íconos
"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, Clock } from "lucide-react";
import Image from "next/image";

import { NavigationMenu } from "@/layout/NavigationMenu";

export default function Help() {
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const faqs = [
    {
      pregunta: "¿Cómo puedo realizar un pedido?",
      respuesta: "Podés realizar tu pedido navegando por nuestro catálogo, agregando productos al carrito y haciendo click en el botón 'Finalizar Compra'. Se te redirigirá a WhatsApp con el pedido armado para coordinar la entrega y confirmar cualquier detalle."
    },
    {
      pregunta: "¿Cuáles son los métodos de pago disponibles?",
      respuesta: "Aceptamos transferencias bancarias y efectivo. También ofrecemos opciones de financiamiento en cuotas semanales y quincenales para compras superiores a $100.000."
    },
    {
      pregunta: "¿Cuánto tiempo tarda la entrega?",
      respuesta: "Los tiempos de entrega varían según tu ubicación. En las zonas detalladas en la sección 'Información de Envíos': 24-72hs. En el resto del país: 3-7 días hábiles, dependiendo del correo. Te enviaremos el código de seguimiento una vez despachado tu pedido."
    },
    {
      pregunta: "¿Puedo cambiar o devolver un producto?",
      respuesta: "Cada producto tiene un period de prueba de entre 24 y 120hs. El producto debe estar en perfectas condiciones, con su embalaje original y etiquetas. Los gastos de envío para devoluciones corren por cuenta del cliente."
    },
    {
      pregunta: "¿Ofrecen garantía en los productos?",
      respuesta: "Gran parte de nuestros productos cuentan con garantía oficial del fabricante. La duración varía según el producto. Consultanos los términos específicos de cada producto vía WhatsApp."
    },
    {
      pregunta: "¿Cómo puedo seguir mi pedido?",
      respuesta: "Una vez despachado tu pedido, recibirás un mensaje de WhatsApp con el código de seguimiento para poder revisar el estado actualizado desde la web del correo."
    },
    {
      pregunta: "¿Hacen envíos a todo el país?",
      respuesta: "Sí, realizamos envíos a toda Argentina. Los costos de envío se calculan según el peso, volumen y destino. Envíos gratuitos en compras superiores a $100.000 en las zonas detalladas en la sección 'Información de Envíos'."
    },
    {
      pregunta: "¿Puedo retirar mi pedido en el local?",
      respuesta: "¡Por supuesto! Podés retirar tu pedido en nuestro local sin costo adicional. Te avisaremos cuando esté listo para retirar y necesitarás presentarte con tu DNI y con el número de pedido."
    }
  ];

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  return (
    <>
      <NavigationMenu />
      <div className="w-full min-h-[calc(100vh-92.5px)] bg-background">
        {/* Header */}
        <div className="w-full bg-primary text-white">
          <div className="w-11/12 max-w-content mx-auto py-12 text-center">
            <h1 className="text-3xl font-heading mb-2">Centro de Ayuda</h1>
            <p className="text-lg">Encuentra respuestas a las preguntas más frecuentes</p>
          </div>
        </div>

        <div className="w-11/12 max-w-content mx-auto py-8">
          {/* Contact Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
            <a
              href="#"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center shrink-0">
                  <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">WhatsApp</h3>
                  <p className="text-sm text-gray-600 mb-1">Atención inmediata</p>
                  <p className="text-gray-800 font-medium">[Número de WhatsApp]</p>
                  <p className="text-sm text-green-600 mt-2">Respuesta rápida garantizada</p>
                </div>
              </div>
            </a>

            <div className="bg-white rounded-lg shadow-md p-6">
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center shrink-0">
                  <Clock className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Horarios</h3>
                  <p className="text-sm text-gray-600 mb-1">Atención al Cliente</p>
                  <p className="text-gray-800 font-medium">[Días de atención]</p>
                  <p className="text-sm text-blue-600 mt-2">[Horario de atención]</p>
                </div>
              </div>
            </div>

            <a
              href="#"
              className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
              target="_blank"
              rel="noopener noreferrer"
            >
              <div className="flex items-start gap-4">
                <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center shrink-0">
                  <Image src="/icons/gmail.svg" alt="Email" width={20} height={20} />
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-lg mb-1">Email</h3>
                  <p className="text-sm text-gray-600 mb-1">Consultas generales</p>
                  <p className="text-gray-800 font-medium break-all">[Email de contacto]</p>
                  <p className="text-sm text-orange-600 mt-2">Respondemos en 24hs</p>
                </div>
              </div>
            </a>
          </div>

          {/* FAQ Section */}
          <div className="mb-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-heading mb-2">Preguntas Frecuentes</h2>
              <p className="text-gray-600">Las respuestas a las consultas más comunes</p>
            </div>

            <div className="space-y-4">
              {faqs.map((faq, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md overflow-hidden">
                  <button
                    onClick={() => toggleFaq(index)}
                    className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
                  >
                    <h3 className="text-left font-medium text-lg pr-4">{faq.pregunta}</h3>
                    {openFaq === index ? (
                      <ChevronUp className="w-5 h-5 shrink-0" />
                    ) : (
                      <ChevronDown className="w-5 h-5 shrink-0" />
                    )}
                  </button>
                  {openFaq === index && (
                    <div className="px-6 py-4 border-t bg-gray-50">
                      <p className="text-gray-700">{faq.respuesta}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Still Need Help Section */}
          <div className="bg-primary text-white rounded-lg p-8 text-center">
            <h3 className="text-2xl font-heading mb-2">¿No encontraste lo que buscabas?</h3>
            <p className="mb-6 opacity-90">
              Estamos para ayudarte en lo que necesites.
              Contáctanos y te responderemos lo antes posible.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-green-600 hover:bg-green-700 rounded-md transition-colors"
              >
                <Image src="/icons/whatsapp.svg" alt="WhatsApp" width={24} height={24} />
                Escribir por WhatsApp
              </a>
              <a
                href="#"
                className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-white text-primary hover:bg-gray-100 rounded-md transition-colors"
              >
                <Image src="/icons/gmail.svg" alt="Email" width={20} height={20} />
                Enviar Email
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

