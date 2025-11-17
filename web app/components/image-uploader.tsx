"use client";

import type React from "react";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Upload, ImageIcon } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface ImageUploaderProps {
  onImageUpload: (imageFile: File, previewUrl: string) => void;
}

export function ImageUploader({ onImageUpload }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file: File) => {
    // Check if file is an image
    if (!file.type.match("image.*")) {
      toast({
        title: "Invalid File",
        description: "Please upload an image file (JPG, PNG, JPEG)",
        variant: "destructive",
      });
      return;
    }

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: "File Too Large",
        description: "Image size should be less than 5MB",
        variant: "destructive",
      });
      return;
    }

    console.log(
      "File selected:",
      file.name,
      "Size:",
      file.size,
      "Type:",
      file.type
    );

    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target && typeof e.target.result === "string") {
        onImageUpload(file, e.target.result);
      }
    };
    reader.readAsDataURL(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div
      className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-12 transition-colors ${
        isDragging
          ? "border-teal-500 bg-teal-50 dark:bg-teal-950/20"
          : "border-gray-300 dark:border-gray-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <div className="flex flex-col items-center justify-center space-y-4 text-center">
        <div className="rounded-full bg-gray-100 dark:bg-gray-800 p-4">
          <Upload className="h-10 w-10 text-gray-400" />
        </div>
        <div className="space-y-2">
          <h3 className="text-lg font-medium">Upload an image</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Drag and drop an image, or click to browse
          </p>
          <p className="text-xs text-gray-500 dark:text-gray-400">
            Supported formats: JPG, PNG, JPEG (max 5MB)
          </p>
        </div>
        <Button onClick={triggerFileInput} variant="outline" className="mt-2">
          <ImageIcon className="mr-2 h-4 w-4" />
          Select Image
        </Button>
      </div>
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileInput}
        accept="image/*"
        className="hidden"
        name="image" // Make sure the name is "image"
      />
    </div>
  );
}
