
import { Button } from "@/components/ui/button";
import { FileText, FileUp, Code, Book } from "lucide-react";
import { Link } from "react-router-dom";

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <header className="py-6 border-b">
        <div className="container flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary">IEEE Paper Forge</h1>
          <nav className="hidden md:flex space-x-4">
            <a href="#features" className="text-muted-foreground hover:text-foreground">Features</a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">How It Works</a>
            <a href="https://github.com/Harish-Saravana-Kumar/ieee-backend" target="_blank" rel="noopener noreferrer" className="text-muted-foreground hover:text-foreground">GitHub</a>
          </nav>
        </div>
      </header>
      
      <main className="flex-1">
        {/* Hero Section */}
        <section className="py-16 md:py-24 bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="container">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <h1 className="text-4xl md:text-5xl font-bold leading-tight">
                  Generate IEEE-Formatted Academic Papers with Ease
                </h1>
                <p className="text-xl text-muted-foreground">
                  Create professional academic papers with our intuitive multi-step form builder that handles content, media, and formatting automatically.
                </p>
                <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-3">
                  <Button asChild size="lg" className="flex items-center">
                    <Link to="/paper-builder">
                      <FileText className="mr-2 h-5 w-5" />
                      Create New Paper
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="lg">
                    <a href="https://github.com/Harish-Saravana-Kumar/ieee-backend" target="_blank" rel="noopener noreferrer">
                      <Code className="mr-2 h-5 w-5" />
                      View on GitHub
                    </a>
                  </Button>
                </div>
              </div>
              <div className="hidden md:block">
                <img 
                  src="https://images.unsplash.com/photo-1532153975070-2e9ab71f1b14?q=80&w=1740&auto=format&fit=crop" 
                  alt="Academic papers" 
                  className="rounded-lg shadow-xl"
                />
              </div>
            </div>
          </div>
        </section>
        
        {/* Features Section */}
        <section id="features" className="py-16">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">Key Features</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <FileText className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Dynamic Sections</h3>
                <p className="text-muted-foreground">
                  Easily add and organize sections and subsections to structure your academic paper exactly as needed.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <FileUp className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">Media Support</h3>
                <p className="text-muted-foreground">
                  Seamlessly integrate images, tables, and mathematical formulas within your paper content.
                </p>
              </div>
              
              <div className="bg-white p-6 rounded-lg shadow-sm border">
                <div className="p-3 bg-primary/10 rounded-full w-fit mb-4">
                  <Book className="h-6 w-6 text-primary" />
                </div>
                <h3 className="text-xl font-semibold mb-3">IEEE Formatting</h3>
                <p className="text-muted-foreground">
                  Your finished paper is automatically formatted according to IEEE academic standards.
                </p>
              </div>
            </div>
          </div>
        </section>
        
        {/* How It Works */}
        <section id="how-it-works" className="py-16 bg-muted/30">
          <div className="container">
            <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
            <div className="max-w-3xl mx-auto space-y-8">
              <div className="flex items-start gap-4">
                <div className="step-indicator">1</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Enter Paper Metadata</h3>
                  <p className="text-muted-foreground">
                    Start by providing the title of your paper and adding information about all authors and their affiliations.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="step-indicator">2</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Add Abstract and Keywords</h3>
                  <p className="text-muted-foreground">
                    Write your paper abstract and specify relevant keywords to categorize your research.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="step-indicator">3</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Build Paper Structure</h3>
                  <p className="text-muted-foreground">
                    Create sections and subsections, add your content, and enhance with images, tables, and LaTeX formulas.
                  </p>
                </div>
              </div>
              
              <div className="flex items-start gap-4">
                <div className="step-indicator">4</div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Generate and Download</h3>
                  <p className="text-muted-foreground">
                    Review your paper and submit. The system will generate a fully formatted IEEE PDF that you can download.
                  </p>
                </div>
              </div>
            </div>
            
            <div className="text-center mt-12">
              <Button asChild size="lg">
                <Link to="/paper-builder">
                  <FileText className="mr-2 h-5 w-5" />
                  Start Building Your Paper
                </Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      
      <footer className="py-8 border-t">
        <div className="container text-center">
          <p className="text-muted-foreground">
            IEEE Paper Generator | Backend by <a href="https://github.com/Harish-Saravana-Kumar/ieee-backend" target="_blank" rel="noopener noreferrer" className="text-primary hover:underline">Harish-Saravana-Kumar</a>
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Index;
