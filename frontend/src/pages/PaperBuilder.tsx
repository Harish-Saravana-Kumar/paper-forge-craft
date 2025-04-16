
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { FileText, Download, FileSearch } from "lucide-react";
import MultiStepForm from "@/components/MultiStepForm";
import PlagiarismDashboard from "@/components/PlagiarismDashboard";
import { Paper } from "@/utils/schemaHelpers";
import { generatePaper, downloadPdf, checkPlagiarism } from "@/utils/apiService";
import { toast } from "sonner";

const PaperBuilder: React.FC = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCheckingPlagiarism, setIsCheckingPlagiarism] = useState(false);
  const [generatedPdf, setGeneratedPdf] = useState<Blob | null>(null);
  const [plagiarismResult, setPlagiarismResult] = useState<{
    score: number;
    suggestions: string[];
    status: 'poor' | 'fair' | 'good' | 'excellent';
  } | null>(null);

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

  const handleCheckPlagiarism = async () => {
    if (!generatedPdf) {
      toast.error("No paper available to check. Please generate a paper first.");
      return;
    }

    setIsCheckingPlagiarism(true);
    
    try {
      const result = await checkPlagiarism(generatedPdf);
      setPlagiarismResult(result);
      toast.success("Plagiarism check completed!");
    } catch (error) {
      console.error("Error checking plagiarism:", error);
      toast.error("Failed to check plagiarism. Please try again.");
    } finally {
      setIsCheckingPlagiarism(false);
    }
  };

  const resetPaper = () => {
    setGeneratedPdf(null);
    setPlagiarismResult(null);
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
      
      {plagiarismResult ? (
        <PlagiarismDashboard 
          score={plagiarismResult.score}
          suggestions={plagiarismResult.suggestions}
          status={plagiarismResult.status}
          onDownload={handleDownloadPdf}
          onCheckAgain={handleCheckPlagiarism}
          onNewPaper={resetPaper}
        />
      ) : generatedPdf ? (
        <div className="text-center space-y-6">
          <div className="flex items-center justify-center gap-4">
            <FileText className="h-16 w-16 text-primary" />
          </div>
          <h2 className="text-2xl font-bold">Your IEEE Paper is Ready!</h2>
          <p className="max-w-md mx-auto text-muted-foreground">
            Your paper has been successfully generated in IEEE format.
            Click the button below to download your paper or check for plagiarism.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Button 
              size="lg" 
              onClick={handleDownloadPdf}
              className="flex items-center justify-center"
            >
              <Download className="mr-2 h-5 w-5" />
              Download IEEE Paper (DOCX)
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={handleCheckPlagiarism}
              disabled={isCheckingPlagiarism}
              className="flex items-center justify-center"
            >
              <FileSearch className="mr-2 h-5 w-5" />
              {isCheckingPlagiarism ? "Checking..." : "Check Plagiarism"}
            </Button>
          </div>
          <Button
            variant="ghost"
            onClick={resetPaper}
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
      
      {isCheckingPlagiarism && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
            <p className="text-lg font-medium">Analyzing Plagiarism...</p>
            <p className="text-sm text-muted-foreground mt-2">
              Checking your paper against academic databases.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperBuilder;
