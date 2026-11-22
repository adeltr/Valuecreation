import { describe, it, expect, vi } from 'vitest';
import { makeCallModel, COPILOT_MODEL, hasAnthropicCredentials } from './anthropic';

const reply = (over: object) => ({ stop_reason: 'end_turn', content: [{ type: 'thinking', thinking: '' }, { type: 'text', text: '{"levers":[]}' }], ...over });
const fake = (message: object) => {
  const stream = vi.fn((_params: Record<string, unknown>) => ({ finalMessage: async () => message }));
  return { client: { beta: { messages: { stream } } }, stream };
};

describe('copilot model call', () => {
  it('sends the system prompt (cached) and the question, and returns the text of the answer', async () => {
    const { client, stream } = fake(reply({}));
    expect(await makeCallModel(client as never)('SYSTEM', 'QUESTION')).toBe('{"levers":[]}');
    const params = stream.mock.calls[0][0];
    expect(params).toMatchObject({
      model: COPILOT_MODEL, output_config: { effort: 'high' },
      system: [{ type: 'text', text: 'SYSTEM', cache_control: { type: 'ephemeral' } }],
      messages: [{ role: 'user', content: 'QUESTION' }],
    });
    expect(COPILOT_MODEL).toBe('claude-opus-5-5');
  });

  it('a refusal or a truncated answer is an explicit error, never a partial proposal', async () => {
    await expect(makeCallModel(fake(reply({ stop_reason: 'refusal', stop_details: { category: 'cyber' } })).client as never)('s', 'u')).rejects.toThrow(/refus/i);
    await expect(makeCallModel(fake(reply({ stop_reason: 'max_tokens' })).client as never)('s', 'u')).rejects.toThrow(/tronquée/);
    await expect(makeCallModel(fake(reply({ content: [] })).client as never)('s', 'u')).rejects.toThrow(/vide/);
  });

  it('knows whether the server holds credentials', () => {
    expect(hasAnthropicCredentials({})).toBe(false);
    expect(hasAnthropicCredentials({ ANTHROPIC_API_KEY: 'x' })).toBe(true);
    expect(hasAnthropicCredentials({ ANTHROPIC_AUTH_TOKEN: 'x' })).toBe(true);
  });
});
