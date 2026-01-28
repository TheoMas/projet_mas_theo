import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { UserStateModel } from '../models/user-state-model';
import {
    LoadUsers,
    LoadUsersSuccess,
    LoadUsersFailure,
    GetUserById,
    GetUserByIdSuccess,
    GetUserByIdFailure,
    CreateUser,
    CreateUserSuccess,
    CreateUserFailure,
    UpdateUser,
    UpdateUserSuccess,
    UpdateUserFailure,
    DeleteUser,
    DeleteUserSuccess,
    DeleteUserFailure,
    SelectUser
} from '../actions/user-actions';
import { UserService } from '../../services/user.service';

@State<UserStateModel>({
    name: 'userState',
    defaults: {
        users: [],
        selectedUser: null,
        loading: false,
        error: null
    }
})
@Injectable()
export class UserState {
    constructor(private userService: UserService) {}

    @Selector()
    static users(state: UserStateModel) {
        return state.users;
    }

    @Selector()
    static selectedUser(state: UserStateModel) {
        return state.selectedUser;
    }

    @Selector()
    static loading(state: UserStateModel) {
        return state.loading;
    }

    @Selector()
    static error(state: UserStateModel) {
        return state.error;
    }

    @Action(LoadUsers)
    loadUsers(ctx: StateContext<UserStateModel>) {
        ctx.patchState({ loading: true, error: null });
        
        return this.userService.getUsers().pipe(
            tap(users => {
                ctx.dispatch(new LoadUsersSuccess(users));
            }),
            catchError(error => {
                ctx.dispatch(new LoadUsersFailure(error.message || 'Erreur lors du chargement des utilisateurs'));
                return of(null);
            })
        );
    }

    @Action(LoadUsersSuccess)
    loadUsersSuccess(ctx: StateContext<UserStateModel>, { users }: LoadUsersSuccess) {
        ctx.patchState({
            users,
            loading: false,
            error: null
        });
    }

    @Action(LoadUsersFailure)
    loadUsersFailure(ctx: StateContext<UserStateModel>, { error }: LoadUsersFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(GetUserById)
    getUserById(ctx: StateContext<UserStateModel>, { id }: GetUserById) {
        ctx.patchState({ loading: true, error: null });
        
        return this.userService.getUserById(id).pipe(
            tap(user => {
                ctx.dispatch(new GetUserByIdSuccess(user));
            }),
            catchError(error => {
                ctx.dispatch(new GetUserByIdFailure(error.message || 'Erreur lors de la récupération de l\'utilisateur'));
                return of(null);
            })
        );
    }

    @Action(GetUserByIdSuccess)
    getUserByIdSuccess(ctx: StateContext<UserStateModel>, { user }: GetUserByIdSuccess) {
        ctx.patchState({
            selectedUser: user,
            loading: false,
            error: null
        });
    }

    @Action(GetUserByIdFailure)
    getUserByIdFailure(ctx: StateContext<UserStateModel>, { error }: GetUserByIdFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(CreateUser)
    createUser(ctx: StateContext<UserStateModel>, { user }: CreateUser) {
        ctx.patchState({ loading: true, error: null });
        
        return this.userService.createUser(user).pipe(
            tap(createdUser => {
                ctx.dispatch(new CreateUserSuccess(createdUser));
            }),
            catchError(error => {
                ctx.dispatch(new CreateUserFailure(error.message || 'Erreur lors de la création de l\'utilisateur'));
                return of(null);
            })
        );
    }

    @Action(CreateUserSuccess)
    createUserSuccess(ctx: StateContext<UserStateModel>, { user }: CreateUserSuccess) {
        const state = ctx.getState();
        ctx.patchState({
            users: [...state.users, user],
            loading: false,
            error: null
        });
    }

    @Action(CreateUserFailure)
    createUserFailure(ctx: StateContext<UserStateModel>, { error }: CreateUserFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(UpdateUser)
    updateUser(ctx: StateContext<UserStateModel>, { id, user }: UpdateUser) {
        ctx.patchState({ loading: true, error: null });
        
        return this.userService.updateUser(id, user).pipe(
            tap(updatedUser => {
                ctx.dispatch(new UpdateUserSuccess(updatedUser));
            }),
            catchError(error => {
                ctx.dispatch(new UpdateUserFailure(error.message || 'Erreur lors de la mise à jour de l\'utilisateur'));
                return of(null);
            })
        );
    }

    @Action(UpdateUserSuccess)
    updateUserSuccess(ctx: StateContext<UserStateModel>, { user }: UpdateUserSuccess) {
        const state = ctx.getState();
        const users = state.users.map(u => u.id === user.id ? user : u);
        ctx.patchState({
            users,
            loading: false,
            error: null
        });
    }

    @Action(UpdateUserFailure)
    updateUserFailure(ctx: StateContext<UserStateModel>, { error }: UpdateUserFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(DeleteUser)
    deleteUser(ctx: StateContext<UserStateModel>, { id }: DeleteUser) {
        ctx.patchState({ loading: true, error: null });
        
        return this.userService.deleteUser(id).pipe(
            tap(() => {
                ctx.dispatch(new DeleteUserSuccess(id));
            }),
            catchError(error => {
                ctx.dispatch(new DeleteUserFailure(error.message || 'Erreur lors de la suppression de l\'utilisateur'));
                return of(null);
            })
        );
    }

    @Action(DeleteUserSuccess)
    deleteUserSuccess(ctx: StateContext<UserStateModel>, { id }: DeleteUserSuccess) {
        const state = ctx.getState();
        const users = state.users.filter(u => u.id !== id);
        ctx.patchState({
            users,
            loading: false,
            error: null
        });
    }

    @Action(DeleteUserFailure)
    deleteUserFailure(ctx: StateContext<UserStateModel>, { error }: DeleteUserFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(SelectUser)
    selectUser(ctx: StateContext<UserStateModel>, { user }: SelectUser) {
        ctx.patchState({
            selectedUser: user
        });
    }
}
