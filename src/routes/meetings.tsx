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
import { summarizeMeeting } from "@/lib/ai.functions";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/meetings")({
  head: () => ({
    meta: [
      { title: "Meeting Notes Summarizer | AI Workplace Assistant" },
      {
        name: "description",
        content:
          "Paste meeting notes and get an AI summary with key discussion points, decisions, action items, owners and deadlines.",
      },
      { property: "og:title", content: "Meeting Notes Summarizer" },
      {
        property: "og:description",
        content:
          "Turn lengthy meeting notes into summaries, decisions, action items and deadlines.",
      },
    ],
  }),
  component: MeetingsPage,
});

type ActionItem = { task: string; owner: string; deadline: string };
type Summary = {
  summary: string;
  keyPoints: string[];
  decisions: string[];
  actionItems: ActionItem[];
};

function summaryToText(title: string, s: Summary) {
  return [
    title ? `Meeting: ${title}` : "",
    "",
    "Summary",
    s.summary,
    "",
    "Key discussion points",
    ...s.keyPoints.map((p) => `- ${p}`),
    "",
    "Decisions",
    ...s.decisions.map((d) => `- ${d}`),
    "",
    "Action items",
    ...s.actionItems.map((a) => `- ${a.task} | Owner: ${a.owner} | Deadline: ${a.deadline}`),
  ]
    .join("\n")
    .trim();
}

