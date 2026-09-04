import { createFileRoute, Link } from "@tanstack/react-router";
import { ArrowRight, Mail, MessageSquare, NotebookPen, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ResponsibleAINotice } from "@/components/ResponsibleAINotice";
import { useAppState } from "@/lib/app-state";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Dashboard | AI Workplace Productivity Assistant" },
      {
        name: "description",
        content:
          "Work smarter. Communicate better. Get more done with AI — generate emails, summarize meetings and ask your workplace assistant.",
      },
      { property: "og:title", content: "AI Workplace Productivity Assistant" },
      {
        property: "og:description",
        content: "Work smarter. Communicate better. Get more done with AI.",
      },
    ],
  }),
  component: Dashboard,
});

const features = [
  {
    to: "/email",
    icon: Mail,
    title: "Smart Email Generator",
    description: "Create polished professional emails with AI.",
  },
  {
    to: "/meetings",
    icon: NotebookPen,
    title: "Meeting Notes Summarizer",
    description:
      "Turn lengthy meeting notes into summaries, decisions, action items and deadlines.",
  },
  {
    to: "/assistant",
    icon: MessageSquare,
    title: "AI Workplace Assistant",
    description:
      "Ask questions, improve workplace communication and get help with everyday tasks.",
  },
] as const;

function Dashboard() {
  const { activity } = useAppState();

  return (
    <div className="space-y-10">
      <section className="surface-card overflow-hidden">
        <div className="relative p-6 sm:p-10">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 size-56 rounded-full bg-primary-soft blur-2xl"
          />
          <div className="relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary-soft px-3 py-1 text-xs font-semibold text-burgundy">
              <Sparkles className="size-3.5" />
              Work smarter. Communicate better. Get more done with AI.
            </span>
            <h1 className="mt-5 font-[family-name:var(--font-display)] text-3xl font-semibold text-foreground sm:text-4xl">
              Good morning! 👋
            </h1>
            <p className="mt-2 text-base font-medium text-foreground/80">
              Your AI-powered workplace assistant
            </p>
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              “Work smarter, communicate better, and turn everyday workplace tasks into productive
              outcomes.”
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/email">
                  Get started <ArrowRight className="size-4" />
                </Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/assistant">Ask the assistant</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section>
        <h2 className="text-lg font-semibold text-foreground">Your AI toolkit</h2>
        <div className="mt-4 grid gap-5 md:grid-cols-3">
          {features.map((f) => (
            <article
              key={f.to}
              className="surface-card group flex flex-col p-6 transition-shadow hover:shadow-[var(--shadow-lift)]"
            >
              <span className="flex size-11 items-center justify-center rounded-xl bg-primary-soft text-burgundy">
                <f.icon className="size-5" />
              </span>
              <h3 className="mt-4 text-base font-semibold text-foreground">{f.title}</h3>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-muted-foreground">
                {f.description}
              </p>
              <Button asChild variant="secondary" className="mt-5 w-full">
                <Link to={f.to}>
                  Get Started
                  <ArrowRight className="size-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </Button>
            </article>
          ))}
        </div>
      </section>

      <section className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
        <div className="surface-card p-6">
          <h2 className="text-base font-semibold text-foreground">This session</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            {activity.length === 0
              ? "No activity yet — generate an email or summarize a meeting to get going."
              : `${activity.length} action${activity.length === 1 ? "" : "s"} performed during this visit.`}
          </p>
          <ul className="mt-4 space-y-3">
            {activity.slice(0, 4).map((item) => (
              <li key={item.id} className="flex items-start justify-between gap-4 text-sm">
                <span className="min-w-0">
                  <span className="block font-medium text-foreground">{item.tool}</span>
                  <span className="block truncate text-muted-foreground">{item.detail}</span>
                </span>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {item.at.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
                </span>
              </li>
            ))}
          </ul>
          <Button asChild variant="ghost" className="mt-4 px-0 text-primary hover:bg-transparent">
            <Link to="/activity">View recent activity</Link>
          </Button>
        </div>
        <ResponsibleAINotice />
      </section>
    </div>
  );
}
