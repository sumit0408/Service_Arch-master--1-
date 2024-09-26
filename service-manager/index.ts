import { Service } from "../interfaces";
import { Logger } from "../libs/logger/logger";
import { SERVICES } from "../constants";

// service manager for handling the configration and startup of services
export class ServiceManager implements Service {

    serviceName: string = SERVICES.SERVICE_MANAGER;
    logger?: Logger
    isAsync: boolean = true;
    services: Service[];

    /**
     * array index is used to start service in a sequence so add the services at first
     * place that need to be start first eg. evnv service etc.
     * @param services
     */
    constructor(services: Service[], logger?:Logger) {
        this.services = services;
        this.logger = logger;
    }

    // configure the services
    configServices = async () => {
        try {

        } catch (err) {
            // logger here
        }
    }

    // start the services
    run = async () => {
        try {
            // start all service one by one (check if service is async or sync)
            for (const service of this.services) {
                if(!service.isAsync) service.run();
                else await service.run();
            }
        } catch (err) {
            // logger here
        }
    }

}