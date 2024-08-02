import { HTTP_INTERCEPTORS } from '@angular/common/http';

import { TokenInterceptor } from './../interceptor/token.interceptor';

/** Http interceptor providers in outside-in order */
export const httpInterceptorProviders = [
  { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
];
