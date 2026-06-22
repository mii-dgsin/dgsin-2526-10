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

  limit = 50;
  offset = 0;

  readonly minPeriod = 1970;
  readonly maxPeriod = 2023;

  constructor(private readonly carbonEmissionService: CarbonEmissionRecordService) {}

  ngOnInit(): void {
    this.loadRecords();
  }

  get currentPage(): number {
    return Math.floor(this.offset / this.limit) + 1;
  }

  get totalPages(): number {
    return Math.max(Math.ceil(this.total / this.limit), 1);
  }

  get firstVisibleRecord(): number {
    if (this.total === 0) {
      return 0;
    }

    return this.offset + 1;
  }

  get lastVisibleRecord(): number {
    return Math.min(this.offset + this.records.length, this.total);
  }

  get hasPreviousPage(): boolean {
    return this.offset > 0;
  }

  get hasNextPage(): boolean {
    return this.offset + this.limit < this.total;
  }
isYearOutOfRange(value: string): boolean {
  if (!value) {
    return false;
  }

  const year = Number(value);

  return year < this.minPeriod || year > this.maxPeriod;
}

  get hasInvalidYearFilters(): boolean {
    if (this.isYearOutOfRange(this.period)) {
      return true;
    }

    if (this.isYearOutOfRange(this.fromPeriod)) {
      return true;
    }

    if (this.isYearOutOfRange(this.toPeriod)) {
      return true;
    }

    if (this.fromPeriod && this.toPeriod) {
      return Number(this.fromPeriod) > Number(this.toPeriod);
    }

    return false;
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
        limit: this.limit.toString(),
        offset: this.offset.toString()
      })
      .subscribe({
        next: (response) => {
          this.records = response.records;
          this.total = response.total;
          this.limit = response.limit;
          this.offset = response.offset;
          this.loading = false;
        },
        error: () => {
          this.errorMessage = 'Error loading carbon emission records';
          this.loading = false;
        }
      });
  }

  applyFilters(): void {
    if (this.hasInvalidYearFilters) {
      this.errorMessage = `Years must be between ${this.minPeriod} and ${this.maxPeriod}`;
      return;
    }

    this.offset = 0;
    this.loadRecords();
  }

  clearFilters(): void {
    this.location = '';
    this.period = '';
    this.fromPeriod = '';
    this.toPeriod = '';
    this.errorMessage = '';
    this.offset = 0;
    this.loadRecords();
  }

  previousPage(): void {
    if (!this.hasPreviousPage) {
      return;
    }

    this.offset = Math.max(this.offset - this.limit, 0);
    this.loadRecords();
  }

  nextPage(): void {
    if (!this.hasNextPage) {
      return;
    }

    this.offset += this.limit;
    this.loadRecords();
  }

  changePageSize(): void {
    this.offset = 0;
    this.loadRecords();
  }
  private filterTimeout?: ReturnType<typeof setTimeout>;
  onFiltersChanged(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      if (this.hasInvalidYearFilters) {
        this.errorMessage = `Years must be between ${this.minPeriod} and ${this.maxPeriod}`;
        return;
      }

      this.offset = 0;
      this.loadRecords();
    }, 400);
  }

  deleteRecord(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this record?');

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    this.carbonEmissionService.deleteRecord(id).subscribe({
      next: () => {
        if (this.records.length === 1 && this.offset > 0) {
          this.offset = Math.max(this.offset - this.limit, 0);
        }

        this.loadRecords();
      },
      error: () => {
        this.errorMessage = 'Error deleting carbon emission record';
        this.loading = false;
      }
    });
  }
}
