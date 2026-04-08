import Anthropic from '@anthropic-ai/sdk';
import createError from 'http-errors';
import { env } from '../../config/env.js';
import { modulePrompts } from './ai.prompts.js';

const anthropic = new Anthropic({ apiKey: env.anthropicApiKey });

export async function askAssistant(input: { module: string; action: string; context: Record<string, unknown> }) {
  const system = modulePrompts[input.module] ?? modulePrompts.general;
  try {
    const response = await anthropic.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 1200,
      system,
      messages: [
        {
          role: 'user',
          content: `Acción: ${input.action}\nContexto: ${JSON.stringify(input.context)}`,
        },
      ],
    });

    const text = response.content.find((c) => c.type === 'text');
    return text?.text ?? 'Sin respuesta del asistente.';
  } catch {
    throw createError(502, 'No fue posible obtener respuesta del asistente IA');
  }
}
