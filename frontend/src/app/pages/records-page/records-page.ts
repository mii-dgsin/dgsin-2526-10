import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';

import { CarbonEmissionRecord } from '../../models/carbon-emission-record.model';
import { CarbonEmissionRecordService } from '../../services/carbon-emission-record.service';

@Component({
  selector: 'app-records-page',
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './records-page.html',
  styleUrl: './records-page.css'
})
export class RecordsPage implements OnInit {
  readonly minPeriod = 1970;
  readonly maxPeriod = new Date().getFullYear();

  records: CarbonEmissionRecord[] = [];
  locations: string[] = [];
  total = 0;
  loading = false;
  errorMessage = '';
  successMessage = '';

  location = '';
  period = '';
  fromPeriod = '';
  toPeriod = '';

  limit = 50;
  offset = 0;

  private filterTimeout?: ReturnType<typeof setTimeout>;

  constructor(
    private readonly carbonEmissionService: CarbonEmissionRecordService,
    private readonly changeDetectorRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.loadLocations();
    this.loadRecords();
  }

  private finishLoading(): void {
    this.loading = false;
    this.changeDetectorRef.detectChanges();
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

  isYearOutOfRange(value: string): boolean {
    if (!value) {
      return false;
    }

    const year = Number(value);

    return year < this.minPeriod || year > this.maxPeriod;
  }

  loadRecords(): void {
    if (this.hasInvalidYearFilters) {
      this.successMessage = '';
      this.errorMessage =
        `Years must be between ${this.minPeriod} and ${this.maxPeriod}. ` +
        '"From year" cannot be greater than "To year".';
      this.finishLoading();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

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
          this.finishLoading();
        },
        error: (error) => {
          console.error('Load records error:', error);
          this.errorMessage = this.getApiErrorMessage(
            error,
            'Error loading carbon emission records'
          );
          this.finishLoading();
        }
      });
  }
  loadLocations(): void {
    this.carbonEmissionService.getLocations().subscribe({
      next: (response) => {
        this.locations = response.locations;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Load locations error:', error);
      }
    });
  }

  onFiltersChanged(): void {
    if (this.filterTimeout) {
      clearTimeout(this.filterTimeout);
    }

    this.filterTimeout = setTimeout(() => {
      this.offset = 0;
      this.loadRecords();
    }, 400);
  }

  applyFilters(): void {
    this.offset = 0;
    this.loadRecords();
  }

  clearFilters(): void {
    this.location = '';
    this.period = '';
    this.fromPeriod = '';
    this.toPeriod = '';
    this.errorMessage = '';
    this.successMessage = '';
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

  deleteRecord(id: string): void {
    const confirmed = confirm('Are you sure you want to delete this record?');

    if (!confirmed) {
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.successMessage = '';

    this.carbonEmissionService.deleteRecord(id).subscribe({
      next: () => {
        if (this.records.length === 1 && this.offset > 0) {
          this.offset = Math.max(this.offset - this.limit, 0);
        }

        this.successMessage = 'Record deleted successfully';
        this.loadRecords();
      },
      error: (error) => {
        console.error('Delete record error:', error);
        this.errorMessage = this.getApiErrorMessage(
          error,
          'Error deleting carbon emission record'
        );
        this.loading = false;
      }
    });
  }

  private getApiErrorMessage(error: any, defaultMessage: string): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.join(', ');
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    return defaultMessage;
  }
}