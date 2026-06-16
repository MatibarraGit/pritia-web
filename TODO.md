### Corregir de lo que hizo Codex
###### Product Order Form
  [] Validar número de teléfono antes de cargar el pedido en base de datos
  [] Añadir buscador de productos y de clientes / mejorar el formulario para los pedidos / traer el formulario de MD Directo
  [] Validar que si la fecha de entrega es anterior al día de hoy, los estados disponibles solo sean "Entregado" o "Cancelado"
  [] Añadir botón para eliminar pedido en caso de que la venta nunca se concrete, y avisar que al eliminar el pedido se van a perder las reseñas asociadas a esa orden
  [] Permitir eliminar items de una orden, y avisar que se van a perder las reseñas asociadas a ese item de la orden

### Post Release
###### Lógica de base de datos
[] Avisar que al eliminar un usuario o producto, se van a perder las reseñas asociadas a esa entidad
[] Avisar que si elimino un producto, se eliminará su referencia a la tabla purchase_order_items

###### Frontend
* Mejorar UI:
  [] Eliminar la página de HotSale y adaptar como template para próximos eventos

  * Home
    Basarme en castillo.com.ar para 
      [] Cambiar la sección "Comprá por categoría"
      [] Agregar sección con imágenes por categoría
      [] Agregar información de los medios de pago
      [] Modificar las productCards
      [] Agregar sección para comprar por marca
      
    [] Agregar información de cuotas en la card: https://chatgpt.com/c/6a273a12-f2a4-83e9-bb04-b1b9893506e8

    [] Trasladar elementos del diseño de la página de MD Directo a esta página
    [] Cambiar la disposición de las imágenes a partir de 768px en adelante, basarme en Mercado Libre o plataforSmas líderes
  
  * Página de resultados de búsqueda
    [] Cambiar el botón amarillo de "Limpiar filtros"

[] Usar el objeto CONTACT_METHODS para la información de contacto en toda la página

[] Terminar el menú mobile:
  [] Agregar los enlaces del NavigationMenu
[] Decidir si el sistema de filtros y ordenamiento va a ser desde el cliente o el servidor
[] Agregar en el Menú Mobile, en la Modal de Contacto, en el Footer y en la página Help
  [] Facebook
  [] Instagram 
  [] Email corporativo
  
### Secundario
[] Agregar rutas de administración comentadas en el sidebar
[] Finalizar los endpoints /user
[] Agregar el sistema de roles
[] Agregar autenticación con proveedores sociales
[] Agregar autenticación con número de teléfono y validación de número de teléfono
[] Agregar funcionalidad para enviar correo de 
  [] Reinicio de contraseña
  [] Verificación de correo
[] Añadir animaciones cuando
  [] Se elimina un producto de favoritos
  [] Se agrega un nuevo producto a favoritos
[] Añadir ForbiddenPage
[] Mejorar la UI de la página de Autenticación
[] Agregar en el proxy:
  [] Rate limiting / brute force: Para rutas de login, considera protección contra intentos excesivos.
  [] Permitir OPTIONS sin auth??

# Recomendaciones SEO adicionales:
* Internal linking: desde la Home enlaza a categorías importantes con anchor text descriptivo (“Comprar ventiladores”, “Herramientas eléctricas”, etc.).
* Páginas de categoría: títulos únicos, descripciones únicas y texto breve arriba del listado con keywords específicas; agrega alternates.canonical adecuado.
* Páginas de producto: títulos únicos, descripciones únicas y texto breve arriba del listado con keywords específicas; agrega alternates.canonical adecuado.
* Core Web Vitals: revisa LCP/CLS de carruseles y banners; usa next/image, priority para la hero, y preload de fuentes si aplica.
* Search Console: ya tienes verificación; envía sitemap.xml y usa “Inspeccionar URL” para forzar recrawl tras subir los iconos y cambios.
* Canónicos: definidos para Home; replica canónicos coherentes en categorías, paginaciones y filtros para evitar contenido duplicado..