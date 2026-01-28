import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, HTTP_INTERCEPTORS, withInterceptorsFromDi } from '@angular/common/http';
import { AuthRefreshInterceptor } from './auth-refresh.interceptor';
import { PollutionService } from '../services/pollution.service';
import { UserService } from '../services/user.service';
import { importProvidersFrom } from '@angular/core';
import { NgxsModule } from '@ngxs/store';
import { AuthState } from '../shared/states/auth-state';
import { UserState } from '../shared/states/user-state';
import { PollutionState } from '../shared/states/pollution-state';

import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    PollutionService,
    UserService,
    importProvidersFrom(NgxsModule.forRoot([AuthState, UserState, PollutionState])),
    { provide: HTTP_INTERCEPTORS, useClass: AuthRefreshInterceptor, multi: true }
  ]
};
