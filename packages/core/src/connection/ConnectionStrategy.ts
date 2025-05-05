import { PaymentConfig, PaymentEvent } from '../types';
import { EventEmitter } from '../EventEmitter';

export interface ConnectionStrategy {
    connect(): Promise<void>;
    disconnect(): Promise<void>;
    isConnected(): boolean;
    subscribe(paymentId: string): Promise<void>;
    unsubscribe(paymentId: string): Promise<void>;
}

export abstract class BaseConnection implements ConnectionStrategy {
    protected config: PaymentConfig;
    protected eventEmitter: EventEmitter;
    protected connected: boolean = false;
    protected subscriptions: Set<string> = new Set();

    constructor(config: PaymentConfig, eventEmitter: EventEmitter) {
        this.config = config;
        this.eventEmitter = eventEmitter;
    }

    abstract connect(): Promise<void>;
    abstract disconnect(): Promise<void>;

    isConnected(): boolean {
        return this.connected;
    }

    abstract subscribe(paymentId: string): Promise<void>;
    abstract unsubscribe(paymentId: string): Promise<void>;

    protected handleEvent(event: PaymentEvent): void {
        this.eventEmitter.emit('payment.event', event);
    }
}