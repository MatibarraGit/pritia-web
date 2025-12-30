export const enum ACTION_TYPES {
  CREATE = 'CREATE',
  UPDATE = 'UPDATE',
  UPDATE_MANY = 'UPDATE_MANY',
  DELETE = 'DELETE',
  DISABLE = 'DISABLE',
  DISABLE_MANY = 'DISABLE_MANY',
  SHARE = 'SHARE'
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
  NEW_ENTRIES = 'nuevos ingresos',
  OFFERS = 'ofertas',
  BEST_SELLERS = 'más vendidos',
}

export const TO_OPTIONS = Object.freeze([
  {
    name: 'Número secundario',
    number: 5491140226227,
    type: 'seller'
  },
  {
    name: 'Vicky',
    number: 5491156188109,
    type: 'seller'
  },
  {
    name: 'Morty',
    number: 5491155256122,
    type: 'seller'
  },
  {
    name: 'Adri',
    number: 5491130806126,
    type: 'seller'
  },
  {
    name: 'Jana',
    number: 5491131134516,
    type: 'reseller'
  }
] as const);

export const ORDER_PARAMETERS = {
  "Relevancia": 'createdAt',
  "Precio": 'price',
} as const;