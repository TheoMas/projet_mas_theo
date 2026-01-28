import { User } from './user';

export interface UserStateModel {
    users: User[];
    selectedUser: User | null;
    loading: boolean;
    error: string | null;
}