function MeetingsPage() {
  const { settings, logActivity } = useAppState();
  const run = useServerFn(summarizeMeeting);

  const [title, setTitle] = useState("");
  const [notes, setNotes] = useState("");
  const [result, setResult] = useState<Summary | null>(null);
  const [editing, setEditing] = useState(false);
  const [loading, setLoading] = useState(false);

  const summarize = async () => {
    if (notes.trim().length < 20) {
      toast.error("Paste your meeting notes first");
      return;
    }
    setLoading(true);
    try {
      const data = await run({
        data: {
          title,
          notes,
          prefs: {
            responseLength: settings.responseLength,
            writingStyle: settings.writingStyle,
          },
        },
      });
      setResult(data);
      setEditing(false);
      logActivity("Meeting Notes Summarizer", title.trim() || "Untitled meeting summarized");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const updateList = (key: "keyPoints" | "decisions", index: number, value: string) => {
    if (!result) return;
    const next = [...result[key]];
    next[index] = value;
    setResult({ ...result, [key]: next });
  };

  const updateAction = (index: number, patch: Partial<ActionItem>) => {
    if (!result) return;
    const next = result.actionItems.map((item, i) => (i === index ? { ...item, ...patch } : item));
    setResult({ ...result, actionItems: next });
  };

  return (
    <div className="space-y-8">
      <PageHeader
        eyebrow="Meeting Notes Summarizer"
        title="Turn raw notes into clear outcomes"
        description="The AI analyses your actual notes to extract a summary, key discussion points, decisions and action items with owners and deadlines."
      />

      <div className="grid gap-6 lg:grid-cols-2">
        <section className="surface-card space-y-5 p-6">
          <div className="space-y-2">
            <Label htmlFor="title">Meeting title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Q3 Product Planning — 4 September"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="notes">Meeting notes</Label>
            <Textarea
              id="notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Paste your full meeting notes or transcript here…"
              className="min-h-[22rem]"
            />
          </div>
          <Button onClick={summarize} disabled={loading} size="lg" className="w-full">
            {loading ? (
              <>
                <Loader2 className="size-4 animate-spin" /> Summarizing…
              </>
            ) : (
              <>
                <Sparkles className="size-4" /> Summarize Meeting
              </>
            )}
          </Button>
        </section>

        <section className="space-y-5">
          <div className="surface-card p-6">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <h2 className="text-base font-semibold text-foreground">Meeting outcomes</h2>
              {result ? (
                <OutputToolbar
                  getText={() => summaryToText(title, result)}
                  onRegenerate={summarize}
                  onClear={() => {
                    setResult(null);
                    setEditing(false);
                  }}
                  editing={editing}
                  onToggleEdit={() => setEditing((v) => !v)}
                  busy={loading}
                />
              ) : null}
            </div>

            {!result ? (
              <div className="mt-6 rounded-2xl border border-dashed border-border p-8 text-center text-sm text-muted-foreground">
                {loading
                  ? "Reading your notes…"
                  : "Your summary, decisions and action items will appear here, fully editable."}
              </div>
            ) : (
              <div className="mt-5 space-y-6">
                <div className="space-y-2">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Summary
                  </h3>
                  {editing ? (
                    <Textarea
                      value={result.summary}
                      className="min-h-28"
                      onChange={(e) => setResult({ ...result, summary: e.target.value })}
                    />
                  ) : (
                    <p className="text-sm leading-relaxed text-foreground/90">{result.summary}</p>
                  )}
                </div>

                <ListBlock
                  heading="Key discussion points"
                  items={result.keyPoints}
                  editing={editing}
                  onChange={(i, v) => updateList("keyPoints", i, v)}
                />
                <ListBlock
                  heading="Decisions"
                  items={result.decisions}
                  editing={editing}
                  onChange={(i, v) => updateList("decisions", i, v)}
                />

                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
                    Action items
                  </h3>
                  {result.actionItems.length === 0 ? (
                    <p className="text-sm text-muted-foreground">
                      No action items found in these notes.
                    </p>
                  ) : (
                    <div className="space-y-3">
                      {result.actionItems.map((item, i) => (
                        <div
                          key={i}
                          className="rounded-2xl border border-border bg-muted/40 p-4 sm:flex sm:items-start sm:gap-4"
                        >
                          <div className="min-w-0 flex-1 space-y-2">
                            {editing ? (
                              <Textarea
                                value={item.task}
                                className="min-h-16"
                                onChange={(e) => updateAction(i, { task: e.target.value })}
                              />
                            ) : (
                              <p className="text-sm font-medium text-foreground">{item.task}</p>
                            )}
                          </div>
                          <div className="mt-3 grid gap-2 sm:mt-0 sm:w-56">
                            <MetaField
                              label="Owner"
                              value={item.owner}
                              editing={editing}
                              onChange={(v) => updateAction(i, { owner: v })}
                            />
                            <MetaField
                              label="Deadline"
                              value={item.deadline}
                              editing={editing}
                              onChange={(v) => updateAction(i, { deadline: v })}
                            />
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <ResponsibleAINotice />
        </section>
      </div>
    </div>
  );
}

function ListBlock({
  heading,
  items,
  editing,
  onChange,
}: {
  heading: string;
  items: string[];
  editing: boolean;
  onChange: (index: number, value: string) => void;
}) {
  return (
    <div className="space-y-2">
      <h3 className="text-xs font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {heading}
      </h3>
      {items.length === 0 ? (
        <p className="text-sm text-muted-foreground">Not specified in these notes.</p>
      ) : editing ? (
        <div className="space-y-2">
          {items.map((item, i) => (
            <Input key={i} value={item} onChange={(e) => onChange(i, e.target.value)} />
          ))}
        </div>
      ) : (
        <ul className="space-y-2">
          {items.map((item, i) => (
            <li key={i} className="flex gap-2 text-sm leading-relaxed text-foreground/90">
              <span className="mt-2 size-1.5 shrink-0 rounded-full bg-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function MetaField({
  label,
  value,
  editing,
  onChange,
}: {
  label: string;
  value: string;
  editing: boolean;
  onChange: (value: string) => void;
}) {
  return (
    <div className="space-y-1">
      <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted-foreground">
        {label}
      </p>
      {editing ? (
        <Input value={value} onChange={(e) => onChange(e.target.value)} className="h-9" />
      ) : (
        <p className="text-sm text-foreground">{value}</p>
      )}
    </div>
  );
}
