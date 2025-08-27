import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface DeleteConfirmDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  quoteText: string;
}

export function DeleteConfirmDialog({ 
  open, 
  onOpenChange, 
  onConfirm, 
  quoteText 
}: DeleteConfirmDialogProps) {
  const truncatedText = quoteText.length > 100 
    ? quoteText.substring(0, 100) + "..." 
    : quoteText;

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
      <AlertDialogContent className="glass-surface border-glass-border">
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Quote</AlertDialogTitle>
          <AlertDialogDescription className="space-y-2">
            <span>Are you sure you want to delete this quote?</span>
            <div className="p-3 rounded-lg glass-surface-subtle border border-glass-border">
              <em>"{truncatedText}"</em>
            </div>
            <span className="text-sm text-muted-foreground">
              This action cannot be undone.
            </span>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className="glass-surface border-glass-border hover:glass-surface-subtle">
            Cancel
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            Delete Quote
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}