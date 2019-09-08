import { Component, CoreBindings, inject } from '@loopback/core';
import { RestApplication } from '@loopback/rest';
import { getLogger } from 'log4js';

// @ts-ignore
import * as cfenv from 'cfenv';

const logger = getLogger('CloudFoundryComponent');

require('dotenv').config();

logger.level = process.env.LOG_LEVEL || 'info';

export class CloudFoundryComponent implements Component {

  /**
   * Loads Cloud Foundry bindings into your app's config.
   * @param app Loopback application (normally created in `main` function of `index.ts`)
   */
  constructor(@inject(CoreBindings.APPLICATION_INSTANCE) private app: RestApplication) {
    const { options } = app;

    let appEnv = cfenv.getAppEnv();

    // if local, use a local vcap-services file
    if (appEnv.isLocal) {
      // check if a VCAP file is specified or use the one in the app directory's root
      const { VCAP_FILE } = process.env;
      const vcapFile = VCAP_FILE || '../../../vcap-services.json';
      
      logger.info(`VCAP ${vcapFile} found`);
      
      // inject VCAP_SERVICES
      try {
        appEnv = cfenv.getAppEnv({
          vcap: {
            services: require(vcapFile), // require here, .cfignore does not deploy file
          },
        });
      } catch (e) {
        logger.warn(`VCAP ${vcapFile} not found; create it in project root folder or specify with env.VCAP_FILE`);
      }
    }

    // get the services
    const services = appEnv.getServices();
    const serviceNames = Object.keys(services);

    logger.info(`Adding Cloud Foundry services to ApplicationConfig: ${serviceNames}`);

    // store each service's credentials object at the service name key in the ApplicationConfig
    for (const name of serviceNames) {
      const { credentials } = services[name];
      options[name] = credentials;
    }
  }
}
