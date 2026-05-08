import { createInterface } from 'readline/promises';
import { stdin as input, stdout as output } from 'process';
import type { ZodType } from 'zod';
import password from '@inquirer/password';

export class Utils {
    public static async getInput(msg: string = ''): Promise<string> {
        const rl = createInterface({ input, output });
        const answer = await rl.question(msg);
        rl.close();
        return answer;
    }

    public static async getPasswordInput(): Promise<string> {
        const answer = await password({
            message: 'Enter password:',
            mask: true,
            theme: {
                prefix: '',
            },
        });
        return answer;
    }

    public static getMultilineInput(
        msg: string = '',
        terminator: string = 'EOF'
    ): Promise<string> {
        console.log(
            `${msg} (Type ${terminator} on an empty line and press enter)`
        );

        const rl = createInterface({ input, output, prompt: '> ' });

        rl.prompt();
        const lines: string[] = [];

        return new Promise((resolve) => {
            rl.on('line', (line) => {
                if (line.trim() === terminator) {
                    rl.close();
                } else {
                    lines.push(line);
                    rl.prompt();
                }
            });

            rl.on('close', () => {
                resolve(lines.join('\n'));
            });
        });
    }

    public static verifySchema<T>(data: Record<any, any>, schema: ZodType<T>) {
        const result = schema.safeParse(data);
        if (!result.success) {
            const errors = result.error.issues
                .map((issue) => {
                    const path = issue.path.join('.');
                    return path ? `${path}: ${issue.message}` : issue.message;
                })
                .join('\n');

            return { success: false, errors };
        }
        return { success: true, data: result.data as T };
    }
}
