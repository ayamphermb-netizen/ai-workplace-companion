import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { Loader2, Sparkles } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { PageHeader } from "@/components/PageHeader";
import { ResponsibleAINotice } from "@/components/ResponsibleAINotice";
import { OutputToolbar } from "@/components/OutputToolbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateEmail } from "@/lib/ai.functions";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/email")({
  head: () => ({
    meta: [
      { title: "Smart Email Generator | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Generate polished, professional workplace emails with AI from your purpose, recipient, key points and tone.",
      },
      { property: "og:title", content: "Smart Email Generator" },
      {
        property: "og:description",
        content: "Create polished professional emails with AI.",
      },
    ],
  }),
  component: EmailPage,
});

type Draft = { subject: string; greeting: string; body: string; closing: string };

function parseEmail(text: string): Draft {
  const lines = text.replace(/\r/g, "").split("\n");
  let subject = "";
  const rest: string[] = [];
  for (const line of lines) {
    const match = /^\s*(?:\*\*)?subject(?:\*\*)?\s*:\s*(.*)$/i.exec(line);
    if (!subject && match) {
      subject = match[1].trim();
      continue;
    }
    rest.push(line);
  }
  const paragraphs = rest
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean);

  if (paragraphs.length === 0) return { subject, greeting: "", body: text.trim(), closing: "" };
  if (paragraphs.length === 1) return { subject, greeting: "", body: paragraphs[0], closing: "" };
  if (paragraphs.length === 2)
    return { subject, greeting: paragraphs[0], body: paragraphs[1], closing: "" };

  return {
    subject,
    greeting: paragraphs[0],
    body: paragraphs.slice(1, -1).join("\n\n"),
    closing: paragraphs[paragraphs.length - 1],
  };
}

function draftToText(d: Draft) {
  return [`Subject: ${d.subject}`, "", d.greeting, "", d.body, "", d.closing]
    .filter((part, i) => part !== "" || i % 2 === 1)
    .join("\n")
    .trim();
}

function EmailPage() {
  const { settings, logActivity } = useAppState();
  const run = useServerFn(generateEmail);

  const [purpose, setPurpose] = useState("");
  const [recipient, setRecipient] = useState("");
  const [keyPoints, setKeyPoints] = useState("");
  const [tone, setTone] = useState<"Formal" | "Friendly" | "Persuasive">(settings.defaultTone);
  const [instructions, setInstructions] = useState("");

  const [draft, setDraft] = useState<Draft | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const generate = async () => {
    if (!purpose.trim()) {
      toast.error("Add the email purpose first");
      return;
    }
    setLoading(true);
    try {
      const result = await run({
        data: {
          purpose,
          recipient,
          keyPoints,
          tone,
          instructions,
          prefs: {
            responseLength: settings.responseLength,
            writingStyle: settings.writingStyle,
          },
        },
      });
      setDraft(parseEmail(result.text));
      setEditing(false);
      logActivity("Smart Email Generator", `${tone} email — ${purpose.slice(0, 60)}`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const clearAll = () => {
    setDraft(null);
    setEditing(false);
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Smart Email Generator"
        title="Draft a professional email in seconds"
        description="Describe what you need and the AI writes a polished email using your actual purpose, recipient, key points and tone."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="purpose">Email purpose</Label>
            <Textarea
              id="purpose"
              value={purpose}
              onChange={(e) => setPurpose(e.target.value)}
              placeholder="e.g. Ask the vendor for an updated delivery timeline after the delay"
              className="min-h-24"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="recipient">Recipient</Label>
            <Input
              id="recipient"
              value={recipient}
              onChange={(e) => setRecipient(e.target.value)}
              placeholder="e.g. Thandi, Operations Manager at Northwind"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="keypoints">Key points</Label>
            <Textarea
              id="keypoints"
              value={keyPoints}
              onChange={(e) => setKeyPoints(e.target.value)}
              placeholder="One point per line"
              className="min-h-28"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="tone">Tone</Label>
            <Select value={tone} onValueChange={(v) => setTone(v as typeof tone)}>
              <SelectTrigger id="tone">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Formal">Formal</SelectItem>
                <SelectItem value="Friendly">Friendly</SelectItem>
                <SelectItem value="Persuasive">Persuasive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label htmlFor="instructions">Additional instructions</Label>
            <Textarea
              id="instructions"
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="e.g. Keep it under 150 words and mention the contract clause"
              className="min-h-20"
            />
          </div>
          <Button onClick={generate} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Generating…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Generate Email
              </>
            )}
          </Button>
        </section>

        <section className="space-y-5">
          <div className="surface-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Generated email</h2>
              {draft ? (
                <OutputToolbar
                  getText={() => draftToText(draft)}
                  onRegenerate={generate}
                  onClear={clearAll}
                  editing={editing}
                  onToggleEdit={() => setEditing((v) => !v)}
                  busy={loading}
                />
              ) : null}
            </div>

            {!draft ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                {loading
                  ? "Writing your email…"
                  : "Your AI-generated email will appear here, fully editable."}
              </div>
            ) : (
              <div className="mt-5 space-y-4">
                <Field label="Subject" editing={editing}>
                  <Input
                    value={draft.subject}
                    readOnly={!editing}
                    onChange={(e) => setDraft({ ...draft, subject: e.target.value })}
                  />
                </Field>
                <Field label="Greeting" editing={editing}>
                  <Input
                    value={draft.greeting}
                    readOnly={!editing}
                    onChange={(e) => setDraft({ ...draft, greeting: e.target.value })}
                  />
                </Field>
                <Field label="Email body" editing={editing}>
                  <Textarea
                    value={draft.body}
                    readOnly={!editing}
                    className="min-h-56"
                    onChange={(e) => setDraft({ ...draft, body: e.target.value })}
                  />
                </Field>
                <Field label="Closing" editing={editing}>
                  <Textarea
                    value={draft.closing}
                    readOnly={!editing}
                    className="min-h-20"
                    onChange={(e) => setDraft({ ...draft, closing: e.target.value })}
                  />
                </Field>
              </div>
            )}
          </div>
          <ResponsibleAINotice />
        </section>
      </div>
    </div>
  );
}

function Field({
  label,
  editing,
  children,
}: {
  label: string;
  editing: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-2">
      <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
        {editing ? <span className="ml-2 normal-case text-primary">editing</span> : null}
      </p>
      {children}
    </div>
  );
}
