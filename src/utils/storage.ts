import { CONSTANTS } from '@constants';
import { exists, readFile, unlink, writeFile } from 'fs/promises';

export class Storage {
    public static async saveSession(pat: string): Promise<void> {
        await writeFile(CONSTANTS.CRED_FILE, pat, { mode: 0o600 });
    }

    public static async getSession(): Promise<string | null> {
        const credExists = await exists(CONSTANTS.CRED_FILE);
        if (!credExists) return null;

        try {
            const pat = await readFile(CONSTANTS.CRED_FILE, 'utf-8');
            return pat;
        } catch {
            return null;
        }
    }

    public static async clearSession(): Promise<void> {
        const credExists = await exists(CONSTANTS.CRED_FILE);
        if (credExists) {
            await unlink(CONSTANTS.CRED_FILE);
        }
    }
}
