"use client";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/libs/utils";

type BaseProps = {
  label: string;
  isDirty?: boolean;
  className?: string;
};

type TextProps = BaseProps & {
  kind: "text" | "textarea";
  value: string;
  onCommit: (next: string) => void;
};

type NumberProps = BaseProps & {
  kind: "number";
  value: number;
  onCommit: (next: number) => void;
};

type Props = TextProps | NumberProps;

// const formatCurrency = (n: number) =>
//   n.toLocaleString("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

export function EditableField(props: Props) {
  const { label, isDirty, className, kind } = props;
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState<string>(String(props.value ?? ""));
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setDraft(kind === "number" ? String(props.value ?? 0) : String(props.value ?? ""));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [props.value]);

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus();
      if ("select" in inputRef.current) inputRef.current.select();
    }
  }, [editing]);

  const commit = () => {
    if (kind === "number") {
      const parsed = Number(draft.replace(/[^\d.-]/g, ""));
      (props as NumberProps).onCommit(Number.isFinite(parsed) ? parsed : 0);
    } else {
      (props as TextProps).onCommit(draft);
    }
    setEditing(false);
  };

  const cancel = () => {
    setDraft(kind === "number" ? String(props.value ?? 0) : String(props.value ?? ""));
    setEditing(false);
  };

  const display =
    // kind === "number"
      // ? formatCurrency(props.value as number)
      // : 
      (props.value as string) || <span className="italic text-muted-foreground">Vacío</span>;

  return (
    <div className={cn("flex flex-col gap-1", className)}>
      <div className="flex items-center gap-2">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        {isDirty && (
          <span className="inline-flex items-center rounded-full bg-amber-100 px-1.5 py-0.5 text-[9px] font-medium text-amber-800 dark:bg-amber-500/20 dark:text-amber-300">
            Pendiente
          </span>
        )}
      </div>

      {!editing ? (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className={cn(
            "min-h-[44px] w-full rounded-md border border-input bg-background px-3 py-2 text-left text-sm text-foreground transition-colors hover:bg-accent",
            isDirty && "border-amber-400 bg-amber-50 dark:bg-amber-500/5",
          )}
        >
          {display}
        </button>
      ) : kind === "textarea" ? (
        <textarea
          ref={inputRef as React.RefObject<HTMLTextAreaElement>}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Escape") cancel();
          }}
          rows={3}
          className="w-full rounded-md border border-primary bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      ) : (
        <input
          ref={inputRef as React.RefObject<HTMLInputElement>}
          type={kind === "number" ? "text" : "text"}
          inputMode={kind === "number" ? "decimal" : "text"}
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") cancel();
          }}
          className="min-h-[44px] w-full rounded-md border border-primary bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        />
      )}
    </div>
  );
}
