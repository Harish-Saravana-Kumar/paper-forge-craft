import { Paper } from "./schemaHelpers";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const API_BASE_URL = "http://localhost:8000"; // FastAPI backend endpoint

// Helper function to transform frontend paper data to backend format
const transformPaperForBackend = (paperData: Paper) => {
  // Process newlines in content fields to preserve paragraphs
  const processContent = (content: string) => {
    return content.replace(/\n/g, " ").trim();
  };

  return {
    title: paperData.title,
    authors: paperData.authors.map(a => a.name),
    affiliations: paperData.authors.map(a => a.affiliation),
    emails: paperData.authors.map(a => a.email),
    abstract: processContent(paperData.abstract),
    keywords: paperData.keywords,
    sections: paperData.sections.map(s => ({
      heading: s.heading,
      content: processContent(s.content),
      images: (s.images || []).map(img => ({
        path: img.data,
        caption: img.caption
      })),
      tables: (s.tables || []).map(table => table.data),
      formulas: (s.formulas || []).map(f => f.latex),
      subsections: s.subsections.map(sub => ({
        heading: sub.heading,
        content: processContent(sub.content),
        images: sub.images.map(img => ({
          path: img.data,
          caption: img.caption
        })),
        tables: sub.tables.map(table => table.data),
        formulas: sub.formulas.map(f => f.latex)
      }))
    })),
    references: paperData.references || [],
    appendix: paperData.appendix || []
  };
};

// Authentication functions
export const signUp = async (userData: { email: string; password: string }) => {
  try {
    const { data, error } = await supabase.auth.signUp({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;
    
    return data.user;
  } catch (error) {
    console.error("Error signing up:", error);
    toast.error("Failed to sign up. Please try again.");
    throw error;
  }
};

export const login = async (userData: { email: string; password: string }) => {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email: userData.email,
      password: userData.password,
    });

    if (error) throw error;
    
    return data;
  } catch (error) {
    console.error("Error logging in:", error);
    toast.error("Failed to log in. Please try again.");
    throw error;
  }
};

export const logout = async (): Promise<void> => {
  try {
    const { error } = await supabase.auth.signOut();
    
    if (error) throw error;
    
    toast.success("Logged out successfully");
  } catch (error) {
    console.error("Error logging out:", error);
    toast.error("Failed to log out. Please try again.");
    throw error;
  }
};

export const getUserProfile = async () => {
  try {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error("No user found");
    
    return {
      id: user.id,
      email: user.email,
      created_at: user.created_at
    };
  } catch (error) {
    console.error("Error fetching profile:", error);
    toast.error("Failed to fetch profile. Please try again.");
    throw error;
  }
};

// Image upload function
export const uploadImage = async (file: File): Promise<{ filename: string; path: string }> => {
  try {
    const formData = new FormData();
    formData.append('file', file);
    
    const response = await fetch(`${API_BASE_URL}/upload-image`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Image upload failed:", errorText);
      throw new Error(`Failed to upload image: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

// Paper generation functions
export const generatePaper = async (paperData: Paper): Promise<Blob | null> => {
  try {
    const backendPaperData = transformPaperForBackend(paperData);
    
    console.log("=== Frontend Paper Data Structure ===");
    console.log("Title:", paperData.title);
    console.log("Authors:", paperData.authors);
    console.log("Abstract:", paperData.abstract);
    console.log("Keywords:", paperData.keywords);
    console.log("Sections:", paperData.sections);
    console.log("References:", paperData.references);
    console.log("Appendix:", paperData.appendix);
    console.log("Full JSON to backend:", JSON.stringify(backendPaperData, null, 2));
    
    const response = await fetch(`${API_BASE_URL}/generate`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(backendPaperData),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Paper generation failed:", errorText);
      toast.error("Failed to generate paper. Please check the console for details.");
      return null;
    }

    const blob = await response.blob();
    console.log("Received DOCX blob:", blob);
    return blob;
  } catch (error) {
    console.error("Error generating paper:", error);
    if (error instanceof TypeError && error.message === "Failed to fetch") {
      toast.error("Could not connect to the server. Please make sure the backend is running.");
    } else {
      toast.error("An error occurred while generating the paper");
    }
    return null;
  }
};

export const downloadPdf = (blob: Blob, filename: string = "ieee_paper.docx") => {
  try {
    // Create a URL for the blob
    const url = URL.createObjectURL(blob);
    
    // Create a temporary anchor element
    const a = document.createElement("a");
    a.href = url;
    a.download = filename;
    
    // Trigger the download
    document.body.appendChild(a);
    a.click();
    
    // Clean up
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    toast.success("Paper downloaded successfully!");
  } catch (error) {
    console.error("Error downloading DOCX:", error);
    toast.error("Failed to download the paper");
  }
};

// Plagiarism check function
export const checkPlagiarism = async (docxFile: Blob): Promise<{
  score: number;
  suggestions: string[];
  status: 'poor' | 'fair' | 'good' | 'excellent';
}> => {
  try {
    const formData = new FormData();
    formData.append('file', new File([docxFile], 'paper.docx', { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' }));
    
    const response = await fetch(`${API_BASE_URL}/check-plagiarism`, {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Plagiarism check failed:", errorText);
      throw new Error(`Failed to check plagiarism: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error checking plagiarism:", error);
    throw error;
  }
};
