type ParseResult =
    | { success: true; data: Record<string, string> }
    | { success: false; message: string };

export class ArgParser {
    public static parse(args: string[]): ParseResult {
        const data: Record<string, string> = {};

        for (const arg of args) {
            const sepIdx = arg.indexOf('=');
            if (sepIdx === -1)
                return {
                    success: false,
                    message: `Invalid argument format: "${arg}"`,
                };

            const key = arg.slice(0, sepIdx).trim();
            const value = arg.slice(sepIdx + 1).trim();

            if (!key)
                return {
                    success: false,
                    message: `Argument key cannot be empty`,
                };
            if (!value)
                return {
                    success: false,
                    message: `Argument value cannot be empty`,
                };

            data[key] = value;
        }

        return { success: true, data };
    }
}
