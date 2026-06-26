import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  OnInit,
  ViewChild
} from '@angular/core';

import { CommonModule, ViewportScroller } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import * as Highcharts from 'highcharts';

import {
  RenewableElectricityIntegrationResponse,
  SupportedIntegrationLocation
} from '../../models/renewable-electricity-integration.model';
import { IntegrationService } from '../../services/integration.service';
import { CarbonEmissionRecordService } from '../../services/carbon-emission-record.service';

interface ChartPoint {
  year: number;
  value: number;
}

@Component({
  selector: 'app-integration-page',
  imports: [CommonModule, FormsModule],
  templateUrl: './integration-page.html',
  styleUrl: './integration-page.css'
})
export class IntegrationPage implements OnInit, AfterViewInit {
  readonly minPeriod = 1970;
  readonly maxPeriod = new Date().getFullYear();

  @ViewChild('emissionsChart') emissionsChart?: ElementRef<HTMLDivElement>;
  @ViewChild('electricityChart') electricityChart?: ElementRef<HTMLDivElement>;
  @ViewChild('combinedChart') combinedChart?: ElementRef<HTMLDivElement>;

  supportedLocations: SupportedIntegrationLocation[] = [];
  selectedLocation = 'Spain';

  fromPeriod = '2020';
  toPeriod = '2023';
  locations: string[] = [];

  loading = false;
  errorMessage = '';
  externalChartWarning = '';
  combinedChartWarning = '';
  integration?: RenewableElectricityIntegrationResponse;

  private viewInitialized = false;
  private pendingFragment: string | null = null;
  private queryParamsApplied = false;

  constructor(
    private readonly integrationService: IntegrationService,
    private readonly carbonEmissionRecordService: CarbonEmissionRecordService,
    private readonly changeDetectorRef: ChangeDetectorRef,
    private readonly route: ActivatedRoute,
    private readonly viewportScroller: ViewportScroller
  ) {}

  ngOnInit(): void {
    this.route.fragment.subscribe((fragment) => {
      this.pendingFragment = fragment;
    });

    this.route.queryParams.subscribe((params) => {
      const location = params['location'];
      const fromPeriod = params['fromPeriod'];
      const toPeriod = params['toPeriod'];

      if (location) {
        this.selectedLocation = location;
      }

      if (fromPeriod) {
        this.fromPeriod = String(fromPeriod);
      }

      if (toPeriod) {
        this.toPeriod = String(toPeriod);
      }

      this.queryParamsApplied = Boolean(location && fromPeriod && toPeriod);
    });

    this.loadSupportedLocations();
  }

  ngAfterViewInit(): void {
    this.viewInitialized = true;

    if (this.integration) {
      setTimeout(() => {
        this.renderCharts();
        this.scrollToPendingFragment();
      }, 0);
    }
  }

  get hasInvalidFilters(): boolean {
    const fromYear = Number(this.fromPeriod);
    const toYear = Number(this.toPeriod);

    if (!this.selectedLocation || this.selectedLocation.trim().length === 0) {
      return true;
    }

    if (fromYear < this.minPeriod || fromYear > this.maxPeriod) {
      return true;
    }

    if (toYear < this.minPeriod || toYear > this.maxPeriod) {
      return true;
    }

    return fromYear > toYear;
  }

  loadSupportedLocations(): void {
    this.integrationService.getSupportedLocations().subscribe({
      next: (response) => {
        this.supportedLocations = response.locations;

        if (
          this.supportedLocations.length > 0 &&
          !this.supportedLocations.some((item) => item.label === this.selectedLocation)
        ) {
          this.selectedLocation = this.supportedLocations[0].label;
        }

        if (this.queryParamsApplied) {
          this.loadIntegration();
        }

        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Load supported locations error:', error);
        this.errorMessage = 'Error loading supported integration locations';
        this.changeDetectorRef.detectChanges();
      }
    });
  }

