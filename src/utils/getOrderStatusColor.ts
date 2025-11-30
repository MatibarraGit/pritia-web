import { PURCHASE_ORDER_STATUS } from "@/utils";

export function getOrderStatusColor(status: string) {
  if (status === PURCHASE_ORDER_STATUS.UNCONFIRMED) {
    return "#e35400";
  } else if (status === PURCHASE_ORDER_STATUS.PURCHASE_PENDING) {
    return "#f39c12";
  } else if (status === PURCHASE_ORDER_STATUS.READY_TO_SHIP) {
    return "#f5d34b";
  } else if (status === PURCHASE_ORDER_STATUS.SOLD) {
    return "#2ecc71";
  }
}