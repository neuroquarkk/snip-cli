import { aliasSchema, createSnippet, updateSnippet } from '@schemas';
import { State } from '@state';
import { ApiService, Utils } from '@utils';

type Snippet = {
    title: string;
    alias: string;
};

export class SnippetCmd {
    public static async create() {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        const title = await Utils.getInput('Enter title: ');
        const alias = await Utils.getInput('Enter alias: ');
        const content = await Utils.getMultilineInput('Enter content: ');

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

    public static async getByAlias() {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        const alias = await Utils.getInput('Enter alias: ');

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

    public static async getAll(
        options: { page: number; limit: number } = { page: 1, limit: 10 }
    ) {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        let query: string = `page=${options.page}&limit=${options.limit}`;

        const search = await Utils.getInput(
            'Enter search keyword (optional): '
        );

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
            console.error('Falied to fetch snippets:', error.message);
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

    public static async delete() {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        const alias = await Utils.getInput('Enter alias: ');

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
            console.error('Falied to delete snippet:', error.message);
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
        const newContent = await Utils.getMultilineInput(
            'Enter new content (optional): '
        );
        const newAlias = await Utils.getInput('Enter new alias (optional): ');

        const data: any = {};

        if (newTitle) data.title = newTitle;
        if (newContent) data.content = newContent;
        if (newAlias) data.alias = newAlias;

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
