import { Injectable } from '@angular/core';
import { State, Action, StateContext, Selector } from '@ngxs/store';
import { tap, catchError } from 'rxjs/operators';
import { of } from 'rxjs';
import { PollutionStateModel } from '../models/pollution-state-model';
import {
    LoadPollutions,
    LoadPollutionsSuccess,
    LoadPollutionsFailure,
    GetPollutionById,
    GetPollutionByIdSuccess,
    GetPollutionByIdFailure,
    CreatePollution,
    CreatePollutionSuccess,
    CreatePollutionFailure,
    UpdatePollution,
    UpdatePollutionSuccess,
    UpdatePollutionFailure,
    DeletePollution,
    DeletePollutionSuccess,
    DeletePollutionFailure,
    SelectPollution,
    LoadFavorites,
    LoadFavoritesSuccess,
    LoadFavoritesFailure,
    AddFavorite,
    AddFavoriteSuccess,
    AddFavoriteFailure,
    RemoveFavorite,
    RemoveFavoriteSuccess,
    RemoveFavoriteFailure
} from '../actions/pollution-actions';
import { PollutionService } from '../../services/pollution.service';
import { FavoritesService } from '../../services/favorites.service';

@State<PollutionStateModel>({
    name: 'pollutionState',
    defaults: {
        pollutions: [],
        selectedPollution: null,
        loading: false,
        error: null,
        favoriteIds: []
    }
})
@Injectable()
export class PollutionState {
    constructor(
        private pollutionService: PollutionService,
        private favoritesService: FavoritesService
    ) {}

    @Selector()
    static pollutions(state: PollutionStateModel) {
        return state.pollutions;
    }

    @Selector()
    static selectedPollution(state: PollutionStateModel) {
        return state.selectedPollution;
    }

    @Selector()
    static loading(state: PollutionStateModel) {
        return state.loading;
    }

    @Selector()
    static error(state: PollutionStateModel) {
        return state.error;
    }

    @Selector()
    static favoriteIds(state: PollutionStateModel) {
        return state.favoriteIds;
    }

    @Action(LoadPollutions)
    loadPollutions(ctx: StateContext<PollutionStateModel>) {
        ctx.patchState({ loading: true, error: null });
        
        return this.pollutionService.getPollutions().pipe(
            tap(pollutions => {
                ctx.dispatch(new LoadPollutionsSuccess(pollutions));
            }),
            catchError(error => {
                ctx.dispatch(new LoadPollutionsFailure(error.message || 'Erreur lors du chargement des pollutions'));
                return of(null);
            })
        );
    }

    @Action(LoadPollutionsSuccess)
    loadPollutionsSuccess(ctx: StateContext<PollutionStateModel>, { pollutions }: LoadPollutionsSuccess) {
        ctx.patchState({
            pollutions,
            loading: false,
            error: null
        });
    }

