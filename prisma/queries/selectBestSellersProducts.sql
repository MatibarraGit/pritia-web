-- Consulta para obtener los productos más vendidos en base a la tabla purchase_order_items
-- Se tiene en cuenta solo las órdenes de compra que tienen la propiedad "order_status" con el valor de "Vendida"
-- Se agrupa la cantidad de unidades vendidas por producto y devuelve el total de unidades vendidas
-- Se devuelven los productos con más ventas en un orden decreciente
-- Se espera que se pase como parámetro el límite de productos a devolver
SELECT 
  p.product_id,
  p.product_name,
  p.purchase_price,
  p.sell_price,
  p.discount_percent,
  p.in_stock,
  c.category_name,
  p.product_slug,
  p.images,
  CAST(SUM(quantity) AS INTEGER) as total_quantity_sold
FROM purchase_order_items poi
JOIN products p ON poi.product_id = p.product_id
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN purchase_orders po ON poi.order_id = po.order_id
WHERE p.in_stock = TRUE AND po.order_status = 'Vendida' AND p.deleted_at IS NULL
GROUP BY p.product_id, c.category_name
ORDER BY total_quantity_sold DESC