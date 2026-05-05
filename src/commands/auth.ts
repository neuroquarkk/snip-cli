import { authSchema } from '@schemas';
import { State } from '@state';
import { ApiService, Utils, Storage } from '@utils';

export class AuthCmd {
    public static async register() {
        if (State.isAuthenticated()) {
            console.log('Already logged in');
            return;
        }

        const email = await Utils.getInput('Enter email: ');
        const password = await Utils.getInput('Enter password: ');

        const validation = Utils.verifySchema({ email, password }, authSchema);
        if (!validation.success) {
            console.error('Validation failed:', validation.errors);
            return;
        }

        const { error } = await ApiService.fetch('auth/register', {
            method: 'POST',
            body: validation.data,
        });

        if (error) {
            console.error('Registration failed:', error.message);
            return;
        }

        console.log('Registration successful');
    }

    public static async login() {
        if (State.isAuthenticated()) {
            console.log('Already logged in');
            return;
        }

        const email = await Utils.getInput('Enter email: ');
        const password = await Utils.getInput('Enter password: ');

        const validation = Utils.verifySchema({ email, password }, authSchema);
        if (!validation.success) {
            console.error('Validation failed:', validation.errors);
            return;
        }

        const { data, error } = await ApiService.fetch<{ pat: string }>(
            'auth/cli/login',
            {
                method: 'POST',
                body: validation.data,
            }
        );

        if (error) {
            console.error('Login failed:', error.message);
            return;
        }

        await Storage.saveSession(data.pat);
        State.setPat(data.pat);

        console.log('Login successful');
    }

    public static async verify() {
        const storedPat = await Storage.getSession();

        if (!storedPat) return;

        const { error } = await ApiService.fetch('auth/cli/verify', {
            method: 'POST',
            headers: { Authorization: `Bearer ${storedPat}` },
        });

        if (error) {
            if (error.message === 'Network error') {
                console.log('Server offline');
                return;
            }

            State.clearPat();
            await Storage.clearSession();
            console.log('Session expired. Log in again');
            return;
        }

        State.setPat(storedPat);
    }

    public static async logout() {
        const storedPat = State.getPat();
        if (!storedPat) return;

        const { error } = await ApiService.fetch('auth/cli/logout', {
            method: 'POST',
            headers: { Authorization: `Bearer ${storedPat}` },
        });

        if (error) {
            console.error('Logout failed:', error.message);
            return;
        }

        State.clearPat();
        await Storage.clearSession();
        console.log('Logout successful');
    }
}
