// logger helper
export class Logger {
    private off:boolean = false;
    private service:string = ''

    constructor(off?: boolean){
        if(off) this.setLoggingStatus(off);
    }

    log = (...logs: unknown[]) => {
        if(this.getLoggingStatus()) return;
        console.log(...logs);
    }

    error = (...logs: unknown[]) => {
        if(this.getLoggingStatus()) return;
        console.error(...logs);
    }

    warn = (...logs: unknown[]) => {
        if(this.getLoggingStatus()) return;
        console.warn(...logs);
    }


    // getter/setter for on/off logs
    getLoggingStatus = () => {
        return this.off;
    }

    setLoggingStatus = (off:boolean) => {
        this.off = off
    }

    setServiceName = (serviceName:string) => {
        this.service = serviceName;
    }
}