    @Action(LoadPollutionsFailure)
    loadPollutionsFailure(ctx: StateContext<PollutionStateModel>, { error }: LoadPollutionsFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(GetPollutionById)
    getPollutionById(ctx: StateContext<PollutionStateModel>, { id }: GetPollutionById) {
        ctx.patchState({ loading: true, error: null });
        
        return this.pollutionService.getPollutionById(id).pipe(
            tap(pollution => {
                ctx.dispatch(new GetPollutionByIdSuccess(pollution));
            }),
            catchError(error => {
                ctx.dispatch(new GetPollutionByIdFailure(error.message || 'Erreur lors de la récupération de la pollution'));
                return of(null);
            })
        );
    }

    @Action(GetPollutionByIdSuccess)
    getPollutionByIdSuccess(ctx: StateContext<PollutionStateModel>, { pollution }: GetPollutionByIdSuccess) {
        ctx.patchState({
            selectedPollution: pollution,
            loading: false,
            error: null
        });
    }

    @Action(GetPollutionByIdFailure)
    getPollutionByIdFailure(ctx: StateContext<PollutionStateModel>, { error }: GetPollutionByIdFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(CreatePollution)
    createPollution(ctx: StateContext<PollutionStateModel>, { pollution }: CreatePollution) {
        ctx.patchState({ loading: true, error: null });
        
        return this.pollutionService.createPollution(pollution).pipe(
            tap(createdPollution => {
                ctx.dispatch(new CreatePollutionSuccess(createdPollution));
            }),
            catchError(error => {
                ctx.dispatch(new CreatePollutionFailure(error.message || 'Erreur lors de la création de la pollution'));
                return of(null);
            })
        );
    }

    @Action(CreatePollutionSuccess)
    createPollutionSuccess(ctx: StateContext<PollutionStateModel>, { pollution }: CreatePollutionSuccess) {
        const state = ctx.getState();
        ctx.patchState({
            pollutions: [...state.pollutions, pollution],
            loading: false,
            error: null
        });
    }

    @Action(CreatePollutionFailure)
    createPollutionFailure(ctx: StateContext<PollutionStateModel>, { error }: CreatePollutionFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(UpdatePollution)
    updatePollution(ctx: StateContext<PollutionStateModel>, { id, pollution }: UpdatePollution) {
        ctx.patchState({ loading: true, error: null });
        
        return this.pollutionService.updatePollution(id, pollution).pipe(
            tap(updatedPollution => {
                ctx.dispatch(new UpdatePollutionSuccess(updatedPollution));
            }),
            catchError(error => {
                ctx.dispatch(new UpdatePollutionFailure(error.message || 'Erreur lors de la mise à jour de la pollution'));
                return of(null);
            })
        );
    }

    @Action(UpdatePollutionSuccess)
    updatePollutionSuccess(ctx: StateContext<PollutionStateModel>, { pollution }: UpdatePollutionSuccess) {
        const state = ctx.getState();
        const pollutions = state.pollutions.map(p => p.id === pollution.id ? pollution : p);
        ctx.patchState({
            pollutions,
            loading: false,
            error: null
        });
    }

    @Action(UpdatePollutionFailure)
    updatePollutionFailure(ctx: StateContext<PollutionStateModel>, { error }: UpdatePollutionFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(DeletePollution)
    deletePollution(ctx: StateContext<PollutionStateModel>, { id }: DeletePollution) {
        ctx.patchState({ loading: true, error: null });
        
        return this.pollutionService.deletePollution(id).pipe(
            tap(() => {
                ctx.dispatch(new DeletePollutionSuccess(id));
            }),
            catchError(error => {
                ctx.dispatch(new DeletePollutionFailure(error.message || 'Erreur lors de la suppression de la pollution'));
                return of(null);
            })
        );
    }

    @Action(DeletePollutionSuccess)
    deletePollutionSuccess(ctx: StateContext<PollutionStateModel>, { id }: DeletePollutionSuccess) {
        const state = ctx.getState();
        const pollutions = state.pollutions.filter(p => p.id !== id);
        ctx.patchState({
            pollutions,
            loading: false,
            error: null
        });
    }

    @Action(DeletePollutionFailure)
    deletePollutionFailure(ctx: StateContext<PollutionStateModel>, { error }: DeletePollutionFailure) {
        ctx.patchState({
            loading: false,
            error
        });
    }

    @Action(SelectPollution)
    selectPollution(ctx: StateContext<PollutionStateModel>, { pollution }: SelectPollution) {
        ctx.patchState({
            selectedPollution: pollution
        });
    }

    // Favorites Actions
    @Action(LoadFavorites)
    loadFavorites(ctx: StateContext<PollutionStateModel>, { userId }: LoadFavorites) {
        return this.favoritesService.getUserFavorites(userId).pipe(
            tap(favorites => {
                const favoriteIds = favorites.map(f => f.id);
                ctx.dispatch(new LoadFavoritesSuccess(favoriteIds));
            }),
            catchError(error => {
                ctx.dispatch(new LoadFavoritesFailure(error.message || 'Erreur lors du chargement des favoris'));
                return of(null);
            })
        );
    }

    @Action(LoadFavoritesSuccess)
    loadFavoritesSuccess(ctx: StateContext<PollutionStateModel>, { favorites }: LoadFavoritesSuccess) {
        ctx.patchState({
            favoriteIds: favorites
        });
    }

    @Action(LoadFavoritesFailure)
    loadFavoritesFailure(ctx: StateContext<PollutionStateModel>, { error }: LoadFavoritesFailure) {
        ctx.patchState({
            error
        });
    }

    @Action(AddFavorite)
    addFavorite(ctx: StateContext<PollutionStateModel>, { userId, pollutionId }: AddFavorite) {
        return this.favoritesService.addFavorite(userId, pollutionId).pipe(
            tap(() => {
                ctx.dispatch(new AddFavoriteSuccess(pollutionId));
            }),
            catchError(error => {
                ctx.dispatch(new AddFavoriteFailure(error.message || 'Erreur lors de l\'ajout du favori'));
                return of(null);
            })
        );
    }

    @Action(AddFavoriteSuccess)
    addFavoriteSuccess(ctx: StateContext<PollutionStateModel>, { pollutionId }: AddFavoriteSuccess) {
        const state = ctx.getState();
        ctx.patchState({
            favoriteIds: [...state.favoriteIds, pollutionId]
        });
    }

    @Action(AddFavoriteFailure)
    addFavoriteFailure(ctx: StateContext<PollutionStateModel>, { error }: AddFavoriteFailure) {
        ctx.patchState({
            error
        });
    }

    @Action(RemoveFavorite)
    removeFavorite(ctx: StateContext<PollutionStateModel>, { userId, pollutionId }: RemoveFavorite) {
        return this.favoritesService.removeFavorite(userId, pollutionId).pipe(
            tap(() => {
                ctx.dispatch(new RemoveFavoriteSuccess(pollutionId));
            }),
            catchError(error => {
                ctx.dispatch(new RemoveFavoriteFailure(error.message || 'Erreur lors de la suppression du favori'));
                return of(null);
            })
        );
    }

    @Action(RemoveFavoriteSuccess)
    removeFavoriteSuccess(ctx: StateContext<PollutionStateModel>, { pollutionId }: RemoveFavoriteSuccess) {
        const state = ctx.getState();
        ctx.patchState({
            favoriteIds: state.favoriteIds.filter(id => id !== pollutionId)
        });
    }

    @Action(RemoveFavoriteFailure)
    removeFavoriteFailure(ctx: StateContext<PollutionStateModel>, { error }: RemoveFavoriteFailure) {
        ctx.patchState({
            error
        });
    }
}
