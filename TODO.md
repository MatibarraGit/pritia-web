### Post Release
[] Mejorar UI:
  * Página de producto
    [] Agregar información de las cuotas con tarjetas de crédito desde la API de Mercado Pago
    [] Trasladar elementos del diseño de la página de MD Directo a esta página
    [] Cambiar la disposición de las imágenes a partir de 768px en adelante, basarme en Mercado Libre o plataforSmas líderes
  
  * Página de resultados de búsqueda
    [] Cambiar el botón amarillo de "Limpiar filtros"

  * Categorías
    [] Corregir la presentación de las categorías tanto en los filtros como en el menú mobile

  * Home
    Basarme en castillo.com.ar para 
      [] Cambiar la sección "Comprá por categoría"
      [] Agregar sección con imágenes por categoría
      [] Agregar información de los medios de pago
      [] Modificar las productCards
      [] Agregar sección para comprar por marca

[] Traer metadata de MD Directo para que se vea mejor al compartir url's
[] Cambiar url's a español y simplificar la de subcategorías

[] Ordenar gran parte de los productos por updated_at y created_at
[] Crear el objeto CONTACT_METHODS como en MD Directo
[] Crear la funcionalidad para editar como en Notion nombre, descripción, precios, in_stock y proveedores

[] Terminar el menú mobile:
  [] Agregar los enlaces del NavigationMenu
[] Decidir si el sistema de filtros y ordenamiento va a ser desde el cliente o el servidor
[] Cambiar la semántica de las urls para que esté en español
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