  loadIntegration(): void {
    if (this.hasInvalidFilters) {
      this.errorMessage =
        `Location is required. Years must be between ${this.minPeriod} and ${this.maxPeriod}, ` +
        'and From year cannot be greater than To year.';
      this.integration = undefined;
      this.externalChartWarning = '';
      this.combinedChartWarning = '';
      this.changeDetectorRef.detectChanges();
      return;
    }

    this.loading = true;
    this.errorMessage = '';
    this.externalChartWarning = '';
    this.combinedChartWarning = '';
    this.integration = undefined;
    this.changeDetectorRef.detectChanges();

    this.integrationService
      .getRenewableElectricityIntegration({
        location: this.selectedLocation,
        fromPeriod: this.fromPeriod,
        toPeriod: this.toPeriod
      })
      .subscribe({
        next: (response) => {
          this.integration = response;
          this.loading = false;
          this.changeDetectorRef.detectChanges();

          setTimeout(() => {
            this.renderCharts();
            this.scrollToPendingFragment();
          }, 0);
        },
        error: (error) => {
          console.error('Integration error:', error);
          this.errorMessage = this.getApiErrorMessage(
            error,
            'Error loading renewable electricity integration'
          );
          this.loading = false;
          this.changeDetectorRef.detectChanges();
        }
      });
  }

  loadLocations(): void {
    this.carbonEmissionRecordService.getLocations().subscribe({
      next: (response) => {
        this.locations = response.locations;
        this.changeDetectorRef.detectChanges();
      },
      error: (error) => {
        console.error('Load locations error:', error);
      }
    });
  }

  private renderCharts(): void {
    if (!this.integration || !this.viewInitialized) {
      return;
    }

    this.renderEmissionsChart();
    this.renderElectricityChart();
    this.renderCombinedChart();
  }

  private renderEmissionsChart(): void {
    if (!this.integration || !this.emissionsChart?.nativeElement) {
      return;
    }

    const emissionsPoints = this.integration.emissions
      .map((record) => ({
        year: record.period,
        value: record.totalEmissionsMt
      }))
      .sort((a, b) => a.year - b.year);

    Highcharts.chart(this.emissionsChart.nativeElement, {
      chart: {
        type: 'line'
      },
      title: {
        text: 'CO₂ emissions by year'
      },
      xAxis: {
        categories: emissionsPoints.map((point) => point.year.toString()),
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        title: {
          text: 'Total emissions Mt'
        }
      },
      tooltip: {
        valueSuffix: ' Mt'
      },
      series: [
        {
          type: 'line',
          name: 'CO₂ emissions',
          data: emissionsPoints.map((point) => point.value)
        }
      ],
      credits: {
        enabled: false
      }
    });
  }

  private renderElectricityChart(): void {
    if (!this.integration || !this.electricityChart?.nativeElement) {
      return;
    }

    const electricityPoints = this.extractElectricityPoints(
      this.integration.electricityGeneration
    );

    if (electricityPoints.length === 0) {
      this.externalChartWarning =
        'No numeric yearly value could be extracted from the external Ember response. Review the raw JSON below.';
      this.changeDetectorRef.detectChanges();

      Highcharts.chart(this.electricityChart.nativeElement, {
        chart: {
          type: 'line'
        },
        title: {
          text: 'External Ember electricity data'
        },
        xAxis: {
          categories: []
        },
        yAxis: {
          title: {
            text: 'Value'
          }
        },
        series: [
          {
            type: 'line',
            name: 'External data',
            data: []
          }
        ],
        credits: {
          enabled: false
        }
      });

      return;
    }

    this.externalChartWarning = '';

    Highcharts.chart(this.electricityChart.nativeElement, {
      chart: {
        type: 'column'
      },
      title: {
        text: 'External Ember electricity data by year'
      },
      xAxis: {
        categories: electricityPoints.map((point) => point.year.toString()),
        title: {
          text: 'Year'
        }
      },
      yAxis: {
        title: {
          text: 'Electricity generation value'
        }
      },
      tooltip: {
        valueDecimals: 2
      },
      series: [
        {
          type: 'column',
          name: 'External electricity data',
          data: electricityPoints.map((point) => point.value)
        }
      ],
      credits: {
        enabled: false
      }
    });
  }

