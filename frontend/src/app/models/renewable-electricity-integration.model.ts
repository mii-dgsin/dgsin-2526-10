import { CarbonEmissionRecord } from './carbon-emission-record.model';

export interface RenewableElectricityIntegrationResponse {
  location: string;
  entityCode: string;
  fromPeriod: number;
  toPeriod: number;
  emissions: CarbonEmissionRecord[];
  electricityGeneration: unknown[];
  source: {
    name: string;
    dataset: string;
    url: string;
    license: string;
  };
}