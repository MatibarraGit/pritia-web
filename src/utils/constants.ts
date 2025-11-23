export const enum ACTION_TYPES {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  DELETE = 'DELETE'
};

export const enum PURCHASE_ORDER_STATUS {
  UNCONFIRMED = 'Sin confirmar',
  PURCHASE_PENDING = 'Pendiente de compra',
  READY_TO_SHIP = 'Lista para enviar',
  SOLD ='Vendida'
};

export const enum PAYMENT_METHODS {
  UNSPECIFIED = 'No especificado',
  CASH = 'Efectivo',
  TRANSFER = 'Transferencia',
  DEBIT_CARD = 'Tarjeta de débito',
  CREDIT_CARD = 'Tarjeta de crédito',
}

export const enum PAYMENT_STATUS {
  PENDING = 'Pendiente',
  PARTIAL_PAID = 'Pago parcial',
  FULL_PAID = 'Pago completo',
}

export const PRODUCTS_PER_PAGE = 60;

export const enum TOPICS {
  NEW_ENTRIES = 'Nuevos Ingresos',
  OFFERS = 'Ofertas',
  BEST_SELLERS = 'Más Vendidos',
}

export const ORDER_PARAMETERS = {
  "Relevancia": 'createdAt',
  "Precio": 'price',
} as const;