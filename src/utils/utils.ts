import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import type { ZodType } from 'zod';

export class Utils {
    public static async getInput(msg: string = ''): Promise<string> {
        const rl = createInterface({ input, output });
        const answer = await rl.question(msg);
        rl.close();
        return answer;
    }

    public static verifySchema<T>(data: Record<any, any>, schema: ZodType<T>) {
        const result = schema.safeParse(data);
        if (!result.success) {
            const errors = result.error.message;
            return { success: false, errors };
        }
        return { success: true, data: result.data as T };
    }
}
