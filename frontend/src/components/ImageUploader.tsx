
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Image as ImageIcon, X, Upload } from "lucide-react";
import { toast } from "sonner";
import { uploadImage } from "@/utils/apiService";

interface ImageUploaderProps {
  onAddImage: (imagePath: string, caption: string) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ onAddImage }) => {
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [caption, setCaption] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      
      // Check if file size is too large
      const maxFileSizeMB = 5;
      if (file.size > maxFileSizeMB * 1024 * 1024) {
        toast.error(`Image too large. Please select an image under ${maxFileSizeMB}MB.`);
        return;
      }

      setImageFile(file);
      
      // Create a preview for the UI
      const objectUrl = URL.createObjectURL(file);
      setImagePreview(objectUrl);
    }
  };

  const handleSubmit = async () => {
    if (imageFile) {
      if (!caption.trim()) {
        toast.warning("Please add a caption for the image");
        return;
      }
      
      setIsUploading(true);
      
      try {
        // Upload the image to the server and get the path
        const result = await uploadImage(imageFile);
        
        // Pass the image path to parent component
        onAddImage(result.path, caption);
        
        // Reset form
        setImageFile(null);
        setImagePreview(null);
        setCaption("");
        toast.success("Image added successfully");
      } catch (error) {
        console.error("Error uploading image:", error);
        toast.error("Failed to upload image. Please try again.");
      } finally {
        setIsUploading(false);
      }
    }
  };

  const handleCancel = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview);
    }
    setImageFile(null);
    setImagePreview(null);
    setCaption("");
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white shadow-sm">
      <h3 className="text-lg font-medium">Add Image</h3>
      
      {!imagePreview ? (
        <div className="flex flex-col items-center justify-center border-2 border-dashed border-gray-300 rounded-md p-8 bg-gray-50 hover:bg-gray-100 transition-colors">
          <ImageIcon className="w-12 h-12 text-gray-400 mb-2" />
          <p className="text-sm text-gray-500 mb-4">Click to upload or drag and drop</p>
          <p className="text-xs text-gray-400 mb-4">Supported formats: JPEG, PNG, GIF (Max 5MB)</p>
          <label className="cursor-pointer">
            <Input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="hidden"
            />
            <div className="flex items-center justify-center gap-2 bg-primary text-white px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
              <Upload className="h-4 w-4" />
              Select Image
            </div>
          </label>
        </div>
      ) : (
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-white/80 hover:bg-white"
            onClick={handleCancel}
          >
            <X className="h-4 w-4" />
          </Button>
          <img 
            src={imagePreview} 
            alt="Preview" 
            className="max-h-64 max-w-full mx-auto rounded-md object-contain" 
          />
        </div>
      )}
      
      <div className="space-y-2">
        <Label htmlFor="image-caption">Image Caption</Label>
        <Textarea
          id="image-caption"
          placeholder="Enter a caption for this image"
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          disabled={!imagePreview}
        />
      </div>
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={handleCancel}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit}
          disabled={!imagePreview || isUploading}
        >
          {isUploading ? "Uploading..." : "Add Image"}
        </Button>
      </div>
    </div>
  );
};

export default ImageUploader;