  private renderCombinedChart(): void {
    if (!this.integration || !this.combinedChart?.nativeElement) {
      return;
    }

    const emissionsPoints = this.integration.emissions
      .map((record) => ({
        year: record.period,
        value: record.totalEmissionsMt
      }))
      .sort((a, b) => a.year - b.year);

    const electricityPoints = this.extractElectricityPoints(
      this.integration.electricityGeneration
    );

    if (emissionsPoints.length === 0 || electricityPoints.length === 0) {
      this.combinedChartWarning =
        'The combined chart cannot be rendered because one of the data sources has no usable yearly values.';
      this.changeDetectorRef.detectChanges();
      return;
    }

    const years = Array.from(
      new Set([
        ...emissionsPoints.map((point) => point.year),
        ...electricityPoints.map((point) => point.year)
      ])
    ).sort((a, b) => a - b);

    const emissionsByYear = new Map(
      emissionsPoints.map((point) => [point.year, point.value])
    );

    const electricityByYear = new Map(
      electricityPoints.map((point) => [point.year, point.value])
    );

    const emissionsSeries = years.map((year) =>
      emissionsByYear.has(year) ? emissionsByYear.get(year) ?? null : null
    );

    const electricitySeries = years.map((year) =>
      electricityByYear.has(year) ? electricityByYear.get(year) ?? null : null
    );

    this.combinedChartWarning = '';

    Highcharts.chart(this.combinedChart.nativeElement, {
      chart: {
        zooming: {
          type: 'x'
        }
      },
      title: {
        text: 'CO₂ emissions vs Ember electricity data'
      },
      subtitle: {
        text: 'Comparison between local CO₂ emission records and external Ember Energy data'
      },
      xAxis: {
        categories: years.map((year) => year.toString()),
        title: {
          text: 'Year'
        }
      },
      yAxis: [
        {
          title: {
            text: 'CO₂ emissions Mt'
          }
        },
        {
          title: {
            text: 'Electricity generation value'
          },
          opposite: true
        }
      ],
      tooltip: {
        shared: true
      },
      series: [
        {
          type: 'line',
          name: 'CO₂ emissions',
          data: emissionsSeries,
          yAxis: 0,
          tooltip: {
            valueSuffix: ' Mt'
          }
        },
        {
          type: 'column',
          name: 'Ember electricity data',
          data: electricitySeries,
          yAxis: 1,
          tooltip: {
            valueDecimals: 2
          }
        }
      ],
      credits: {
        enabled: false
      }
    });
  }

  private extractElectricityPoints(records: unknown[]): ChartPoint[] {
    const points: ChartPoint[] = [];

    for (const item of records) {
      const record = item as Record<string, unknown>;

      const year = this.extractYear(record);
      const value = this.extractNumericValue(record);

      if (year !== null && value !== null) {
        points.push({
          year,
          value
        });
      }
    }

    return points.sort((a, b) => a.year - b.year);
  }

  private extractYear(record: Record<string, unknown>): number | null {
    const possibleYearKeys = ['year', 'date', 'period'];

    for (const key of possibleYearKeys) {
      const value = record[key];

      if (typeof value === 'number') {
        return value;
      }

      if (typeof value === 'string') {
        const yearMatch = value.match(/\d{4}/);

        if (yearMatch) {
          return Number(yearMatch[0]);
        }
      }
    }

    return null;
  }

  private extractNumericValue(record: Record<string, unknown>): number | null {
    const preferredKeys = [
      'generation_twh',
      'generationTwh',
      'generation',
      'value',
      'twh',
      'electricity_generation',
      'electricityGeneration'
    ];

    for (const key of preferredKeys) {
      const value = record[key];

      if (typeof value === 'number') {
        return value;
      }

      if (typeof value === 'string' && value.trim() !== '') {
        const parsed = Number(value);

        if (!Number.isNaN(parsed)) {
          return parsed;
        }
      }
    }

    for (const [key, value] of Object.entries(record)) {
      if (key.toLowerCase().includes('year')) {
        continue;
      }

      if (typeof value === 'number') {
        return value;
      }
    }

    return null;
  }

  private scrollToPendingFragment(): void {
    if (!this.pendingFragment) {
      return;
    }

    setTimeout(() => {
      this.viewportScroller.scrollToAnchor(this.pendingFragment as string);
      this.pendingFragment = null;
    }, 300);
  }

  private getApiErrorMessage(error: any, defaultMessage: string): string {
    if (error?.error?.errors && Array.isArray(error.error.errors)) {
      return error.error.errors.join(', ');
    }

    if (error?.error?.message) {
      return error.error.message;
    }

    if (error?.error?.error) {
      return error.error.error;
    }

    return defaultMessage;
  }
}