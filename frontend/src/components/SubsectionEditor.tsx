
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Image as ImageIcon, Table as TableIcon, AlignCenter, Plus, X } from "lucide-react";
import ImageUploader from "./ImageUploader";
import TableEditor from "./TableEditor";
import FormulaInput from "./FormulaInput";
import { Subsection, Image, Table, Formula } from "@/utils/schemaHelpers";

interface SubsectionEditorProps {
  subsection: Subsection;
  onUpdate: (updatedSubsection: Subsection) => void;
  onRemove: () => void;
}

const SubsectionEditor: React.FC<SubsectionEditorProps> = ({
  subsection,
  onUpdate,
  onRemove,
}) => {
  const [activeTab, setActiveTab] = useState("content");
  const [showMediaAdder, setShowMediaAdder] = useState(false);
  const [mediaType, setMediaType] = useState<"image" | "table" | "formula" | null>(null);

  const handleHeadingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onUpdate({
      ...subsection,
      heading: e.target.value,
    });
  };

  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onUpdate({
      ...subsection,
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
      ...subsection,
      images: [...subsection.images, newImage],
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
      ...subsection,
      tables: [...subsection.tables, newTable],
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
      ...subsection,
      formulas: [...subsection.formulas, newFormula],
    });
    
    setShowMediaAdder(false);
    setMediaType(null);
  };

  const handleRemoveMedia = (type: "image" | "table" | "formula", id: string) => {
    if (type === "image") {
      onUpdate({
        ...subsection,
        images: subsection.images.filter((img) => img.id !== id),
      });
    } else if (type === "table") {
      onUpdate({
        ...subsection,
        tables: subsection.tables.filter((table) => table.id !== id),
      });
    } else if (type === "formula") {
      onUpdate({
        ...subsection,
        formulas: subsection.formulas.filter((formula) => formula.id !== id),
      });
    }
  };

  const openMediaAdder = (type: "image" | "table" | "formula") => {
    setMediaType(type);
    setShowMediaAdder(true);
  };

  const hasMedia = subsection.images.length > 0 || subsection.tables.length > 0 || subsection.formulas.length > 0;

  return (
    <div className="border rounded-md p-4 mb-4 bg-white">
      <div className="flex justify-between items-center mb-4">
        <div className="space-y-2 flex-1">
          <Label htmlFor={`subsection-heading-${subsection.id}`}>Subsection Heading</Label>
          <Input
            id={`subsection-heading-${subsection.id}`}
            value={subsection.heading}
            onChange={handleHeadingChange}
            placeholder="Subsection Heading"
          />
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="ml-2"
          onClick={onRemove}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="content">Content</TabsTrigger>
          <TabsTrigger value="media" disabled={!hasMedia}>
            Media ({subsection.images.length + subsection.tables.length + subsection.formulas.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="content" className="space-y-4">
          <div>
            <Label htmlFor={`subsection-content-${subsection.id}`}>Subsection Content</Label>
            <Textarea
              id={`subsection-content-${subsection.id}`}
              value={subsection.content}
              onChange={handleContentChange}
              placeholder="Write your subsection content here..."
              rows={6}
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
            {subsection.images.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Images</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {subsection.images.map((image) => (
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

            {subsection.tables.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Tables</h4>
                <div className="space-y-4">
                  {subsection.tables.map((table) => (
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

            {subsection.formulas.length > 0 && (
              <div className="space-y-2">
                <h4 className="font-medium">Formulas</h4>
                <div className="space-y-2">
                  {subsection.formulas.map((formula) => (
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
    </div>
  );
};

export default SubsectionEditor;
