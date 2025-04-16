
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download } from "lucide-react";
import MultiStepForm from "@/components/MultiStepForm";
import { Paper } from "@/utils/schemaHelpers";
import { generatePaper, downloadPdf } from "@/utils/apiService";
import { toast } from "sonner";

const PaperBuilder: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<Blob | null>(null);

  const handleFormSubmit = async (paperData: Paper) => {
    setIsGenerating(true);
    
    try {
      const pdfBlob = await generatePaper(paperData);
      
      if (pdfBlob) {
        setGeneratedPdf(pdfBlob);
        toast.success("Paper generated successfully!");
      }
    } catch (error) {
      console.error("Error in paper generation:", error);
      toast.error("Failed to generate paper. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownloadPdf = () => {
    if (generatedPdf) {
      downloadPdf(generatedPdf);
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">IEEE Paper Generator</h1>
        <p className="text-muted-foreground max-w-2xl mx-auto">
          Create professional academic papers in IEEE format by filling out this
          multi-step form with your content, images, tables, and formulas.
        </p>
      </div>
      
      {generatedPdf ? (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <FileText className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Your IEEE Paper is Ready!</h2>
          <p className="max-w-md mx-auto text-muted-foreground">
            Your paper has been successfully generated in IEEE format.
            Click the button below to download your paper.
          </p>
          <Button 
            size="lg" 
            onClick={handleDownloadPdf}
            className="flex items-center"
          >
            <Download className="mr-2 h-5 w-5" />
            Download IEEE Paper (DOCX)
          </Button>
          <Button
            variant="outline"
            onClick={() => setGeneratedPdf(null)}
            className="mt-2"
          >
            Create Another Paper
          </Button>
        </div>
      ) : (
        <MultiStepForm onSubmit={handleFormSubmit} />
      )}
      
      {isGenerating && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Generating IEEE Paper...</p>
            <p className="text-sm text-muted-foreground mt-2">
              This may take a few moments, please wait.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperBuilder;
