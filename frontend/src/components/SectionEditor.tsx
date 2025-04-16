
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { ChevronDown, ChevronUp, Plus, X, ImageIcon, Table as TableIcon, AlignCenter } from "lucide-react";
import { 
  Collapsible, 
  CollapsibleContent, 
  CollapsibleTrigger 
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import SubsectionEditor from "./SubsectionEditor";
import { Section, Subsection, Image, Table, Formula } from "@/utils/schemaHelpers";
import ImageUploader from "./ImageUploader";
import TableEditor from "./TableEditor";
import FormulaInput from "./FormulaInput";

interface SectionEditorProps {
  section: Section;
  onUpdate: (updatedSection: Section) => void;
  onRemove: () => void;
  onAddSubsection: () => void;
  onUpdateSubsection: (subsectionId: string, updatedSubsection: Subsection) => void;
  onRemoveSubsection: (subsectionId: string) => void;
}

const SectionEditor: React.FC<SectionEditorProps> = ({
  section,
  onUpdate,
  onRemove,
  onAddSubsection,
  onUpdateSubsection,
  onRemoveSubsection,
}) => {
  const [isOpen, setIsOpen] = useState(true);
  const [activeTab, setActiveTab] = useState("content");
  const [showMediaAdder, setShowMediaAdder] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "table" | "formula" | null>(null);

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...section,
      heading: e.target.value,
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...section,
      content: e.target.value,
    });
  };

  const handleAddImage = (imageData: string, caption: string) => {
    const newImage: Image = {
      id: crypto.randomUUID(),
      data: imageData,
      caption,
    };
    
    onUpdate({
      ...section,
      images: [...(section.images || []), newImage],
    });
    
    setShowMediaAdder(false);
    setMediaType(null);
  };

  const handleAddTable = (rows: number, columns: number, caption: string) => {
    const emptyTable = Array(rows)
      .fill(null)
      .map(() => Array(columns).fill(""));
    
    const newTable: Table = {
      id: crypto.randomUUID(),
      rows,
      columns,
      caption,
      data: emptyTable,
    };
    
    onUpdate({
      ...section,
      tables: [...(section.tables || []), newTable],
    });
    
    setShowMediaAdder(false);
    setMediaType(null);
  };

  const handleAddFormula = (latex: string) => {
    const newFormula: Formula = {
      id: crypto.randomUUID(),
      latex,
    };
    
    onUpdate({
      ...section,
      formulas: [...(section.formulas || []), newFormula],
    });
    
    setShowMediaAdder(false);
    setMediaType(null);
  };

  const handleRemoveMedia = (type: "image" | "table" | "formula", id: string) => {
    if (type === "image") {
      onUpdate({
        ...section,
        images: (section.images || []).filter((img) => img.id !== id),
      });
    } else if (type === "table") {
      onUpdate({
        ...section,
        tables: (section.tables || []).filter((table) => table.id !== id),
      });
    } else if (type === "formula") {
      onUpdate({
        ...section,
        formulas: (section.formulas || []).filter((formula) => formula.id !== id),
      });
    }
  };

  const openMediaAdder = (type: "image" | "table" | "formula") => {
    setMediaType(type);
    setShowMediaAdder(true);
  };

  const hasMedia = 
    (section.images && section.images.length > 0) || 
    (section.tables && section.tables.length > 0) || 
    (section.formulas && section.formulas.length > 0);

  return (
    <Collapsible
      open={isOpen}
      onOpenChange={setIsOpen}
      className="border rounded-md mb-4 bg-white/75 backdrop-blur"
    >
      <div className="p-4 flex justify-between items-center">
        <div className="flex-1 space-y-2">
          <Label htmlFor={`section-heading-${section.id}`}>Section Heading</Label>
          <Input
            id={`section-heading-${section.id}`}
            value={section.heading}
            onChange={handleHeadingChange}
            placeholder="Section Heading"
            className="font-medium"
          />
        </div>
        
        <div className="flex items-center space-x-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={onRemove}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="icon">
              {isOpen ? (
                <ChevronUp className="h-4 w-4" />
              ) : (
                <ChevronDown className="h-4 w-4" />
              )}
            </Button>
          </CollapsibleTrigger>
        </div>
      </div>

      <CollapsibleContent className="p-4 pt-0 space-y-4">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="content">Content</TabsTrigger>
            <TabsTrigger value="media" disabled={!hasMedia}>
              Media ({(section.images?.length || 0) + (section.tables?.length || 0) + (section.formulas?.length || 0)})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="content" className="space-y-4">
            <div>
              <Label htmlFor={`section-content-${section.id}`}>Section Content</Label>
              <Textarea
                id={`section-content-${section.id}`}
                value={section.content}
                onChange={handleContentChange}
                placeholder="Write your section content here..."
                rows={4}
              />
            </div>

            {!showMediaAdder && (
              <div className="flex flex-wrap gap-2 mt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMediaAdder("image")}
                  className="flex items-center"
                >
                  <ImageIcon className="h-4 w-4 mr-2" />
                  Add Image
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMediaAdder("table")}
                  className="flex items-center"
                >
                  <TableIcon className="h-4 w-4 mr-2" />
                  Add Table
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => openMediaAdder("formula")}
                  className="flex items-center"
                >
                  <AlignCenter className="h-4 w-4 mr-2" />
                  Add Formula
                </Button>
              </div>
            )}

            {showMediaAdder && (
              <div className="mt-4">
                {mediaType === "image" && (
                  <ImageUploader onAddImage={handleAddImage} />
                )}
                {mediaType === "table" && (
                  <TableEditor onAddTable={handleAddTable} />
                )}
                {mediaType === "formula" && (
                  <FormulaInput onAddFormula={handleAddFormula} />
                )}
                <Button 
                  variant="ghost" 
                  className="mt-2"
                  onClick={() => {
                    setShowMediaAdder(false);
                    setMediaType(null);
                  }}
                >
                  Cancel
                </Button>
              </div>
            )}
          </TabsContent>

          <TabsContent value="media">
            <div className="space-y-6">
              {section.images && section.images.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Images</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.images.map((image) => (
                      <div key={image.id} className="relative border rounded-md p-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                          onClick={() => handleRemoveMedia("image", image.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                        <img
                          src={image.data}
                          alt={image.caption}
                          className="max-h-40 mx-auto object-contain mb-2"
                        />
                        <p className="text-sm text-center">{image.caption}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.tables && section.tables.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Tables</h4>
                  <div className="space-y-4">
                    {section.tables.map((table) => (
                      <div key={table.id} className="border rounded-md p-2">
                        <div className="flex justify-between items-center mb-2">
                          <h5 className="font-medium text-sm">{table.caption}</h5>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleRemoveMedia("table", table.id)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        <div className="overflow-x-auto">
                          <table className="w-full border-collapse">
                            <tbody>
                              {table.data.map((row, rowIndex) => (
                                <tr key={rowIndex}>
                                  {row.map((cell, colIndex) => (
                                    <td key={colIndex} className="border border-gray-300 p-2 text-sm">
                                      {cell || <span className="text-gray-400">Empty</span>}
                                    </td>
                                  ))}
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {section.formulas && section.formulas.length > 0 && (
                <div className="space-y-2">
                  <h4 className="font-medium">Formulas</h4>
                  <div className="space-y-2">
                    {section.formulas.map((formula) => (
                      <div key={formula.id} className="border rounded-md p-3 flex justify-between items-center">
                        <div className="latex-preview flex-1">
                          <p className="font-mono break-all">{formula.latex}</p>
                        </div>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleRemoveMedia("formula", formula.id)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </TabsContent>
        </Tabs>

        {section.subsections.length > 0 && (
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Subsections</h3>
            <div className="pl-4 border-l-2 border-gray-200 space-y-3">
              {section.subsections.map((subsection) => (
                <SubsectionEditor
                  key={subsection.id}
                  subsection={subsection}
                  onUpdate={(updatedSubsection) => onUpdateSubsection(subsection.id, updatedSubsection)}
                  onRemove={() => onRemoveSubsection(subsection.id)}
                />
              ))}
            </div>
          </div>
        )}

        <Button
          variant="outline"
          size="sm"
          onClick={onAddSubsection}
          className="w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Subsection
        </Button>
      </CollapsibleContent>
    </Collapsible>
  );
};

export default SectionEditor;
