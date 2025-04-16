
import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { CircleOff } from "lucide-react";

interface FormulaInputProps {
  onAddFormula: (latex: string) => void;
  initialLatex?: string;
}

// We're using a simple placeholder for LaTeX rendering since KaTeX integration would require additional setup
const FormulaInput: React.FC<FormulaInputProps> = ({ onAddFormula, initialLatex = "" }) => {
  const [latex, setLatex] = useState(initialLatex);
  
  const handleSubmit = () => {
    if (latex.trim()) {
      onAddFormula(latex);
      if (!initialLatex) {
        setLatex("");
      }
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <h3 className="text-lg font-medium">
        {initialLatex ? "Edit Formula" : "Add Formula"}
      </h3>
      
      <div className="space-y-2">
        <Label htmlFor="latex-formula">LaTeX Formula</Label>
        <Textarea
          id="latex-formula"
          placeholder="Enter LaTeX formula (e.g., \sum_{i=1}^{n} i^2 = \frac{n(n+1)(2n+1)}{6})"
          value={latex}
          onChange={(e) => setLatex(e.target.value)}
          rows={4}
        />
      </div>
      
      {latex && (
        <div className="latex-preview p-4 border rounded-md flex items-center justify-center">
          <div className="text-center">
            <p className="font-mono break-all">{latex}</p>
            <p className="text-sm text-muted-foreground mt-2">
              (LaTeX preview would render here)
            </p>
          </div>
        </div>
      )}
      
      <div className="flex justify-end space-x-2">
        <Button variant="outline" onClick={() => setLatex("")}>
          Clear
        </Button>
        <Button onClick={handleSubmit} disabled={!latex.trim()}>
          {initialLatex ? "Update Formula" : "Add Formula"}
        </Button>
      </div>
    </div>
  );
};

export default FormulaInput;
