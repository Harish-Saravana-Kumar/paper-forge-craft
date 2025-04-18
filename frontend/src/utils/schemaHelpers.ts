// Interfaces for the paper structure
export interface Author {
  name: string;
  affiliation: string;
  email: string;
}

export interface Image {
  filename: string;
  path: string;
  caption?: string;
}

export interface Table {
  data: string[][];
  caption?: string;
}

export interface Formula {
  latex: string;
}

export interface Subsection {
  heading: string;
  content: string;
  images?: Image[];
  formulas?: Formula[];
  tables?: Table[];
}

export interface Section {
  heading: string;
  content?: string;
  images?: Image[];
  formulas?: Formula[];
  tables?: Table[];
  subsections?: Subsection[];
}

export interface Paper {
  title: string;
  authors: Author[];
  abstract: string;
  keywords: string[];
  sections: Section[];
  references?: string[];
  appendix?: string[];
}

// Generate empty paper schema with basic required sections
export const createNewPaper = (): Paper => {
  return {
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
        images: [],
        tables: [],
        formulas: [],
      },
    ],
    references: [],
    appendix: []
  };
};

// Helper functions for managing sections and subsections
export const addSection = (paper: Paper): Paper => {
  return {
    ...paper,
    sections: [
      ...paper.sections,
      {
        id: crypto.randomUUID(),
        heading: "New Section",
        content: "",
        subsections: [],
        images: [],
        tables: [],
        formulas: [],
      },
    ],
  };
};

export const addSubsection = (paper: Paper, sectionId: string): Paper => {
  return {
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
  };
};

export const removeSection = (paper: Paper, sectionId: string): Paper => {
  return {
    ...paper,
    sections: paper.sections.filter((section) => section.id !== sectionId),
  };
};

export const removeSubsection = (paper: Paper, sectionId: string, subsectionId: string): Paper => {
  return {
    ...paper,
    sections: paper.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          subsections: section.subsections.filter((subsection) => subsection.id !== subsectionId),
        };
      }
      return section;
    }),
  };
};

// Media management functions
export const addImage = (paper: Paper, sectionId: string, subsectionId: string | null, imageData: string, caption: string): Paper => {
  if (!subsectionId) {
    // Add image directly to section
    return {
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            images: [...(section.images || []), {
              filename: '',
              path: imageData,
              caption,
            }],
          };
        }
        return section;
      }),
    };
  }

  return {
    ...paper,
    sections: paper.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          subsections: section.subsections.map((subsection) => {
            if (subsection.id === subsectionId) {
              return {
                ...subsection,
                images: [
                  ...subsection.images,
                  {
                    filename: '',
                    path: imageData,
                    caption,
                  },
                ],
              };
            }
            return subsection;
          }),
        };
      }
      return section;
    }),
  };
};

export const addTable = (
  paper: Paper, 
  sectionId: string, 
  subsectionId: string | null, 
  rows: number, 
  columns: number, 
  caption: string
): Paper => {
  // Create empty table with given dimensions
  const emptyTable = Array(rows)
    .fill(null)
    .map(() => Array(columns).fill(""));

  if (!subsectionId) {
    // Add table directly to section
    return {
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            tables: [...(section.tables || []), {
              data: emptyTable,
              caption,
            }],
          };
        }
        return section;
      }),
    };
  }

  return {
    ...paper,
    sections: paper.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          subsections: section.subsections.map((subsection) => {
            if (subsection.id === subsectionId) {
              return {
                ...subsection,
                tables: [
                  ...subsection.tables,
                  {
                    data: emptyTable,
                    caption,
                  },
                ],
              };
            }
            return subsection;
          }),
        };
      }
      return section;
    }),
  };
};

export const addFormula = (paper: Paper, sectionId: string, subsectionId: string | null, latex: string): Paper => {
  if (!subsectionId) {
    // Add formula directly to section
    return {
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          return {
            ...section,
            formulas: [...(section.formulas || []), {
              latex,
            }],
          };
        }
        return section;
      }),
    };
  }

  return {
    ...paper,
    sections: paper.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          subsections: section.subsections.map((subsection) => {
            if (subsection.id === subsectionId) {
              return {
                ...subsection,
                formulas: [
                  ...subsection.formulas,
                  {
                    latex,
                  },
                ],
              };
            }
            return subsection;
          }),
        };
      }
      return section;
    }),
  };
};

export const updateTableCell = (
  paper: Paper,
  sectionId: string,
  subsectionId: string,
  tableId: string,
  rowIndex: number,
  colIndex: number,
  value: string
): Paper => {
  return {
    ...paper,
    sections: paper.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          subsections: section.subsections.map((subsection) => {
            if (subsection.id === subsectionId) {
              return {
                ...subsection,
                tables: subsection.tables.map((table) => {
                  if (table.id === tableId) {
                    const newData = [...table.data];
                    newData[rowIndex][colIndex] = value;
                    return {
                      ...table,
                      data: newData,
                    };
                  }
                  return table;
                }),
              };
            }
            return subsection;
          }),
        };
      }
      return section;
    }),
  };
};

export const removeMedia = (
  paper: Paper,
  sectionId: string,
  subsectionId: string | null,
  mediaType: "image" | "table" | "formula",
  mediaId: string
): Paper => {
  if (!subsectionId) {
    // Remove media from section
    return {
      ...paper,
      sections: paper.sections.map((section) => {
        if (section.id === sectionId) {
          if (mediaType === "image") {
            return {
              ...section,
              images: (section.images || []).filter((img) => img.filename !== mediaId),
            };
          } else if (mediaType === "table") {
            return {
              ...section,
              tables: (section.tables || []).filter((table) => table.data !== mediaId),
            };
          } else if (mediaType === "formula") {
            return {
              ...section,
              formulas: (section.formulas || []).filter((formula) => formula.latex !== mediaId),
            };
          }
        }
        return section;
      }),
    };
  }

  return {
    ...paper,
    sections: paper.sections.map((section) => {
      if (section.id === sectionId) {
        return {
          ...section,
          subsections: section.subsections.map((subsection) => {
            if (subsection.id === subsectionId) {
              if (mediaType === "image") {
                return {
                  ...subsection,
                  images: subsection.images.filter((img) => img.filename !== mediaId),
                };
              } else if (mediaType === "table") {
                return {
                  ...subsection,
                  tables: subsection.tables.filter((table) => table.data !== mediaId),
                };
              } else if (mediaType === "formula") {
                return {
                  ...subsection,
                  formulas: subsection.formulas.filter((formula) => formula.latex !== mediaId),
                };
              }
            }
            return subsection;
          }),
        };
      }
      return section;
    }),
  };
};

// References and appendix management
export const addReference = (paper: Paper, reference: string): Paper => {
  return {
    ...paper,
    references: [...paper.references, reference]
  };
};

export const removeReference = (paper: Paper, index: number): Paper => {
  const newReferences = [...paper.references];
  newReferences.splice(index, 1);
  return {
    ...paper,
    references: newReferences
  };
};

export const addAppendixItem = (paper: Paper, appendixItem: string): Paper => {
  return {
    ...paper,
    appendix: [...paper.appendix, appendixItem]
  };
};

export const removeAppendixItem = (paper: Paper, index: number): Paper => {
  const newAppendix = [...paper.appendix];
  newAppendix.splice(index, 1);
  return {
    ...paper,
    appendix: newAppendix
  };
};
