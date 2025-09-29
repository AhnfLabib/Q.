import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { GlassButton } from "./GlassButton";
import { Badge } from "./ui/badge";
import { X } from "lucide-react";
import { useState, useEffect } from "react";
import { QuoteFormData } from "@/types/database";
import { useHapticFeedback } from "@/hooks/useMobileGestures";

const quoteSchema = z.object({
  quote_text: z.string().min(10, "Quote must be at least 10 characters long"),
  author: z.string().min(2, "Author name must be at least 2 characters long"),
  book: z.string().optional(),
  chapter: z.string().optional(),
  page_number: z.number().optional(),
  source_url: z.string().url().optional().or(z.literal("")),
  tags: z.array(z.string()).min(1, "At least one tag is required"),
  difficulty_level: z.number().min(1).max(5).optional(),
  mood: z.string().optional(),
});

type FormData = z.infer<typeof quoteSchema>;

interface LegacyQuote {
  id: string;
  text: string;
  author: string;
  book?: string;
  tags: string[];
  favorite?: boolean;
}

interface MobileQuoteDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  quote?: LegacyQuote | null;
  onSubmit: (data: QuoteFormData) => void;
}

export function MobileQuoteDialog({ open, onOpenChange, quote, onSubmit }: MobileQuoteDialogProps) {
  const [tagInput, setTagInput] = useState("");
  const isEditing = !!quote;
  const { lightTap, success } = useHapticFeedback();

  const form = useForm<FormData>({
    resolver: zodResolver(quoteSchema),
    defaultValues: {
      quote_text: "",
      author: "",
      book: "",
      chapter: "",
      page_number: undefined,
      source_url: "",
      tags: [],
      difficulty_level: 1,
      mood: "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        quote_text: quote?.text || "",
        author: quote?.author || "",
        book: quote?.book || "",
        chapter: "",
        page_number: undefined,
        source_url: "",
        tags: quote?.tags || [],
        difficulty_level: 1,
        mood: "",
      });
      setTagInput("");
    }
  }, [open, quote, form]);

  const handleSubmit = (data: FormData) => {
    success(); // Haptic feedback
    const quoteData: QuoteFormData = {
      quote_text: data.quote_text,
      author: data.author,
      book: data.book || undefined,
      chapter: data.chapter || undefined,
      page_number: data.page_number || undefined,
      source_url: data.source_url || undefined,
      tags: data.tags,
      difficulty_level: data.difficulty_level || 1,
      mood: data.mood || undefined,
    };
    
    onSubmit(quoteData);
    form.reset();
    setTagInput("");
    onOpenChange(false);
  };

  const addTag = (tag: string) => {
    const trimmedTag = tag.trim().toLowerCase();
    if (trimmedTag && !form.getValues("tags").includes(trimmedTag)) {
      lightTap(); // Haptic feedback
      const currentTags = form.getValues("tags");
      form.setValue("tags", [...currentTags, trimmedTag]);
    }
    setTagInput("");
  };

  const removeTag = (tagToRemove: string) => {
    lightTap(); // Haptic feedback
    const currentTags = form.getValues("tags");
    form.setValue("tags", currentTags.filter(tag => tag !== tagToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && tagInput.trim()) {
      e.preventDefault();
      addTag(tagInput);
    }
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent className="glass-surface border-glass-border max-h-[90vh]">
        <DrawerHeader>
          <DrawerTitle className="text-xl font-semibold">
            {isEditing ? "Edit Quote" : "Add New Quote"}
          </DrawerTitle>
          <DrawerDescription className="text-muted-foreground">
            {isEditing ? "Update your quote details below." : "Add a new quote to your collection."}
          </DrawerDescription>
        </DrawerHeader>

        <div className="px-4 overflow-y-auto flex-1">
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="quote_text"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Quote Text</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Enter the quote text..."
                        className="glass-surface-subtle border-glass-border resize-none min-h-[100px]"
                        rows={4}
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="author"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Author</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Author name"
                        className="glass-surface-subtle border-glass-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="book"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Book (Optional)</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Book or source"
                        className="glass-surface-subtle border-glass-border"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="tags"
                render={() => (
                  <FormItem>
                    <FormLabel>Tags</FormLabel>
                    <FormControl>
                      <div className="space-y-3">
                        <Input
                          placeholder="Type a tag and press Enter"
                          className="glass-surface-subtle border-glass-border"
                          value={tagInput}
                          onChange={(e) => setTagInput(e.target.value)}
                          onKeyDown={handleTagKeyDown}
                        />
                        <div className="flex flex-wrap gap-2">
                          {form.watch("tags").map((tag) => (
                            <Badge
                              key={tag}
                              variant="secondary"
                              className="glass-surface-subtle border-glass-border text-sm px-3 py-1"
                            >
                              {tag}
                              <button
                                type="button"
                                onClick={() => removeTag(tag)}
                                className="ml-2 text-muted-foreground hover:text-foreground"
                              >
                                <X className="h-3 w-3" />
                              </button>
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
        </div>

        <DrawerFooter className="pt-4">
          <div className="flex gap-3">
            <GlassButton
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </GlassButton>
            <GlassButton 
              onClick={form.handleSubmit(handleSubmit)}
              variant="accent"
              className="flex-1"
            >
              {isEditing ? "Update Quote" : "Add Quote"}
            </GlassButton>
          </div>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}