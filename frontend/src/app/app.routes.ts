import { Routes } from '@angular/router';

import { RecordsPage } from './pages/records-page/records-page';
import { CreateRecordPage } from './pages/create-record-page/create-record-page';
import { EditRecordPage } from './pages/edit-record-page/edit-record-page';
import { IntegrationPage } from './pages/integration-page/integration-page';
import { DocumentationPage } from './pages/documentation-page/documentation-page';
import { IntegrationsPage } from './pages/integrations-page/integrations-page';
import { AnalyticsPage } from './pages/analytics-page/analytics-page';
import { AboutPage } from './pages/about-page/about-page';

export const routes: Routes = [
  {
    path: '',
    component: RecordsPage
  },
  {
    path: 'records/new',
    component: CreateRecordPage
  },
  {
    path: 'records/:id/edit',
    component: EditRecordPage
  },
  {
    path: 'integrations',
    component: IntegrationsPage
  },
  {
    path: 'integrations/renewable-electricity',
    component: IntegrationPage
  },
  {
    path: 'analytics',
    component: AnalyticsPage
  },
  {
    path: 'about',
    component: AboutPage
  },
  {
    path: 'documentation',
    component: DocumentationPage
  },
  {
    path: '**',
    redirectTo: ''
  }
];