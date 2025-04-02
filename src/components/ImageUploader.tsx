
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, X, FileImage, RefreshCw } from 'lucide-react';
import driveService from '@/services/GoogleDriveService';
import { toast } from 'sonner';

interface ImageUploaderProps {
  campId: string;
  patientId: string;
  onImageUploaded?: (imageUrl: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ campId, patientId, onImageUploaded }) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadedImageUrl, setUploadedImageUrl] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please select an image file');
      return;
    }

    // Validate file size (5MB max)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be smaller than 5MB');
      return;
    }

    setSelectedFile(file);
    const fileUrl = URL.createObjectURL(file);
    setPreviewUrl(fileUrl);
  };

  const handleUpload = async () => {
    if (!selectedFile || !campId || !patientId) return;

    setIsUploading(true);
    try {
      const imageUrl = await driveService.uploadImageToDrive(campId, patientId, selectedFile);
      
      if (imageUrl) {
        setUploadedImageUrl(imageUrl);
        toast.success('Image uploaded successfully');
        
        if (onImageUploaded) {
          onImageUploaded(imageUrl);
        }
      } else {
        toast.error('Failed to upload image');
      }
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Error uploading image');
    } finally {
      setIsUploading(false);
    }
  };

  const clearSelection = () => {
    setSelectedFile(null);
    setPreviewUrl(null);
  };

  return (
    <div className="space-y-4">
      {!selectedFile && !uploadedImageUrl && (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center">
          <FileImage className="h-10 w-10 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Upload patient documentation image</p>
          <Button variant="outline" asChild>
            <label className="cursor-pointer">
              <input
                type="file"
                className="hidden"
                accept="image/*"
                onChange={handleFileChange}
              />
              <Upload className="h-4 w-4 mr-2" />
              Select Image
            </label>
          </Button>
        </div>
      )}

      {previewUrl && selectedFile && !uploadedImageUrl && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-center mb-3">
            <span className="text-sm font-medium">{selectedFile.name}</span>
            <Button variant="ghost" size="icon" onClick={clearSelection}>
              <X className="h-4 w-4" />
            </Button>
          </div>
          <div className="relative aspect-video bg-gray-100 rounded-md overflow-hidden mb-3">
            <img
              src={previewUrl}
              alt="Preview"
              className="object-contain w-full h-full"
            />
          </div>
          <div className="flex justify-end">
            <Button 
              onClick={handleUpload} 
              disabled={isUploading}
              size="sm"
            >
              {isUploading ? (
                <>
                  <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4 mr-2" />
                  Upload to Drive
                </>
              )}
            </Button>
          </div>
        </div>
      )}

      {uploadedImageUrl && (
        <div className="border rounded-lg p-4">
          <div className="flex justify-between items-start mb-3">
            <span className="text-sm font-medium">Image Uploaded</span>
            <Button 
              variant="outline" 
              size="sm" 
              asChild
            >
              <a 
                href={uploadedImageUrl} 
                target="_blank" 
                rel="noopener noreferrer"
              >
                View in Drive
              </a>
            </Button>
          </div>
          <p className="text-xs text-gray-500">
            The image has been uploaded to Google Drive and attached to this patient's record.
          </p>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
