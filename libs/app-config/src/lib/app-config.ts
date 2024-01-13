import { InjectionToken } from '@angular/core';
import { AppConfig } from '@product-feedback-app-v2/api-interfaces';

export const APP_CONFIG = new InjectionToken<AppConfig>('Application config');
