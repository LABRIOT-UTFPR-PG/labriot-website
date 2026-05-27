"use client"

import { useState, useRef } from 'react'
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { UploadCloud, Link as LinkIcon, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageInputProps {
  value: string;
  onChange: (value: string) => void;
}

export function ImageInput({ value, onChange }: ImageInputProps) {
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        if (data.url) {
          onChange(data.url);
        }
      } else {
        const errorData = await response.json().catch(() => ({}));
        console.error('Upload failed:', errorData);
        alert(`Falha ao fazer upload da imagem: ${errorData.error || 'Erro desconhecido'}`);
      }
    } catch (error: any) {
      console.error('Upload error:', error);
      alert(`Erro ao fazer upload da imagem: ${error.message || 'Erro desconhecido'}`);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <div className="space-y-4">
      <Tabs defaultValue="link" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="link">
            <LinkIcon className="w-4 h-4 mr-2" />
            Usar Link
          </TabsTrigger>
          <TabsTrigger value="upload">
            <UploadCloud className="w-4 h-4 mr-2" />
            Fazer Upload
          </TabsTrigger>
        </TabsList>
        <TabsContent value="link" className="space-y-2 mt-4">
          <Label htmlFor="image-url">URL da Imagem</Label>
          <Input 
            id="image-url" 
            value={value} 
            onChange={(e) => onChange(e.target.value)} 
            placeholder="https://example.com/image.png" 
          />
        </TabsContent>
        <TabsContent value="upload" className="space-y-2 mt-4">
          <Label htmlFor="image-upload">Selecione uma imagem do seu computador</Label>
          <div className="flex items-center gap-4">
            <Input 
              id="image-upload" 
              type="file" 
              accept="image/*" 
              onChange={handleUpload}
              disabled={isUploading}
              ref={fileInputRef}
            />
            {isUploading && <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />}
          </div>
        </TabsContent>
      </Tabs>
      
      {value && (
        <div className="mt-4 border rounded-md p-2 bg-muted/50 inline-block max-w-[200px]">
          <p className="text-xs text-muted-foreground mb-2">Preview:</p>
          <div className="relative w-full aspect-video">
            <Image 
              src={value} 
              alt="Preview" 
              fill 
              className="object-contain rounded-md bg-black/5" 
              unoptimized
            />
          </div>
        </div>
      )}
    </div>
  );
}
