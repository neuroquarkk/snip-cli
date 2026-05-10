import { readFile } from 'fs/promises';
import { AuthCmd, SnippetCmd } from '@commands';
import { ApiService } from '@utils';
import { State } from '@state';

async function handleTouch(filename: string) {
    try {
        const fileData = await readFile(filename, 'utf-8');
        const content = fileData.trim();
        await SnippetCmd.create(content);
    } catch (error: any) {
        if (error.code === 'ENOENT') {
            console.error('File not found');
            return;
        }
        throw error;
    }
}

async function handleView(alias: string) {
    const { data, error } = await ApiService.fetch<{ content: string }>(
        `snippets/${alias}`,
        {
            headers: { Authorization: `Bearer: ${State.getPat()}` },
        }
    );

    if (error) {
        console.error('Failed to fetch snippets:', error.message);
        return;
    }

    console.log(data.content);
}

export async function handleArg(args: string[]) {
    await AuthCmd.verify();
    const cmd = args[0]?.trim().toLowerCase();

    if (cmd === 'touch') {
        const filename = args[1];
        if (!filename) {
            console.error('Filename required');
            return;
        }
        await handleTouch(filename);
    } else if (cmd === 'view') {
        const alias = args[1];
        if (!alias) {
            console.error('Alias required');
            return;
        }
        await handleView(alias);
    } else {
        console.error(`Invalid argument: "${args[0]}"`);
    }
}
