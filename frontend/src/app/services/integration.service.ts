import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  RenewableElectricityIntegrationResponse,
  SupportedIntegrationLocation
} from '../models/renewable-electricity-integration.model';

@Injectable({
  providedIn: 'root'
})
export class IntegrationService {
  private readonly apiUrl =
    'https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/integrations';

  constructor(private readonly http: HttpClient) {}

  getSupportedLocations(): Observable<{
    total: number;
    locations: SupportedIntegrationLocation[];
  }> {
    return this.http.get<{
      total: number;
      locations: SupportedIntegrationLocation[];
    }>(`${this.apiUrl}/supported-locations`);
  }

  getRenewableElectricityIntegration(filters: {
    location: string;
    fromPeriod: string;
    toPeriod: string;
  }): Observable<RenewableElectricityIntegrationResponse> {
    let params = new HttpParams();

    params = params.set('location', filters.location);
    params = params.set('fromPeriod', filters.fromPeriod);
    params = params.set('toPeriod', filters.toPeriod);

    return this.http.get<RenewableElectricityIntegrationResponse>(
      `${this.apiUrl}/renewable-electricity`,
      { params }
    );
  }
}