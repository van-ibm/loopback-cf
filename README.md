# loopback-appid

Conveniently adds Cloud Foundry services to Loobpack 4.

## Usage

Within your `index.ts` `main` function, add the component to your app.

```javascript
import { CloudFoundryComponent } from 'loopback-cf';

export async function main(options: ApplicationConfig = {}) {
  const app = new Application(options);

  // should go first to load Cloud Foundry services for downstream components
  app.component(CloudFoundryComponent);

  ...
}
```

Then anywhere you have Loopback code, you can inject the `ApplicationConfig` and retrieve Cloud Foundry services.

```javascript
constructor(
  @inject(CoreBindings.APPLICATION_CONFIG) options: any = {},
) {
  const credentials = options['<some-service-name>'];
}
```