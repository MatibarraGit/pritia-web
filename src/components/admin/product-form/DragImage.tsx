"use client";

import { useState, useRef, DragEvent, ChangeEvent } from "react";
import { Upload, AlertCircle, ImageUp } from "lucide-react";

import { Card, CardContent } from "@/components/ui";
import { cn } from "@/libs/utils";

interface DragImageProps {
  handleChange: (type: string, files: File[]) => void;
  optional?: boolean;
}

const MAX_FILE_SIZE = 5 * 1024 * 1024; // 5MB
const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/jpg", "image/png", "image/webp"];

export function DragImage({ handleChange, optional = false }: DragImageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [dragState, setDragState] = useState<"idle" | "accept" | "reject">("idle");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateFile = (file: File): boolean => {
    if (file.size > MAX_FILE_SIZE) return false;
    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) return false;
    return true;
  };

  const handleFiles = (files: FileList | null) => {
    if (!files || files.length === 0) return;

    const validFiles: File[] = [];
    const invalidFiles: File[] = [];

    Array.from(files).forEach((file) => {
      if (validateFile(file)) {
        validFiles.push(file);
      } else {
        invalidFiles.push(file);
      }
    });

    if (validFiles.length > 0) {
      handleChange("images", validFiles);
    }

    if (invalidFiles.length > 0) {
      setDragState("reject");
      setTimeout(() => setDragState("idle"), 2000);
    }
  };

  const handleDragEnter = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();    
    setIsDragging(false);
    setDragState("idle");
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();    

    if (e.dataTransfer.types.includes("Files")) {
      // Durante dragOver, los archivos no están disponibles directamente
      // Necesitamos usar dataTransfer.items para validar el tipo
      const items = Array.from(e.dataTransfer.items);

      let hasValidFile = false;
      let hasInvalidFile = false;

      items.forEach((item) => {
        if (item.kind !== "file") return;
        const fileType = item.type;
          
        // Validar el tipo MIME
        if (ACCEPTED_IMAGE_TYPES.includes(fileType)) hasValidFile = true;
        else hasInvalidFile = true;
      });

      // Si hay al menos un archivo válido, mostrar accept
      // Si solo hay inválidos, mostrar reject
      if (hasValidFile && !hasInvalidFile) setDragState("accept");
      else if (hasInvalidFile) setDragState("reject");
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    setDragState("idle");

    const files = e.dataTransfer.files;
    
    handleFiles(files);
  };

  const handleFileInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFiles(e.target.files);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <Card
      className={cn(
        "cursor-pointer transition-all duration-200",
        isDragging && dragState === "accept" && "border-primary bg-primary/5",
        isDragging && dragState === "reject" && "border-danger bg-danger/5",
        !isDragging && "border-input hover:border-primary/50"
      )}
      onDragEnter={handleDragEnter}
      onDragLeave={handleDragLeave}
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      onClick={handleClick}
    >
      <CardContent className="flex flex-col items-center justify-center gap-4 min-h-[220px] p-6 pointer-events-none">
        <input
          ref={fileInputRef}
          type="file"
          accept={ACCEPTED_IMAGE_TYPES.join(",")}
          multiple
          onChange={handleFileInputChange}
          className="hidden"
        />

        {dragState === "accept" && (
          <div className="flex flex-col items-center gap-2">
            <ImageUp className="h-15 w-15 text-primary" size={60} />
            <p className="text-lg font-medium text-primary">Soltá tus imágenes acá</p>
          </div>
        )}

        {dragState === "reject" && (
          <div className="flex flex-col items-center gap-2">
            <AlertCircle className="h-15 w-15 text-danger" size={60} />
            <p className="text-lg font-medium text-danger">Archivo no válido</p>
          </div>
        )}

        {dragState === "idle" && !isDragging && (
          <>
            <div className="flex flex-col items-center gap-2">
              <Upload className="h-15 w-15 text-muted-foreground" size={60} />
              {optional && <p className="text-xl text-muted-foreground">(Opcional)</p>}
            </div>
            <div className="text-center">
              <p className="text-lg font-medium">
                Arrastrá imágenes o clickeá para seleccionar archivos
              </p>
              <p className="text-sm text-muted-foreground mt-2">
                El archivo no debe superar los 5mb
              </p>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}





