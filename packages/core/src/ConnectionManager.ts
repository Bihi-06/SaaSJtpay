import { ConnectionStrategy } from './connection/ConnectionStrategy';
import { WebSocketConnection } from './connection/WebSocketConnection';
import { PollingConnection } from './connection/PollingConnection';
import { PaymentConfig } from './types';
import { EventEmitter } from './EventEmitter';

export enum Environment {
    Browser,
    Server,
    Mobile
}

export class ConnectionManager {
    private connection: ConnectionStrategy;
    private config: PaymentConfig;
    private eventEmitter: EventEmitter;

    constructor(config: PaymentConfig, eventEmitter: EventEmitter) {
        this.config = config;
        this.eventEmitter = eventEmitter;
        this.connection = this.determineConnection();
    }

    private determineConnection(): ConnectionStrategy {
        const env = this.detectEnvironment();

        if (env === Environment.Browser) {
            if (this.supportsWebSockets()) {
                return new WebSocketConnection(this.config, this.eventEmitter);
            } else {
                return new PollingConnection(this.config, this.eventEmitter);
            }
        }

        // For server and mobile, default to polling for simplicity in this example
        // In a real implementation, you'd add server-specific webhook handling
        // and mobile-specific push notification handling
        return new PollingConnection(this.config, this.eventEmitter);
    }

    private detectEnvironment(): Environment {
        // Check if we're in a browser
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            // Check if it might be React Native
            if (
                typeof navigator !== 'undefined' &&
                navigator.product === 'ReactNative'
            ) {
                return Environment.Mobile;
            }
            return Environment.Browser;
        }

        // Assume server environment
        return Environment.Server;
    }

    private supportsWebSockets(): boolean {
        return typeof WebSocket !== 'undefined';
    }

    async connect(): Promise<void> {
        return this.connection.connect();
    }

    async disconnect(): Promise<void> {
        return this.connection.disconnect();
    }

    async subscribe(paymentId: string): Promise<void> {
        return this.connection.subscribe(paymentId);
    }

    async unsubscribe(paymentId: string): Promise<void> {
        return this.connection.unsubscribe(paymentId);
    }

    isConnected(): boolean {
        return this.connection.isConnected();
    }
}