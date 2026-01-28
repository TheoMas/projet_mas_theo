import { Pollution } from './pollution';

export interface PollutionStateModel {
    pollutions: Pollution[];
    selectedPollution: Pollution | null;
    loading: boolean;
    error: string | null;
    favoriteIds: number[];
}
