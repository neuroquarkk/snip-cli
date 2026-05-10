import { aliasSchema, createSnippet, updateSnippet } from '@schemas';
import { State } from '@state';
import { ApiService, Utils, ArgParser } from '@utils';

type Snippet = {
    title: string;
    alias: string;
};

export class SnippetCmd {
    public static async create(content?: string) {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        const title = await Utils.getInput('Enter title: ');
        const alias = await Utils.getInput('Enter alias: ');

        if (!content) {
            content = await Utils.getMultilineInput('Enter content: ');
        }

        const validation = Utils.verifySchema(
            { title, alias, content },
            createSnippet
        );

        if (!validation.success) {
            console.error('Validation failed:', validation.errors);
            return;
        }

        const { error } = await ApiService.fetch('snippets/', {
            method: 'POST',
            body: validation.data,
            headers: { Authorization: `Bearer ${State.getPat()}` },
        });

        if (error) {
            console.error('Snippet creation failed:', error.message);
            return;
        }

        console.log('Snippet created successfully');
    }

    public static async getByAlias(args: string[]) {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        let alias: string | undefined;

        if (args.length > 0) {
            const parsed = ArgParser.parse(args);
            if (!parsed.success) {
                console.error(parsed.message);
                return;
            }

            alias = parsed.data['alias'];
        } else {
            alias = await Utils.getInput('Enter alias: ');
        }

        const validation = Utils.verifySchema({ alias }, aliasSchema);
        if (!validation.success) {
            console.error('Validation failed:', validation.errors);
            return;
        }

        const { data, error } = await ApiService.fetch<{ content: string }>(
            `snippets/${alias}`,
            {
                headers: { Authorization: `Bearer ${State.getPat()}` },
            }
        );

        if (error) {
            console.error('Failed to fetch snippet:', error.message);
            return;
        }

        console.log(data.content);
    }

    public static async getAll(args: string[] = []) {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        let page = 1;
        let limit = 10;
        let search: string | undefined;

        if (args.length > 0) {
            const parsed = ArgParser.parse(args);
            if (!parsed.success) {
                console.error(parsed.message);
                return;
            }

            if (parsed.data['page']) {
                const p = Number(parsed.data['page']);
                if (isNaN(p) || p < 1) {
                    console.error('page must be positive number');
                    return;
                }
                page = p;
            }

            if (parsed.data['limit']) {
                const l = Number(parsed.data['limit']);
                if (isNaN(l) || l < 1) {
                    console.error('limit must be positive number');
                    return;
                }
                limit = l;
            }

            search = parsed.data['search'];
        } else {
            search = await Utils.getInput('Enter search keyword (optional): ');
        }

        let query: string = `page=${page}&limit=${limit}`;
        if (search) {
            query += `&search=${search}`;
        }

        const { data, error } = await ApiService.fetch<{ snippets: Snippet[] }>(
            `snippets?${query}`,
            {
                headers: { Authorization: `Bearer ${State.getPat()}` },
            }
        );

        if (error) {
            console.error('Failed to fetch snippets:', error.message);
            return;
        }

        if (data.snippets.length === 0) {
            console.log('No snippet found');
            return;
        }

        data.snippets.forEach((row, idx) => {
            const num = String(idx + 1).padStart(2, ' ');
            console.log(`${num}. ${row.title.padEnd(30)} ${row.alias}`);
        });
    }

    public static async delete(args: string[]) {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        let alias: string | undefined;

        if (args.length > 0) {
            const parsed = ArgParser.parse(args);
            if (!parsed.success) {
                console.error(parsed.message);
                return;
            }

            alias = parsed.data['alias'];
        } else {
            alias = await Utils.getInput('Enter alias: ');
        }

        const validation = Utils.verifySchema({ alias }, aliasSchema);
        if (!validation.success) {
            console.error('Validation failed:', validation.errors);
            return;
        }

        const { error } = await ApiService.fetch(`snippets/${alias}`, {
            method: 'DELETE',
            headers: { Authorization: `Bearer ${State.getPat()}` },
        });

        if (error) {
            console.error('Failed to delete snippet:', error.message);
            return;
        }

        console.log('Snippet deleted successfully');
    }

    public static async update() {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        const alias = await Utils.getInput('Enter alias to update: ');
        const aliasValidation = Utils.verifySchema({ alias }, aliasSchema);
        if (!aliasValidation.success) {
            console.error('Validation failed:', aliasValidation.errors);
            return;
        }

        const newTitle = await Utils.getInput('Enter new title (optional): ');
        const newAlias = await Utils.getInput('Enter new alias (optional): ');

        let newContent: string | undefined;

        const editContent = await Utils.getInput('Update content? (y/n): ');
        if (editContent.trim().toLowerCase() === 'y') {
            newContent = await Utils.getMultilineInput(
                'Enter new content (optional): '
            );
        }

        const data: Record<string, string> = {};
        if (newTitle) data['title'] = newTitle;
        if (newContent) data['content'] = newContent;
        if (newAlias) data['alias'] = newAlias;

        if (Object.keys(data).length === 0) {
            console.log('No content to update');
            return;
        }

        const validation = Utils.verifySchema(data, updateSnippet);
        if (!validation.success) {
            console.error('Validation failed:', validation.errors);
            return;
        }

        const { error } = await ApiService.fetch(`snippets/${alias}`, {
            body: validation.data,
            method: 'PATCH',
            headers: { Authorization: `Bearer ${State.getPat()}` },
        });

        if (error) {
            console.error('Failed to update snippet:', error.message);
            return;
        }

        console.log('Snippet updated successfully');
    }
}
