export function normalizeInviteCode(code: string): string {
  return code.replace(/[\s-]/g, '').toUpperCase();
}

export function isValidInviteCode(code: string): boolean {
  return /^[A-Z0-9]{6}$/.test(normalizeInviteCode(code));
}
