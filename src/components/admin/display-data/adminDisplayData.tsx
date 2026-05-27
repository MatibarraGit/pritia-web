"use client";

import { ReactNode } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TableOfItems } from "./tableOfItems";
import { TableToolBar } from "./tableToolBar";

interface PageConfig {
  pageTitle: string;
  pageDescription: string;
  isLoading: boolean;
  span?: string;
}

interface ToolbarConfig {
  href?: string;
  onClick?: (action: string) => void;
  serverSearch?: boolean;
}

interface TableData<T> {
  items: T[];
  columns: string[];
  map: string[];
  withEditButton?: boolean;
  editLink?: string | undefined;
  withDeleteButton?: boolean;
  sortConfig?: Record<string, { enabled?: boolean; type: 'string' | 'number' | 'date'; default?: boolean }>;
  filterConfig?: Record<string, { enabled: boolean; options: Array<{ value: string | boolean; label: string }> }>;
}

interface ModalConfig {
  modalTitle: string;
  modalContent: ReactNode;
  opened: boolean;
  close: () => void;
}

interface AdminDisplayDataProps<T> {
  pageConfig: PageConfig;
  toolbarConfig: ToolbarConfig;
  tableData: TableData<T>;
  modalConfig: ModalConfig;
  handleAction: (action: string, item: T) => void;
}

export function AdminDisplayData<T extends Record<string, unknown> & { id: number | string }>({
  pageConfig,
  toolbarConfig,
  tableData,
  modalConfig,
  handleAction,
}: AdminDisplayDataProps<T>) {
  const { pageTitle, pageDescription, isLoading, span } = pageConfig;
  const { href, onClick, serverSearch } = toolbarConfig;
  const { 
    items, 
    columns, 
    map, 
    withEditButton, 
    editLink, 
    withDeleteButton,
    sortConfig = {},
    filterConfig = {}
  } = tableData;
  const { modalTitle, modalContent, opened, close } = modalConfig;

  return (
    <>
      <Dialog open={opened} onOpenChange={(open) => !open && close()}>
        <DialogContent 
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              e.stopPropagation();
            }
          }}
          showCloseButton={false}
        >
          <DialogHeader>
            <DialogTitle>{modalTitle}</DialogTitle>
          </DialogHeader>
          {modalContent}
        </DialogContent>
      </Dialog>

      <div className="flex flex-col gap-2 mb-8 animate-in fade-in slide-in-from-top-4 duration-500">
        <div className="flex flex-col justify-center">
          <h3 className="text-3xl font-bold text-gray-900 mb-1">{pageTitle}</h3>
          {span && (
            <p className="text-sm text-gray-500">{pageDescription}</p>
          )}
        </div>
      </div>

      <section className="p-6 rounded-xl bg-white shadow-lg border border-gray-100 transition-all duration-300 hover:shadow-xl animate-in fade-in slide-in-from-bottom-4">
        <TableToolBar
          pageTitle={pageTitle}
          span={span}
          href={href}
          onClick={onClick}
          serverSearch={serverSearch}
        />
        <div className="mt-4">
          <TableOfItems
            isLoading={isLoading}
            items={items}
            columns={columns}
            map={map}
            withEditButton={withEditButton}
            editLink={editLink}
            withDeleteButton={withDeleteButton}
            handleAction={handleAction}
            sortConfig={sortConfig}
            filterConfig={filterConfig}
          />
        </div>
      </section>
    </>
  );
}



