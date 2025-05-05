import { EventEmitter } from './EventEmitter';
import { ConnectionManager } from './ConnectionManager';
import {
    PaymentConfig,
    PaymentDetails,
    PaymentSession,
    PaymentEvent,
    PaymentEventCallback
} from './types';
import { signRequest } from './utils/security';

export class PaymentClient {
    private config: PaymentConfig;
    private eventEmitter: EventEmitter;
    private connectionManager: ConnectionManager;
    private activePayments: Set<string> = new Set();

    constructor(config: PaymentConfig) {
        this.config = config;
        this.eventEmitter = new EventEmitter();
        this.connectionManager = new ConnectionManager(config, this.eventEmitter);

        // Set up event listener
        this.eventEmitter.on('payment.event', this.handlePaymentEvent.bind(this));
    }

    private handlePaymentEvent(event: PaymentEvent): void {
        // Forward the event to the appropriate listeners
        this.eventEmitter.emit(event.type, event.payload);
    }

    async initialize(): Promise<void> {
        await this.connectionManager.connect();
    }

    async createPayment(details: PaymentDetails): Promise<PaymentSession> {
        const { signature, timestamp } = signRequest(details, this.config.apiKey);

        const response = await fetch(`${this.config.apiUrl}/v1/payments`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Client-ID': this.config.clientId,
                'X-Signature': signature,
                'X-Timestamp': timestamp.toString()
            },
            body: JSON.stringify(details)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to create payment');
        }

        const paymentSession = await response.json() as PaymentSession;

        // Subscribe to updates for this payment
        this.activePayments.add(paymentSession.id);
        await this.connectionManager.subscribe(paymentSession.id);

        return paymentSession;
    }

    async getPaymentStatus(paymentId: string): Promise<PaymentSession> {
        const response = await fetch(`${this.config.apiUrl}/v1/payments/${paymentId}/status`, {
            headers: {
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Client-ID': this.config.clientId
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to get payment status');
        }

        return response.json();
    }

    async cancelPayment(paymentId: string): Promise<void> {
        const { signature, timestamp } = signRequest(
            { paymentId },
            this.config.apiKey
        );

        const response = await fetch(`${this.config.apiUrl}/v1/payments/${paymentId}/cancel`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'X-Client-ID': this.config.clientId,
                'X-Signature': signature,
                'X-Timestamp': timestamp.toString()
            }
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.message || 'Failed to cancel payment');
        }
    }

    onPaymentSuccess(callback: PaymentEventCallback): () => void {
        this.eventEmitter.on('payment.success', callback);
        return () => this.eventEmitter.off('payment.success', callback);
    }

    onPaymentFailure(callback: PaymentEventCallback): () => void {
        this.eventEmitter.on('payment.failure', callback);
        return () => this.eventEmitter.off('payment.failure', callback);
    }

    onPaymentProcessing(callback: PaymentEventCallback): () => void {
        this.eventEmitter.on('payment.processing', callback);
        return () => this.eventEmitter.off('payment.processing', callback);
    }

    onError(callback: (error: Error) => void): () => void {
        this.eventEmitter.on('error', callback);
        return () => this.eventEmitter.off('error', callback);
    }

    async cleanup(): Promise<void> {
        // Unsubscribe from all active payments
        for (const paymentId of this.activePayments) {
            await this.connectionManager.unsubscribe(paymentId);
        }

        // Disconnect the connection manager
        await this.connectionManager.disconnect();

        // Clean up event listeners
        this.eventEmitter.removeAllListeners();

        // Clear active payments set
        this.activePayments.clear();
    }
}