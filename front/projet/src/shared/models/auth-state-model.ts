import { User } from './user';

export interface AuthStateModel {
    isAuthenticated: boolean;
    currentUser: User | null;
    token: string | null;
    loading: boolean;
    error: string | null;
}