export interface CarbonEmissionRecord {
  _id: string;
  location: string;
  period: number;
  totalEmissionsMt: number;
  emissionsIntensity: number | null;
  emissionsPerCapita: number;
  annualVariation: number | null;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarbonEmissionRecordResponse {
  total: number;
  limit: number;
  offset: number;
  records: CarbonEmissionRecord[];
}