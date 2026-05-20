import { audit } from '../commands/audit.js';

describe('audit()', () => {
  it('tüm workflow\'lar geçerliyse exit 0 döner', async () => {
    const code = await audit();
    expect(code).toBe(0);
  });

  it('belirli workflow adıyla filtreleme çalışır', async () => {
    const code = await audit('ai-chat');
    expect(code).toBe(0);
  });

  it('var olmayan workflow için hata fırlatır', async () => {
    await expect(audit('nonexistent-workflow-xyz')).rejects.toThrow();
  });
});
