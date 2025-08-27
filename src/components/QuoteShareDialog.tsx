import { useState, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { GlassButton } from "./GlassButton";
import { Download, Share2, Copy } from "lucide-react";
import html2canvas from "html2canvas";
import { toast } from "@/hooks/use-toast";

interface QuoteShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote: {
    id: string;
    text: string;
    author: string;
    book?: string;
    tags: string[];
  } | null;
}

const QuoteShareDialog = ({ open, onOpenChange, quote }: QuoteShareDialogProps) => {
  const [template, setTemplate] = useState<"minimal" | "elegant" | "colorful">("minimal");
  const [isGenerating, setIsGenerating] = useState(false);
  const quoteCardRef = useRef<HTMLDivElement>(null);

  if (!quote) return null;

  const generateImage = async () => {
    if (!quoteCardRef.current) return;

    setIsGenerating(true);
    try {
      const canvas = await html2canvas(quoteCardRef.current, {
        width: 800,
        height: 800,
        scale: 2,
        backgroundColor: null,
        logging: false,
      });

      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => resolve(blob!), 'image/png');
      });

      return blob;
    } catch (error) {
      console.error("Error generating image:", error);
      toast({
        title: "Error generating image",
        description: "Please try again",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDownload = async () => {
    const blob = await generateImage();
    if (!blob) return;

    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `quote-${quote.id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);

    toast({
      description: "Quote image downloaded!",
    });
  };

  const handleShare = async () => {
    const blob = await generateImage();
    if (!blob) return;

    if (navigator.share && navigator.canShare?.({ files: [new File([blob], 'quote.png', { type: 'image/png' })] })) {
      try {
        await navigator.share({
          title: 'Quote',
          text: `"${quote.text}" — ${quote.author}`,
          files: [new File([blob], 'quote.png', { type: 'image/png' })]
        });
      } catch (error) {
        // User cancelled or error occurred
      }
    } else {
      // Fallback to copying text
      const shareText = `"${quote.text}" — ${quote.author}${quote.book ? ` (${quote.book})` : ''}`;
      navigator.clipboard.writeText(shareText);
      toast({
        description: "Quote text copied to clipboard!",
      });
    }
  };

  const handleCopyText = () => {
    const shareText = `"${quote.text}" — ${quote.author}${quote.book ? ` (${quote.book})` : ''}`;
    navigator.clipboard.writeText(shareText);
    toast({
      description: "Quote copied to clipboard!",
    });
  };

  const getTemplateClasses = () => {
    switch (template) {
      case "minimal":
        return "bg-gradient-to-br from-gray-50 to-white text-gray-900 border border-gray-200";
      case "elegant":
        return "bg-gradient-to-br from-slate-800 to-slate-900 text-white border border-slate-700";
      case "colorful":
        return "bg-gradient-to-br from-purple-600 via-pink-600 to-red-600 text-white border-0";
      default:
        return "bg-gradient-to-br from-gray-50 to-white text-gray-900 border border-gray-200";
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl glass-surface border-glass-border">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Share Quote</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Template Selection */}
          <div className="space-y-3">
            <h3 className="text-sm font-medium text-muted-foreground">Choose Template</h3>
            <div className="flex space-x-3">
              {[
                { id: "minimal", name: "Minimal" },
                { id: "elegant", name: "Elegant" },
                { id: "colorful", name: "Colorful" },
              ].map((t) => (
                <GlassButton
                  key={t.id}
                  variant={template === t.id ? "accent" : "ghost"}
                  onClick={() => setTemplate(t.id as any)}
                  size="sm"
                >
                  {t.name}
                </GlassButton>
              ))}
            </div>
          </div>

          {/* Quote Card Preview */}
          <div className="flex justify-center">
            <div
              ref={quoteCardRef}
              className={`p-12 rounded-3xl shadow-2xl ${getTemplateClasses()}`}
              style={{ width: '600px', minHeight: '600px' }}
            >
              <div className="h-full flex flex-col justify-center items-center text-center space-y-8">
                {/* Quote mark */}
                <div className={`text-6xl font-serif ${template === "colorful" ? "text-white/30" : template === "elegant" ? "text-white/20" : "text-gray-300"}`}>
                  "
                </div>

                {/* Quote text */}
                <blockquote className={`text-2xl leading-relaxed font-medium max-w-md ${template === "colorful" ? "text-white" : template === "elegant" ? "text-gray-100" : "text-gray-800"}`}>
                  {quote.text}
                </blockquote>

                {/* Attribution */}
                <div className="space-y-2">
                  <div className={`text-lg font-semibold ${template === "colorful" ? "text-white/90" : template === "elegant" ? "text-gray-200" : "text-gray-600"}`}>
                    — {quote.author}
                  </div>
                  {quote.book && (
                    <div className={`text-base italic ${template === "colorful" ? "text-white/70" : template === "elegant" ? "text-gray-300" : "text-gray-500"}`}>
                      {quote.book}
                    </div>
                  )}
                </div>

                {/* Tags */}
                {quote.tags.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-6">
                    {quote.tags.slice(0, 3).map((tag) => (
                      <span
                        key={tag}
                        className={`px-3 py-1 rounded-full text-sm ${
                          template === "colorful" 
                            ? "bg-white/20 text-white" 
                            : template === "elegant" 
                            ? "bg-white/10 text-gray-200" 
                            : "bg-gray-200 text-gray-700"
                        }`}
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-center space-x-4">
            <GlassButton
              onClick={handleCopyText}
              variant="ghost"
              className="glass-interactive"
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy Text
            </GlassButton>
            
            <GlassButton
              onClick={handleDownload}
              disabled={isGenerating}
              variant="default"
              className="glass-interactive"
            >
              <Download className="mr-2 h-4 w-4" />
              {isGenerating ? "Generating..." : "Download"}
            </GlassButton>

            <GlassButton
              onClick={handleShare}
              disabled={isGenerating}
              variant="accent"
            >
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </GlassButton>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default QuoteShareDialog;