import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { callGateway, styleGuidance, type GatewayMessage } from "./ai.server";

const prefs = z.object({
  responseLength: z.enum(["short", "medium", "long"]).optional(),
  writingStyle: z.string().max(200).optional(),
});

const EmailInput = z.object({
  purpose: z.string().min(1).max(2000),
  recipient: z.string().max(300).optional().default(""),
  keyPoints: z.string().max(4000).optional().default(""),
  tone: z.enum(["Formal", "Friendly", "Persuasive"]),
  instructions: z.string().max(2000).optional().default(""),
  prefs: prefs.optional(),
});

export const generateEmail = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => EmailInput.parse(input))
  .handler(async ({ data }) => {
    const messages: GatewayMessage[] = [
      {
        role: "system",
        content: [
          "You are an expert workplace communication writer.",
          "Write a polished professional email based strictly on the user's inputs.",
          "Return the email in exactly this plain-text format, with no markdown fences and no commentary:",
          "Subject: <subject line>",
          "",
          "<greeting line>",
          "",
          "<email body, 1-4 short paragraphs>",
          "",
          "<closing, including a sign-off line>",
          styleGuidance({
            responseLength: data.prefs?.responseLength,
            writingStyle: data.prefs?.writingStyle,
          }),
        ].join("\n"),
      },
      {
        role: "user",
        content: [
          `Purpose: ${data.purpose}`,
          `Recipient: ${data.recipient || "not specified"}`,
          `Key points: ${data.keyPoints || "none provided"}`,
          `Tone: ${data.tone}`,
          `Additional instructions: ${data.instructions || "none"}`,
        ].join("\n"),
      },
    ];
    return { text: await callGateway(messages) };
  });

const MeetingInput = z.object({
  title: z.string().max(300).optional().default(""),
  notes: z.string().min(1).max(20000),
  prefs: prefs.optional(),
});

export const summarizeMeeting = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => MeetingInput.parse(input))
  .handler(async ({ data }) => {
    const messages: GatewayMessage[] = [
      {
        role: "system",
        content: [
          "You analyze real meeting notes and extract structured outcomes.",
          "Only use information present in the notes. If something is not stated, say 'Not specified'.",
          "Respond with a single JSON object and nothing else (no markdown fences):",
          '{"summary": string, "keyPoints": string[], "decisions": string[], "actionItems": [{"task": string, "owner": string, "deadline": string}]}',
          styleGuidance({
            responseLength: data.prefs?.responseLength,
            writingStyle: data.prefs?.writingStyle,
          }),
        ].join("\n"),
      },
      {
        role: "user",
        content: `Meeting title: ${data.title || "Untitled meeting"}\n\nMeeting notes:\n${data.notes}`,
      },
    ];

    const raw = await callGateway(messages);
    const cleaned = raw
      .replace(/^```(?:json)?/i, "")
      .replace(/```$/, "")
      .trim();

    const shape = z.object({
      summary: z.string().default(""),
      keyPoints: z.array(z.string()).default([]),
      decisions: z.array(z.string()).default([]),
      actionItems: z
        .array(
          z.object({
            task: z.string().default(""),
            owner: z.string().default("Not specified"),
            deadline: z.string().default("Not specified"),
          }),
        )
        .default([]),
    });

    try {
      const start = cleaned.indexOf("{");
      const end = cleaned.lastIndexOf("}");
      const json = JSON.parse(cleaned.slice(start, end + 1)) as unknown;
      return shape.parse(json);
    } catch {
      return shape.parse({ summary: cleaned });
    }
  });

const ChatInput = z.object({
  messages: z
    .array(
      z.object({
        role: z.enum(["user", "assistant"]),
        content: z.string().min(1).max(8000),
      }),
    )
    .min(1)
    .max(50),
  prefs: prefs.optional(),
});

export const chatAssistant = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => ChatInput.parse(input))
  .handler(async ({ data }) => {
    const messages: GatewayMessage[] = [
      {
        role: "system",
        content: [
          "You are the AI Workplace Assistant: a professional, pragmatic colleague who helps with workplace communication, writing, planning, summarizing and everyday work tasks.",
          "Answer the user's actual question directly and usefully. Use clean markdown with short paragraphs and lists where helpful.",
          "Never mention that you are a demo and never invent confidential company data.",
          styleGuidance({
            responseLength: data.prefs?.responseLength,
            writingStyle: data.prefs?.writingStyle,
          }),
        ].join("\n"),
      },
      ...data.messages,
    ];
    return { text: await callGateway(messages) };
  });
