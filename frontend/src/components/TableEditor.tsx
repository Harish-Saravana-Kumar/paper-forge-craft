
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Table as TableIcon, 
  Plus, 
  Minus,
  ChevronRight
} from "lucide-react";

interface TableEditorProps {
  onAddTable: (rows: number, columns: number, caption: string) => void;
  onUpdateCell?: (rowIndex: number, colIndex: number, value: string) => void;
  existingTable?: {
    rows: number;
    columns: number;
    data: string[][];
    caption: string;
  };
}

const TableEditor: React.FC<TableEditorProps> = ({ 
  onAddTable, 
  onUpdateCell, 
  existingTable 
}) => {
  const [rows, setRows] = useState(existingTable?.rows || 3); // Default to 3 for header + 2 data rows
  const [columns, setColumns] = useState(existingTable?.columns || 3);
  const [caption, setCaption] = useState(existingTable?.caption || "");
  const [tableData, setTableData] = useState<string[][]>(
    existingTable?.data || Array(rows).fill(null).map((_, rowIndex) => 
      Array(columns).fill("").map((_, colIndex) => 
        rowIndex === 0 ? `Header ${colIndex + 1}` : ""
      )
    )
  );
  const [showTableCreator, setShowTableCreator] = useState(!existingTable);
  const [showTableEditor, setShowTableEditor] = useState(!!existingTable);
  
  // Flag to distinguish headers - always true by default
  const [hasHeaders, setHasHeaders] = useState(true);

  const handleCreateTable = () => {
    // Initialize empty table with the specified dimensions
    const newTableData = Array(rows)
      .fill(null)
      .map((_, rowIndex) => Array(columns).fill("").map((_, colIndex) => 
        rowIndex === 0 && hasHeaders ? `Header ${colIndex + 1}` : ""
      ));
    
    setTableData(newTableData);
    setShowTableCreator(false);
    setShowTableEditor(true);
  };

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    const newData = [...tableData];
    newData[rowIndex][colIndex] = value;
    setTableData(newData);
    
    if (onUpdateCell) {
      onUpdateCell(rowIndex, colIndex, value);
    }
  };

  const handleAddRow = () => {
    const newData = [...tableData];
    newData.push(Array(columns).fill(""));
    setTableData(newData);
    setRows(rows + 1);
  };

  const handleRemoveRow = () => {
    if (rows <= 2) return; // Keep at least header + 1 data row
    const newData = tableData.slice(0, -1);
    setTableData(newData);
    setRows(rows - 1);
  };

  const handleAddColumn = () => {
    const newData = tableData.map((row, rowIndex) => [
      ...row, 
      rowIndex === 0 && hasHeaders ? `Header ${columns + 1}` : ""
    ]);
    setTableData(newData);
    setColumns(columns + 1);
  };

  const handleRemoveColumn = () => {
    if (columns <= 1) return;
    const newData = tableData.map(row => row.slice(0, -1));
    setTableData(newData);
    setColumns(columns - 1);
  };

  const handleSubmit = () => {
    onAddTable(rows, columns, caption);
    // Reset if not editing an existing table
    if (!existingTable) {
      setRows(3);
      setColumns(3);
      setCaption("");
      setTableData(Array(3).fill(null).map((_, rowIndex) => 
        Array(3).fill("").map((_, colIndex) => 
          rowIndex === 0 ? `Header ${colIndex + 1}` : ""
        )
      ));
      setShowTableCreator(true);
      setShowTableEditor(false);
    }
  };

  return (
    <div className="space-y-4 p-4 border rounded-md bg-white">
      <h3 className="text-lg font-medium">
        {existingTable ? "Edit Table" : "Add Table"}
      </h3>
      
      {showTableCreator && (
        <div className="space-y-4">
          <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <div className="flex-1 space-y-2">
              <Label htmlFor="table-rows">Rows (including header)</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setRows(Math.max(2, rows - 1))}
                  disabled={rows <= 2}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="table-rows"
                  type="number"
                  min="2"
                  value={rows}
                  onChange={(e) => setRows(Math.max(2, parseInt(e.target.value) || 2))}
                  className="w-24 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setRows(rows + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
            
            <div className="flex-1 space-y-2">
              <Label htmlFor="table-columns">Columns</Label>
              <div className="flex items-center space-x-2">
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setColumns(Math.max(1, columns - 1))}
                >
                  <Minus className="h-4 w-4" />
                </Button>
                <Input
                  id="table-columns"
                  type="number"
                  min="1"
                  value={columns}
                  onChange={(e) => setColumns(Math.max(1, parseInt(e.target.value) || 1))}
                  className="w-24 text-center"
                />
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={() => setColumns(columns + 1)}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
          
          <div className="flex justify-end">
            <Button onClick={handleCreateTable}>
              Create Table
            </Button>
          </div>
        </div>
      )}
      
      {showTableEditor && (
        <div className="space-y-4">
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  {tableData[0]?.map((_, colIndex) => (
                    <th key={colIndex} className="border border-gray-300 p-2 text-center bg-gray-100">
                      Column {colIndex + 1}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.map((row, rowIndex) => (
                  <tr key={rowIndex} className={rowIndex === 0 ? "bg-gray-50" : ""}>
                    {row.map((cell, colIndex) => (
                      <td key={colIndex} className="border border-gray-300 p-2">
                        <Input
                          value={cell}
                          onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                          className="w-full border-none focus:ring-0 p-0 h-auto"
                          placeholder={rowIndex === 0 ? `Header ${colIndex + 1}` : "Cell value"}
                        />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button size="sm" variant="outline" onClick={handleAddRow}>
              <Plus className="h-4 w-4 mr-1" /> Add Row
            </Button>
            <Button size="sm" variant="outline" onClick={handleRemoveRow} disabled={rows <= 2}>
              <Minus className="h-4 w-4 mr-1" /> Remove Row
            </Button>
            <Button size="sm" variant="outline" onClick={handleAddColumn}>
              <Plus className="h-4 w-4 mr-1" /> Add Column
            </Button>
            <Button size="sm" variant="outline" onClick={handleRemoveColumn} disabled={columns <= 1}>
              <Minus className="h-4 w-4 mr-1" /> Remove Column
            </Button>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="table-caption">Table Caption</Label>
            <Textarea
              id="table-caption"
              placeholder="Enter a caption for this table"
              value={caption}
              onChange={(e) => setCaption(e.target.value)}
            />
          </div>
          
          <div className="flex justify-end space-x-2">
            {!existingTable && (
              <Button 
                variant="outline" 
                onClick={() => {
                  setShowTableCreator(true);
                  setShowTableEditor(false);
                }}
              >
                Back to Setup
              </Button>
            )}
            <Button onClick={handleSubmit}>
              {existingTable ? "Update Table" : "Add Table"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};

export default TableEditor;
