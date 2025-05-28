export class Address {
    logisticReceiver: string;
    contact: string;
    fullAddress: string;


    constructor(logisticReceiver: string, contact: string, fullAddress: string) {
        this.logisticReceiver = logisticReceiver
        this.contact = contact
        this.fullAddress = fullAddress
    }
}