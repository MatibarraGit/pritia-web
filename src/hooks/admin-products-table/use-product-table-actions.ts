"use client";

import { useCallback, useMemo, useState } from "react";

import { ACTION_TYPES } from "@/utils/constants";
import { getProductTableActionTitle } from "@/utils/productTableUtils";

export function useProductTableActions() {
  const [opened, setOpened] = useState(false);
  const [actionType, setActionType] = useState<string>(ACTION_TYPES.SHARE);

  const modalTitle = useMemo(() => getProductTableActionTitle(actionType), [actionType]);

  const openModal = useCallback(() => {
    setOpened(true);
  }, []);

  const closeModal = useCallback(() => {
    setOpened(false);
  }, []);

  const handleAction = useCallback((action: string) => {
    if (action !== ACTION_TYPES.SHARE && action !== ACTION_TYPES.DELETE) return;

    setActionType(action);
    setOpened(true);
  }, []);

  return {
    opened,
    actionType,
    modalTitle,
    openModal,
    closeModal,
    handleAction,
  };
}
