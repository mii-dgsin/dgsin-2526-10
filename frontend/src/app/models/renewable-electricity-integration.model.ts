import { CarbonEmissionRecord } from './carbon-emission-record.model';

export interface SupportedIntegrationLocation {
  label: string;
  emberEntity: string;
  localLocation: string;
}

export interface RenewableElectricityIntegrationResponse {
  location: string;
  emberEntity: string;
  localLocation: string;
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