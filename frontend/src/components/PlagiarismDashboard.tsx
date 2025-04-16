
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileCheck, CheckCircle, AlertCircle, RefreshCw, Download, FileWarning } from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface PlagiarismDashboardProps {
  score: number;
  suggestions: string[];
  status: 'poor' | 'fair' | 'good' | 'excellent';
  onDownload: () => void;
  onCheckAgain: () => void;
  onNewPaper: () => void;
}

const PlagiarismDashboard: React.FC<PlagiarismDashboardProps> = ({
  score, 
  suggestions, 
  status,
  onDownload,
  onCheckAgain,
  onNewPaper
}) => {
  const getStatusColor = () => {
    switch (status) {
      case 'poor': return 'text-red-500';
      case 'fair': return 'text-amber-500';
      case 'good': return 'text-blue-500';
      case 'excellent': return 'text-green-500';
      default: return 'text-gray-500';
    }
  };

  const getProgressColor = () => {
    if (score < 50) return 'bg-red-500';
    if (score < 70) return 'bg-amber-500';
    if (score < 85) return 'bg-blue-500';
    return 'bg-green-500';
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'poor': 
        return <AlertCircle className="h-8 w-8 text-red-500" />;
      case 'fair': 
        return <FileWarning className="h-8 w-8 text-amber-500" />;
      case 'good': 
        return <FileCheck className="h-8 w-8 text-blue-500" />;
      case 'excellent': 
        return <CheckCircle className="h-8 w-8 text-green-500" />;
      default: 
        return <FileCheck className="h-8 w-8 text-gray-500" />;
    }
  };

  const getStatusMessage = () => {
    switch (status) {
      case 'poor': 
        return "Significant similarity detected. Substantial revision recommended.";
      case 'fair': 
        return "Moderate similarity detected. Further revisions may be needed.";
      case 'good': 
        return "Low similarity detected. Minor improvements recommended.";
      case 'excellent': 
        return "Excellent! Your paper is highly original and ready for submission.";
      default: 
        return "Uniqueness score calculated based on comparison with research databases.";
    }
  };

  const isReadyForPublishing = score >= 85;

  return (
    <div className="space-y-6 max-w-3xl mx-auto">
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-2">
            {getStatusIcon()}
          </div>
          <CardTitle className="text-2xl">Plagiarism Check Results</CardTitle>
          <CardDescription>
            Analysis completed for your IEEE paper
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center">
            <h3 className="text-3xl font-bold mb-2">
              <span className={getStatusColor()}>{score}%</span> Unique
            </h3>
            <p className="text-muted-foreground">
              {getStatusMessage()}
            </p>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Similarity Score</span>
              <span className="font-medium">{100 - score}%</span>
            </div>
            <Progress 
              value={score} 
              className="h-2"
              indicatorClassName={getProgressColor()}
            />
            <div className="flex justify-between text-xs text-muted-foreground mt-1">
              <span>High Similarity</span>
              <span>Low Similarity</span>
            </div>
          </div>

          <div className="border rounded-md p-4 bg-muted/30">
            <h4 className="font-medium mb-2">Improvement Suggestions</h4>
            {suggestions.length > 0 ? (
              <ul className="list-disc pl-5 space-y-1">
                {suggestions.map((suggestion, index) => (
                  <li key={index} className="text-sm">{suggestion}</li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No specific suggestions provided.</p>
            )}
          </div>

          <div className="bg-primary/5 rounded-md p-4 border border-primary/10">
            <h4 className="font-medium flex items-center mb-2">
              <span className="mr-2">
                {isReadyForPublishing ? (
                  <CheckCircle className="h-4 w-4 text-green-500" />
                ) : (
                  <AlertCircle className="h-4 w-4 text-amber-500" />
                )}
              </span>
              Publication Readiness
            </h4>
            <p className="text-sm">
              {isReadyForPublishing 
                ? "Your paper appears to be unique enough for submission to academic journals or conferences."
                : "Consider revising your paper based on the suggestions before submitting to academic journals or conferences."}
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button 
              className="flex-1 flex items-center justify-center" 
              onClick={onDownload}
            >
              <Download className="mr-2 h-4 w-4" />
              Download Paper
            </Button>
            <Button 
              variant="outline" 
              className="flex-1 flex items-center justify-center"
              onClick={onCheckAgain}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Check Again
            </Button>
            <Button 
              variant="secondary" 
              className="flex-1 flex items-center justify-center"
              onClick={onNewPaper}
            >
              Create New Paper
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PlagiarismDashboard;
