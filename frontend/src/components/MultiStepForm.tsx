import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { ChevronLeft, ChevronRight, FilePlus, Save, X, Plus, Send } from "lucide-react";
import SectionEditor from "./SectionEditor";
import { Paper, Author, Section, Subsection, addReference, removeReference, addAppendixItem, removeAppendixItem } from "@/utils/schemaHelpers";
import { toast } from "sonner";

interface MultiStepFormProps {
  onSubmit: (paperData: Paper) => void;
}

const MultiStepForm: React.FC<MultiStepFormProps> = ({ onSubmit }) => {
  const [currentStep, setCurrentStep] = useState(0);
  const [paper, setPaper] = useState<Paper>({
    title: "",
    authors: [{ name: "", affiliation: "", email: "" }],
    abstract: "",
    keywords: [],
    sections: [
      {
        id: crypto.randomUUID(),
        heading: "Introduction",
        content: "",
        subsections: [],
      },
    ],
    references: [],
    appendix: []
  });

  const [keyword, setKeyword] = useState("");
  const [newReference, setNewReference] = useState("");
  const [newAppendixItem, setNewAppendixItem] = useState("");

  const steps = [
    { title: "Paper Metadata", description: "Title, authors, and affiliations" },
    { title: "Abstract & Keywords", description: "Summary and key terms" },
    { title: "Paper Content", description: "Sections and subsections" },
    { title: "References & Appendix", description: "Citations and supplementary material" },
    { title: "Review & Submit", description: "Verify your paper" },
  ];

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPaper({ ...paper, title: e.target.value });
  };

  const handleAuthorChange = (index: number, field: keyof Author, value: string) => {
    const updatedAuthors = [...paper.authors];
    updatedAuthors[index] = { ...updatedAuthors[index], [field]: value };
    setPaper({ ...paper, authors: updatedAuthors });
  };

  const handleAddAuthor = () => {
    setPaper({
      ...paper,
      authors: [...paper.authors, { name: "", affiliation: "", email: "" }],
    });
  };

  const handleRemoveAuthor = (index: number) => {
    if (paper.authors.length === 1) {
      return;
    }
    const updatedAuthors = [...paper.authors];
    updatedAuthors.splice(index, 1);
    setPaper({ ...paper, authors: updatedAuthors });
  };

  const handleAbstractChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPaper({ ...paper, abstract: e.target.value });
  };

  const handleAddKeyword = () => {
    if (keyword.trim() && !paper.keywords.includes(keyword.trim())) {
      setPaper({
        ...paper,
        keywords: [...paper.keywords, keyword.trim()],
      });
      setKeyword("");
    }
  };

  const handleRemoveKeyword = (keywordToRemove: string) => {
    setPaper({
      ...paper,
      keywords: paper.keywords.filter((k) => k !== keywordToRemove),
    });
  };

  const handleKeywordKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddKeyword();
    }
  };

  const handleAddReference = () => {
    if (newReference.trim()) {
      setPaper(addReference(paper, newReference.trim()));
      setNewReference("");
    }
  };

  const handleRemoveReference = (index: number) => {
    setPaper(removeReference(paper, index));
  };

  const handleReferenceKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddReference();
    }
  };

  const handleAddAppendixItem = () => {
    if (newAppendixItem.trim()) {
      setPaper(addAppendixItem(paper, newAppendixItem.trim()));
      setNewAppendixItem("");
    }
  };

  const handleRemoveAppendixItem = (index: number) => {
    setPaper(removeAppendixItem(paper, index));
  };

  const handleAppendixKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleAddAppendixItem();
    }
  };

  const handleAddSection = () => {
    setPaper({
      ...paper,
      sections: [
        ...paper.sections,
        {
          id: crypto.randomUUID(),
          heading: "New Section",
          content: "",
          subsections: [],
        },
      ],
    });
  };

  const handleUpdateSection = (sectionId: string, updatedSection: Section) => {
    setPaper({
      ...paper,
      sections: paper.sections.map((section) =>
        section.id === sectionId ? updatedSection : section
      ),
    });
  };

  const handleRemoveSection = (sectionId: string) => {
    if (paper.sections.length === 1) {
      toast.error("Paper must have at least one section");
      return;
    }
    setPaper({
      ...paper,
      sections: paper.sections.filter((section) => section.id !== sectionId),
    });
  };

  const handleAddSubsection = (sectionId: string) => {
    setPaper({
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            subsections: [
              ...section.subsections,
              {
                id: crypto.randomUUID(),
                heading: "New Subsection",
                content: "",
                images: [],
                tables: [],
                formulas: [],
              },
            ],
          };
        }
        return section;
      }),
    });
  };

  const handleUpdateSubsection = (
    sectionId: string,
    subsectionId: string,
    updatedSubsection: Subsection
  ) => {
    setPaper({
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            subsections: section.subsections.map((subsection) =>
              subsection.id === subsectionId ? updatedSubsection : subsection
            ),
          };
        }
        return section;
      }),
    });
  };

  const handleRemoveSubsection = (sectionId: string, subsectionId: string) => {
    setPaper({
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            subsections: section.subsections.filter(
              (subsection) => subsection.id !== subsectionId
            ),
          };
        }
        return section;
      }),
    });
  };

  const handleNext = () => {
    if (currentStep === 0 && !paper.title) {
      toast.error("Please enter a paper title");
      return;
    }

    if (currentStep === 0 && 
        paper.authors.some(author => !author.name || !author.email)) {
      toast.error("Please complete all author details");
      return;
    }

    if (currentStep === 1 && !paper.abstract) {
      toast.error("Please enter an abstract");
      return;
    }

    if (currentStep === 4) {
      handleSubmit();
      return;
    }

    setCurrentStep((prev) => Math.min(prev + 1, steps.length - 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 0));
  };

  const handleSubmit = () => {
    console.log("Submitting paper:", paper);
    onSubmit(paper);
    toast.success("Paper submitted for generation!");
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="paper-title">Paper Title</Label>
              <Input
                id="paper-title"
                value={paper.title}
                onChange={handleTitleChange}
                placeholder="Enter the title of your paper"
              />
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <Label>Authors</Label>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddAuthor}
                  className="flex items-center"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Author
                </Button>
              </div>

              {paper.authors.map((author, index) => (
                <div key={index} className="border rounded-md p-4 space-y-4 bg-white">
                  <div className="flex justify-between items-center">
                    <h4 className="font-medium">Author {index + 1}</h4>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAuthor(index)}
                      disabled={paper.authors.length === 1}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`author-name-${index}`}>Name</Label>
                    <Input
                      id={`author-name-${index}`}
                      value={author.name}
                      onChange={(e) =>
                        handleAuthorChange(index, "name", e.target.value)
                      }
                      placeholder="Enter author's name"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`author-affiliation-${index}`}>Affiliation</Label>
                    <Input
                      id={`author-affiliation-${index}`}
                      value={author.affiliation}
                      onChange={(e) =>
                        handleAuthorChange(index, "affiliation", e.target.value)
                      }
                      placeholder="Enter author's affiliation (e.g., University, Organization)"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor={`author-email-${index}`}>Email</Label>
                    <Input
                      id={`author-email-${index}`}
                      type="email"
                      value={author.email}
                      onChange={(e) =>
                        handleAuthorChange(index, "email", e.target.value)
                      }
                      placeholder="Enter author's email address"
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="abstract">Abstract</Label>
              <Textarea
                id="abstract"
                value={paper.abstract}
                onChange={handleAbstractChange}
                placeholder="Enter the abstract of your paper..."
                rows={8}
              />
              <p className="text-xs text-muted-foreground">
                The abstract should be a concise summary of your paper in around 150-250 words.
              </p>
            </div>

            <div className="space-y-4">
              <Label>Keywords</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a keyword"
                  value={keyword}
                  onChange={(e) => setKeyword(e.target.value)}
                  onKeyDown={handleKeywordKeyDown}
                />
                <Button onClick={handleAddKeyword} disabled={!keyword.trim()}>
                  Add
                </Button>
              </div>

              <div className="flex flex-wrap gap-2 mt-2">
                {paper.keywords.map((kw) => (
                  <div
                    key={kw}
                    className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm flex items-center"
                  >
                    {kw}
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-5 w-5 ml-1"
                      onClick={() => handleRemoveKeyword(kw)}
                    >
                      <X className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
                {paper.keywords.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No keywords added yet. Keywords help categorize your paper.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-medium">Paper Sections</h3>
              <Button
                variant="outline"
                size="sm"
                onClick={handleAddSection}
                className="flex items-center"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add Section
              </Button>
            </div>

            <div className="space-y-4">
              {paper.sections.map((section) => (
                <SectionEditor
                  key={section.id}
                  section={section}
                  onUpdate={(updatedSection) =>
                    handleUpdateSection(section.id, updatedSection)
                  }
                  onRemove={() => handleRemoveSection(section.id)}
                  onAddSubsection={() => handleAddSubsection(section.id)}
                  onUpdateSubsection={(subsectionId, updatedSubsection) =>
                    handleUpdateSubsection(
                      section.id,
                      subsectionId,
                      updatedSubsection
                    )
                  }
                  onRemoveSubsection={(subsectionId) =>
                    handleRemoveSubsection(section.id, subsectionId)
                  }
                />
              ))}
            </div>
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <div className="space-y-4">
              <Label>References</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add a reference citation"
                  value={newReference}
                  onChange={(e) => setNewReference(e.target.value)}
                  onKeyDown={handleReferenceKeyDown}
                />
                <Button onClick={handleAddReference} disabled={!newReference.trim()}>
                  Add
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {paper.references.map((ref, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-muted/30 rounded-md"
                  >
                    <p className="text-sm">{ref}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveReference(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {paper.references.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No references added yet. References help validate your paper.
                  </p>
                )}
              </div>
            </div>

            <div className="space-y-4">
              <Label>Appendix</Label>
              <div className="flex space-x-2">
                <Input
                  placeholder="Add an appendix item"
                  value={newAppendixItem}
                  onChange={(e) => setNewAppendixItem(e.target.value)}
                  onKeyDown={handleAppendixKeyDown}
                />
                <Button onClick={handleAddAppendixItem} disabled={!newAppendixItem.trim()}>
                  Add
                </Button>
              </div>

              <div className="space-y-2 mt-2">
                {paper.appendix.map((item, index) => (
                  <div
                    key={index}
                    className="flex justify-between items-center p-2 bg-muted/30 rounded-md"
                  >
                    <p className="text-sm">{item}</p>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleRemoveAppendixItem(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {paper.appendix.length === 0 && (
                  <p className="text-sm text-muted-foreground">
                    No appendix items added yet. Appendices contain supplementary material.
                  </p>
                )}
              </div>
            </div>
          </div>
        );

      case 4:
        return (
          <div className="space-y-6">
            <div className="border rounded-md p-4 bg-muted/30">
              <h3 className="text-xl font-bold mb-4">{paper.title}</h3>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Authors</h4>
                <div className="flex flex-wrap gap-4">
                  {paper.authors.map((author, index) => (
                    <div key={index} className="text-sm">
                      <p className="font-medium">{author.name}</p>
                      <p className="text-muted-foreground">{author.affiliation}</p>
                      <p className="text-muted-foreground">{author.email}</p>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Abstract</h4>
                <p className="text-sm">{paper.abstract}</p>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Keywords</h4>
                <div className="flex flex-wrap gap-2">
                  {paper.keywords.map((kw) => (
                    <span key={kw} className="bg-primary/10 text-primary px-2 py-1 rounded-full text-xs">
                      {kw}
                    </span>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Content Structure</h4>
                <div className="space-y-2">
                  {paper.sections.map((section) => (
                    <div key={section.id} className="paper-section">
                      <h5 className="font-medium">{section.heading}</h5>
                      {section.subsections.length > 0 && (
                        <div className="ml-4 mt-1">
                          {section.subsections.map((subsection) => (
                            <div key={subsection.id} className="paper-subsection">
                              <h6 className="text-sm font-medium">{subsection.heading}</h6>
                              <div className="text-xs text-muted-foreground">
                                {subsection.images.length > 0 && (
                                  <span className="mr-3">Images: {subsection.images.length}</span>
                                )}
                                {subsection.tables.length > 0 && (
                                  <span className="mr-3">Tables: {subsection.tables.length}</span>
                                )}
                                {subsection.formulas.length > 0 && (
                                  <span>Formulas: {subsection.formulas.length}</span>
                                )}
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="mb-4">
                <h4 className="text-sm font-medium text-muted-foreground mb-2">References</h4>
                {paper.references.length > 0 ? (
                  <ul className="list-decimal pl-5 text-sm">
                    {paper.references.map((ref, index) => (
                      <li key={index}>{ref}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No references added</p>
                )}
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-muted-foreground mb-2">Appendix</h4>
                {paper.appendix.length > 0 ? (
                  <ul className="list-disc pl-5 text-sm">
                    {paper.appendix.map((item, index) => (
                      <li key={index}>{item}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground">No appendix items added</p>
                )}
              </div>
            </div>
            
            <div className="text-center text-sm text-muted-foreground">
              <p>
                Please review your paper details above. Once you submit, the system will generate an IEEE-formatted paper based on your input.
              </p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <Card className="w-full max-w-4xl mx-auto">
      <CardHeader>
        <CardTitle>{steps[currentStep].title}</CardTitle>
        <div className="text-sm text-muted-foreground">
          {steps[currentStep].description}
        </div>
        <div className="flex justify-between mt-4">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex items-center ${
                index !== steps.length - 1
                  ? "flex-1 after:content-[''] after:h-[2px] after:flex-1 after:mx-2 after:bg-muted"
                  : ""
              }`}
            >
              <div
                className={`step-indicator ${
                  currentStep === index
                    ? "current"
                    : index < currentStep
                    ? "completed"
                    : ""
                }`}
              >
                {index + 1}
              </div>
            </div>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pb-6">
        <div className="form-step">{renderStepContent()}</div>
      </CardContent>

      <CardFooter className="flex justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 0}
          className="flex items-center"
        >
          <ChevronLeft className="h-4 w-4 mr-1" />
          Back
        </Button>
        <Button onClick={handleNext} className="flex items-center">
          {currentStep === steps.length - 1 ? (
            <>
              <Send className="h-4 w-4 mr-1" />
              Submit
            </>
          ) : (
            <>
              Next
              <ChevronRight className="h-4 w-4 ml-1" />
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MultiStepForm;
