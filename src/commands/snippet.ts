import { aliasSchema, createSnippet } from '@schemas';
import { State } from '@state';
import { ApiService, Utils } from '@utils';

export class SnippetCmd {
    public static async create() {
        if (!State.isAuthenticated()) {
            console.error('You are not authenticated');
            return;
        }

        const title = await Utils.getInput('Enter title: ');
        const alias = await Utils.getInput('Enter alias: ');
        const content = await Utils.getInput('Enter content: ');

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
}
