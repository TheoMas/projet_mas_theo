import { Pollution } from '../models/pollution';

export class LoadPollutions {
    static readonly type = '[Pollution] Load Pollutions';
}

export class LoadPollutionsSuccess {
    static readonly type = '[Pollution] Load Pollutions Success';
    constructor(public pollutions: Pollution[]) {}
}

export class LoadPollutionsFailure {
    static readonly type = '[Pollution] Load Pollutions Failure';
    constructor(public error: string) {}
}

export class GetPollutionById {
    static readonly type = '[Pollution] Get Pollution By Id';
    constructor(public id: number) {}
}

export class GetPollutionByIdSuccess {
    static readonly type = '[Pollution] Get Pollution By Id Success';
    constructor(public pollution: Pollution) {}
}

export class GetPollutionByIdFailure {
    static readonly type = '[Pollution] Get Pollution By Id Failure';
    constructor(public error: string) {}
}

export class CreatePollution {
    static readonly type = '[Pollution] Create Pollution';
    constructor(public pollution: Omit<Pollution, 'id'>) {}
}

export class CreatePollutionSuccess {
    static readonly type = '[Pollution] Create Pollution Success';
    constructor(public pollution: Pollution) {}
}

export class CreatePollutionFailure {
    static readonly type = '[Pollution] Create Pollution Failure';
    constructor(public error: string) {}
}

export class UpdatePollution {
    static readonly type = '[Pollution] Update Pollution';
    constructor(public id: number, public pollution: Pollution) {}
}

export class UpdatePollutionSuccess {
    static readonly type = '[Pollution] Update Pollution Success';
    constructor(public pollution: Pollution) {}
}

export class UpdatePollutionFailure {
    static readonly type = '[Pollution] Update Pollution Failure';
    constructor(public error: string) {}
}

export class DeletePollution {
    static readonly type = '[Pollution] Delete Pollution';
    constructor(public id: number) {}
}

export class DeletePollutionSuccess {
    static readonly type = '[Pollution] Delete Pollution Success';
    constructor(public id: number) {}
}

export class DeletePollutionFailure {
    static readonly type = '[Pollution] Delete Pollution Failure';
    constructor(public error: string) {}
}

export class SelectPollution {
    static readonly type = '[Pollution] Select Pollution';
    constructor(public pollution: Pollution | null) {}
}

// Favorites Actions
export class LoadFavorites {
    static readonly type = '[Pollution] Load Favorites';
    constructor(public userId: number) {}
}

export class LoadFavoritesSuccess {
    static readonly type = '[Pollution] Load Favorites Success';
    constructor(public favorites: number[]) {}
}

export class LoadFavoritesFailure {
    static readonly type = '[Pollution] Load Favorites Failure';
    constructor(public error: string) {}
}

export class AddFavorite {
    static readonly type = '[Pollution] Add Favorite';
    constructor(public userId: number, public pollutionId: number) {}
}

export class AddFavoriteSuccess {
    static readonly type = '[Pollution] Add Favorite Success';
    constructor(public pollutionId: number) {}
}

export class AddFavoriteFailure {
    static readonly type = '[Pollution] Add Favorite Failure';
    constructor(public error: string) {}
}

export class RemoveFavorite {
    static readonly type = '[Pollution] Remove Favorite';
    constructor(public userId: number, public pollutionId: number) {}
}

export class RemoveFavoriteSuccess {
    static readonly type = '[Pollution] Remove Favorite Success';
    constructor(public pollutionId: number) {}
}

export class RemoveFavoriteFailure {
    static readonly type = '[Pollution] Remove Favorite Failure';
    constructor(public error: string) {}
}
