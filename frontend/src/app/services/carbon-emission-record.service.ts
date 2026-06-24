import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import {
  CarbonEmissionRecord,
  CarbonEmissionRecordRequest,
  CarbonEmissionRecordResponse
} from '../models/carbon-emission-record.model';

@Injectable({
  providedIn: 'root'
})
export class CarbonEmissionRecordService {
  private readonly apiUrl =
    'https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/carbon-emission-records';

  constructor(private readonly http: HttpClient) {}

  getRecords(filters?: {
    location?: string;
    period?: string;
    fromPeriod?: string;
    toPeriod?: string;
    limit?: string;
    offset?: string;
  }): Observable<CarbonEmissionRecordResponse> {
    let params = new HttpParams();

    if (filters?.location) {
      params = params.set('location', filters.location);
    }

    if (filters?.period) {
      params = params.set('period', filters.period);
    }

    if (filters?.fromPeriod) {
      params = params.set('fromPeriod', filters.fromPeriod);
    }

    if (filters?.toPeriod) {
      params = params.set('toPeriod', filters.toPeriod);
    }

    params = params.set('limit', filters?.limit || '50');
    params = params.set('offset', filters?.offset || '0');

    return this.http.get<CarbonEmissionRecordResponse>(this.apiUrl, { params });
  }

  getRecordById(id: string) {
    return this.http.get<CarbonEmissionRecord>(`${this.apiUrl}/${id}`);
  }

  createRecord(record: CarbonEmissionRecordRequest): Observable<CarbonEmissionRecord> {
    return this.http.post<CarbonEmissionRecord>(this.apiUrl, record);
  }

  updateRecord(
    id: string,
    record: CarbonEmissionRecordRequest
  ): Observable<CarbonEmissionRecord> {
    return this.http.put<CarbonEmissionRecord>(`${this.apiUrl}/${id}`, record);
  }

  deleteRecord(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }
  getLocations() {
    return this.http.get<{
      total: number;
      locations: string[];
    }>(`${this.apiUrl}/locations`);
  }
}