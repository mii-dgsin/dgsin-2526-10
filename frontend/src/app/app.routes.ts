import { Routes } from '@angular/router';
import { RecordsPage } from './pages/records-page/records-page';
import { EditRecordPage } from './pages/edit-record-page/edit-record-page';
import { CreateRecordPage } from './pages/create-record-page/create-record-page';

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
    path: '**',
    redirectTo: ''
  }
];