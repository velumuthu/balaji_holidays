
'use client';

import { ChangeEvent, useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { Button } from '@/components/ui/button';
import { Upload } from 'lucide-react';

interface ImageUploadInputProps {
  value: string;
  onChange: (url: string) => void;
}

export function ImageUploadInput({ value, onChange }: ImageUploadInputProps) {
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const { toast } = useToast();
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
        toast({
            variant: 'destructive',
            title: 'Invalid File Type',
            description: 'Please select an image file.',
        });
        return;
    }

    setFileName(file.name);
    setIsUploading(true);
    
    const reader = new FileReader();
    reader.onload = (event) => {
        const result = event.target?.result as string;
        onChange(result);
        setIsUploading(false);
        toast({ title: 'Upload Complete', description: 'Image has been converted to Base64.' });
    };
    reader.onerror = (error) => {
        console.error('File reading error:', error);
        toast({
          variant: 'destructive',
          title: 'Read Failed',
          description: 'Could not read image file. Please try again.',
        });
        setIsUploading(false);
        setFileName('');
    }
    reader.readAsDataURL(file);
  };

  return (
    <div className="space-y-2">
      <Button asChild variant="outline" className="relative cursor-pointer">
        <label>
          <Upload className="h-4 w-4" />
          <span>{fileName || (value ? 'Image selected' : 'Choose an image')}</span>
          <input
            type="file"
            accept="image/*"
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer sr-only"
            onChange={handleFileChange}
            disabled={isUploading}
          />
        </label>
      </Button>
       {isUploading && <p className="text-sm text-muted-foreground">Processing image...</p>}
    </div>
  );
}
