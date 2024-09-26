import { Logger } from "../libs/logger/logger";
import { Env } from "./internal.interface";

// general services interfaces
export interface Service {
    // service details properties
    serviceName: string;
    description?: string;

    // service control properties
    isAsync: boolean;
    isOptionalService?: boolean;
    running?: boolean;
    envConfig?: EnvServiceInterface;

    // enable/disable flags for error logs and action saving in database
    isSavingActions?: boolean;
    isSavingErrLogs?: boolean;

    // method for service control and details
    run: Function; // run main includes the main logic of service startup and other service related config's
    stop?: Function; // used to stop service temporarily
    getServiceInfo?: Function; // to get the service details eg. name description etc..
    configEvents?: Function; // bind the internal events

    // logger object attactment
    logger?: Logger;
    

    /*
    rpc interface (for checking the service health)
    // not implemented just proposal
    */
    rpcHandler?: any;

    // helpers for saving the error logs and actions
    // not implemented just proposal
    saveAction?: Function;  // Need to create a single method for it
    saveErrLogs?: Function; // Need to create a single method for it
}

// env service interface
export interface EnvServiceInterface extends Service {
    env: Env;

    getEnv: Function;
    getVar: Function;
    loadEnvVars: Function;
    injectEnvVars: Function;
}