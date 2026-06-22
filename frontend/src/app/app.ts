import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CarbonEmissionRecord } from './models/carbon-emission-record.model';
import { CarbonEmissionRecordService } from './services/carbon-emission-record.service';

@Component({
  selector: 'app-root',
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App implements OnInit {
  records: CarbonEmissionRecord[] = [];
  total = 0;
  loading = false;
  errorMessage = '';

  location = '';
  period = '';
  fromPeriod = '';
  toPeriod = '';

  constructor(private readonly carbonEmissionService: CarbonEmissionRecordService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  loadRecords(): void {
    this.loading = true;
    this.errorMessage = '';

    this.carbonEmissionService
      .getRecords({
        location: this.location,
        period: this.period,
        fromPeriod: this.fromPeriod,
        toPeriod: this.toPeriod,
        limit: '100'
      })
      .subscribe({
        next: (response) => {
          this.records = response.records;
          this.total = response.total;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Error loading carbon emission records';
          this.loading = false;
        }
      });
  }

  clearFilters(): void {
    this.location = '';
    this.period = '';
    this.fromPeriod = '';
    this.toPeriod = '';
    this.loadRecords();
  }
}