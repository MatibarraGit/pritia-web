-- Plantilla de consulta para obtener información de productos
-- Se espera que se utilice junto a clásulas WHERE adicionales, ORDER BY y/o LIMIT
-- Esta consulta incluye las condiciones base: in_stock = TRUE y sell_price > 0
-- Para agregar condiciones adicionales, usa AND después del WHERE existente
SELECT 
  p.product_id,
  p.product_name,
  p.purchase_price,
  p.sell_price,
  p.discount_percent,
  p.in_stock,
  -- TODO: Eliminar al finalizar HotSale
  p.stock,
  p.product_slug,
  p.created_at,
  p.updated_at,
  c.category_name,
  sc.subcategory_name,
  p.images
FROM products p
LEFT JOIN categories c ON p.category_id = c.category_id
LEFT JOIN subcategories sc on sc.subcategory_id = p.subcategory_id
WHERE p.in_stock = TRUE AND p.sell_price > 0
