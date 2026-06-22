export interface CarbonEmissionRecord {
  _id: string;
  location: string;
  period: number;
  totalEmissionsMt: number;
  emissionsIntensity: number;
  emissionsPerCapita: number;
  annualVariation: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface CarbonEmissionRecordResponse {
  total: number;
  limit: number;
  offset: number;
  records: CarbonEmissionRecord[];
}