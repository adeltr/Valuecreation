import Anthropic from '@anthropic-ai/sdk';

/** Model of the copilot. Change it here only on an explicit decision (docs/07). */
export const COPILOT_MODEL = 'claude-opus-5-5';

export function hasAnthropicCredentials(env: Record<string, string | undefined>): boolean {
  return Boolean(env.ANTHROPIC_API_KEY || env.ANTHROPIC_AUTH_TOKEN);
}

/**
 * The real model call behind /api/propose. The key stays on the server (the SDK reads it from the
 * environment). The answer is text that handleProposal parses and sanitizes: nothing the model
 * says reaches the cockpit without passing the ontology and the analyst gate.
 */
export function makeCallModel(client: Anthropic = new Anthropic()) {
  return async (system: string, user: string): Promise<string> => {
    const message = await client.beta.messages.stream({
      model: COPILOT_MODEL,
      max_tokens: 16000,
      // Thinking is always on for this model; effort is its only control (default would be medium).
      output_config: { effort: 'high' },
      // A safety refusal is retried server-side on a fallback model instead of failing the request.
      betas: ['server-side-fallback-2026-07-01'],
      fallbacks: 'default',
      // The system prompt (vocabulary + catalog of the company type) is stable: cache it.
      system: [{ type: 'text', text: system, cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: user }],
    }).finalMessage();

    if (message.stop_reason === 'refusal') {
      throw new Error(`Le modèle a refusé de répondre${message.stop_details?.category ? ` (${message.stop_details.category})` : ''}`);
    }
    if (message.stop_reason === 'max_tokens') throw new Error('Réponse du modèle tronquée : reformulez une question plus ciblée');
    const text = message.content.flatMap((b) => (b.type === 'text' ? [b.text] : [])).join('').trim();
    if (!text) throw new Error('Réponse du modèle vide');
    return text;
  };
}
