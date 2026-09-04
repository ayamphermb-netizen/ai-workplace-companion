import { Check, Copy, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

export function OutputToolbar({
  getText,
  onRegenerate,
  onClear,
  editing,
  onToggleEdit,
  busy,
}: {
  getText: () => string;
  onRegenerate: () => void;
  onClear: () => void;
  editing: boolean;
  onToggleEdit: () => void;
  busy?: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(getText());
      setCopied(true);
      toast.success("Copied to clipboard");
      setTimeout(() => setCopied(false), 1600);
    } catch {
      toast.error("Copying isn't available in this browser");
    }
  };

  return (
    <div className="flex flex-wrap gap-2">
      <Button type="button" variant="secondary" size="sm" onClick={copy}>
        {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
        Copy
      </Button>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={onRegenerate}
        disabled={busy}
      >
        <RefreshCw className={busy ? "size-4 animate-spin" : "size-4"} />
        Regenerate
      </Button>
      <Button type="button" variant="secondary" size="sm" onClick={onToggleEdit}>
        <Pencil className="size-4" />
        {editing ? "Done editing" : "Edit"}
      </Button>
      <Button type="button" variant="ghost" size="sm" onClick={onClear}>
        <Trash2 className="size-4" />
        Clear
      </Button>
    </div>
  );
}
