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
  readonly apiIndexUrl = 'https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1';
  readonly postmanDocumentationUrl =
    'https://documenter.getpostman.com/view/15287747/2sBXwyG7Uk';
  readonly openApiDocumentationUrl =
    'https://dgsin-2526-10-mjcadenas.ew.r.appspot.com/api/v1/openapi';

  readonly documentationLinks = [
    {
      label: 'README',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/README.md',
      description:
        'General project description, setup instructions, deployment information and delivery notes.'
    },
    {
      label: 'Development diary',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/diary.md',
      description:
        'Development progress, technical decisions and relevant changes made during the project.'
    },
    {
      label: 'carbon-emission-records API documentation',
      url:
        'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/carbon-emission-records-docs.md',
      description:
        'Markdown documentation of the REST API resource, including operations, examples and status codes.'
    },
    {
      label: 'OpenAPI specification',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/openapi.yaml',
      description:
        'OpenAPI 3.0.3 specification of the REST API. It is also rendered visually with Swagger UI.'
    },
    {
      label: 'Postman public documentation',
      url: 'https://documenter.getpostman.com/view/15287747/2sBXwyG7Uk',
      description:
        'Public Postman documentation generated from the API test collection.'
    },
    {
      label: 'Extra activities',
      url: 'https://github.com/mii-dgsin/dgsin-2526-10/blob/main/docs/extras.md',
      description:
        'Description of the extra activities implemented in the project.'
    },
    {
      label: 'Video',
      url: 'https://www.kaltura.com/tiny/4nkkcwgr',
      description:
        'Description video of the project.'
    }
  ];
}
