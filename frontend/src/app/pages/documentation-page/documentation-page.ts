import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-documentation-page',
  imports: [CommonModule, RouterLink],
  templateUrl: './documentation-page.html',
  styleUrl: './documentation-page.css'
})
export class DocumentationPage {
  readonly repositoryUrl = 'https://github.com/mii-dgsin/dgsin-2526-10';
  readonly appEngineUrl = 'https://dgsin-2526-10-mjcadenas.ew.r.appspot.com';

  readonly documentationLinks = [
    {
      label: 'README',
      description: 'General project description, installation instructions and current status.',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/README.md'
    },
    {
      label: 'Project diary',
      description: 'Development diary with the main project advances.',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/diary.md'
    },
    {
      label: 'API documentation',
      description: 'Detailed API documentation with endpoints, examples and status codes.',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/api.md'
    },
    {
      label: 'Postman collection',
      description: 'Collection of API tests covering CRUD, errors and integration endpoints.',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/postman/DGSIN-2526-10.postman_collection.json'
    }
  ];
}