# AI Workplace Companion

Build: AI Workplace Productivity Assistant

Build a modern, responsive SaaS-style web application called AI Workplace Productivity Assistant.

Tagline:
Work smarter. Communicate better. Get more done with AI.

The application is a frontend-only AI productivity tool for professionals.

Core Requirements

No registration or sign-in

No user accounts

No backend

No database

Users should access the application immediately without authentication.

AI responses must be generated dynamically by an AI model, not hardcoded, predefined, or generic demo responses.

Keep the architecture simple and suitable for a frontend-only application.

Design

Create a clean, modern and professional SaaS dashboard.

The primary brand color must be dusty pink, combined with:

White / warm off-white backgrounds

Dark charcoal text

Soft grey secondary text

Deep rose or muted burgundy accents

The design should feel professional and corporate rather than overly decorative.

Use:

Modern typography

Rounded cards

Subtle shadows

Clean icons

Spacious layouts

Clear buttons

Smooth hover and loading states

Navigation

Create a responsive left sidebar containing:

Dashboard

Smart Email Generator

Meeting Notes Summarizer

AI Workplace Assistant

Recent Activity

Settings

Responsible AI

On mobile, use a collapsible navigation menu.

Dashboard

Create a welcoming homepage with:

Good morning! 👋

Your AI-powered workplace assistant

"Work smarter, communicate better, and turn everyday workplace tasks into productive outcomes."

Show three main feature cards:

Smart Email Generator

"Create polished professional emails with AI."

Meeting Notes Summarizer

"Turn lengthy meeting notes into summaries, decisions, action items and deadlines."

AI Workplace Assistant

"Ask questions, improve workplace communication and get help with everyday tasks."

Include clear Get Started buttons.

Smart Email Generator

Create a structured form containing:

Email purpose

Recipient

Key points

Tone: Formal, Friendly, Persuasive

Additional instructions

Button:

Generate Email

The AI must dynamically generate a professional email based on the user's actual inputs.

Display:

Subject

Greeting

Email body

Closing

The output must be fully editable.

Actions:

Copy

Regenerate

Edit

Clear

Meeting Notes Summarizer

Provide a large text area for users to paste meeting notes.

Include:

Meeting title

Meeting notes

Button:

Summarize Meeting

The AI must dynamically analyze the actual notes and extract:

Summary

Key discussion points

Decisions

Action items

Owners

Deadlines

Display action items in a clean table or card layout.

The AI output must be editable.

Actions:

Copy

Regenerate

Edit

Clear

AI Workplace Assistant

Create a modern AI chatbot interface.

Opening message:

"Hi! I'm your AI Workplace Assistant. How can I help you today?"

Include suggested prompts such as:

Help me write a professional email.

Improve the tone of this message.

Summarize these meeting notes.

Help me prepare for a meeting.

Create a project update.

Brainstorm ideas for a presentation.

Users must be able to enter their own prompts.

The AI must provide real, dynamically generated responses based on the user's prompt.

Do not use canned or generic responses.

Include:

Chat history during the current session

Message input

Send button

Clear conversation

Loading state

AI Prompt Structure

Use structured AI instructions for each tool.

The Email Generator should consider the user's purpose, recipient, key points, tone and additional instructions.

The Meeting Summarizer should analyze the actual meeting notes and identify summaries, decisions, action items, owners and deadlines.

The Workplace Assistant should understand the user's actual question and provide relevant, professional workplace assistance.

Editable Outputs

All AI-generated content must be editable.

Users should be able to:

Edit

Copy

Regenerate

Clear

Recent Activity

Include a simple current-session Recent Activity section showing actions performed during the current visit.

Do not persist activity to a database.

Settings

Include simple local interface preferences such as:

Default email tone

Response length

Professional writing style

No account system or backend is required.

Responsible AI

Include this disclaimer near AI-generated content:

Responsible AI

"AI-generated content may contain inaccuracies or omissions. Always review and verify AI-generated information before using it for important workplace decisions or communications. Do not enter confidential, sensitive, or personal information."

Responsive Design

The application must work beautifully on:

Desktop

Tablet

Mobile

Use single-column layouts on smaller screens and ensure there is no horizontal scrolling.

Important Technical/Functional Requirement

The application must connect the three core features to a real AI generation capability so that responses are generated dynamically from user input.

Do not substitute hardcoded examples, canned responses, placeholder text, or generic simulated AI responses for the actual AI functionality.

If an API key or AI provider is required, structure the application so the AI integration can be connected securely without creating a traditional backend or authentication system.

The finished product should look and feel like a polished professional AI SaaS application suitable for a portfolio or job demonstration.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/336fce6a-0895-41eb-9258-87b7a6b90582).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
