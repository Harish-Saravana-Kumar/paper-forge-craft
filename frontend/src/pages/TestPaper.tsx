import React from 'react';
import { Paper } from '@/utils/schemaHelpers';
import { generatePaper, downloadPdf } from '@/utils/apiService';
import { toast } from 'sonner';

const TestPaper: React.FC = () => {
  const testPaperGeneration = async () => {
    const testPaper: Paper = {
      title: "Test Paper Title",
      authors: [
        { name: "John Doe", affiliation: "University of Test", email: "john@test.edu" },
        { name: "Jane Smith", affiliation: "Test Institute", email: "jane@test.edu" }
      ],
      abstract: "This is a test abstract for the paper generation test.",
      keywords: ["test", "paper", "generation"],
      sections: [
        {
          id: "1",
          heading: "Introduction",
          content: "This is the introduction section content.",
          subsections: [
            {
              id: "1.1",
              heading: "Background",
              content: "This is the background subsection content.",
              images: [],
              tables: [],
              formulas: []
            }
          ]
        },
        {
          id: "2",
          heading: "Methodology",
          content: "This is the methodology section content.",
          subsections: []
        }
      ]
    };

    try {
      console.log("Original Paper Data:", testPaper);
      const pdfBlob = await generatePaper(testPaper);
      if (pdfBlob) {
        downloadPdf(pdfBlob);
        toast.success("Test paper generated successfully!");
      }
    } catch (error) {
      console.error("Test paper generation failed:", error);
      toast.error("Failed to generate test paper");
    }
  };

  return (
    <div className="container py-8">
      <h1 className="text-2xl font-bold mb-4">Test Paper Generation</h1>
      <button
        onClick={testPaperGeneration}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
      >
        Generate Test Paper
      </button>
    </div>
  );
};

export default TestPaper; 