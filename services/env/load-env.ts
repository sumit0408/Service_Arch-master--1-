// external modules
import envLoader from "dotenv";
import path from "path";
import { EventEmitter } from "node:events";

// internal modules
import { Service, Env } from "../../interfaces";
import { ERROR_MESSAGES, SERVICES, LOG_MESSAGES } from "../../constants";
import { Logger } from "../../libs/logger/logger";

// service enviroment variable get/set module
export class EnvInject extends EventEmitter implements Service {
    // service info
    serviceName: string = SERVICES.ENV;
    isAsync: boolean = false;
    logger?: Logger;
    isOptionalService: boolean = false;

    // enviroment var's
    env:Env = {};

    // setup config's
    constructor(logger?:Logger) {
        super();
        this.logger = logger;
        if(this.logger) this.logger.setServiceName(this.serviceName);
    }

  // load the enviroment var's
  loadEnvVars = () => {
    try {
    // check if the env load option is true
    const loadEnv = Number(process.env.LOAD_ENV);
    if(loadEnv) envLoader.config({ path: path.join(__dirname, "dev.env") });
    else this.logger?.log(LOG_MESSAGES.ENV_LOAD_DISABLE);
    } catch (err:any) {
        this.logger?.error(ERROR_MESSAGES.LOAD_ENV.concat('\n'), err)
    }
   }

  // inject the env from process to service instance
  injectEnvVars = () => {
    try {
            // create a sallow copy of process.env object
            this.env = {...process.env}
    } catch (err) {
        this.logger?.error(ERROR_MESSAGES.LOAD_ENV.concat('\n'), err)
    }
   }

  // env getters
  getEnv = () => this.env;
  getVar = (key: keyof Env) => {
    return this.env[key];
  }

  // run the service
  run = () => {
    try {
        this.loadEnvVars();
        this.injectEnvVars();
    } catch (err) {
        this.logger?.error(ERROR_MESSAGES.LOAD_ENV.concat('\n'), err)
    }
  }
}

