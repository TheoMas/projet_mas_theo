import { User } from '../models/user';

export class LoadUsers {
    static readonly type = '[User] Load Users';
}

export class LoadUsersSuccess {
    static readonly type = '[User] Load Users Success';
    constructor(public users: User[]) {}
}

export class LoadUsersFailure {
    static readonly type = '[User] Load Users Failure';
    constructor(public error: string) {}
}

export class GetUserById {
    static readonly type = '[User] Get User By Id';
    constructor(public id: number) {}
}

export class GetUserByIdSuccess {
    static readonly type = '[User] Get User By Id Success';
    constructor(public user: User) {}
}

export class GetUserByIdFailure {
    static readonly type = '[User] Get User By Id Failure';
    constructor(public error: string) {}
}

export class CreateUser {
    static readonly type = '[User] Create User';
    constructor(public user: Omit<User, 'id'>) {}
}

export class CreateUserSuccess {
    static readonly type = '[User] Create User Success';
    constructor(public user: User) {}
}

export class CreateUserFailure {
    static readonly type = '[User] Create User Failure';
    constructor(public error: string) {}
}

export class UpdateUser {
    static readonly type = '[User] Update User';
    constructor(public id: number, public user: User) {}
}

export class UpdateUserSuccess {
    static readonly type = '[User] Update User Success';
    constructor(public user: User) {}
}

export class UpdateUserFailure {
    static readonly type = '[User] Update User Failure';
    constructor(public error: string) {}
}

export class DeleteUser {
    static readonly type = '[User] Delete User';
    constructor(public id: number) {}
}

export class DeleteUserSuccess {
    static readonly type = '[User] Delete User Success';
    constructor(public id: number) {}
}

export class DeleteUserFailure {
    static readonly type = '[User] Delete User Failure';
    constructor(public error: string) {}
}

export class SelectUser {
    static readonly type = '[User] Select User';
    constructor(public user: User | null) {}
}
