import { BaseConnection } from './ConnectionStrategy';
import { PaymentConfig, PaymentEvent, PaymentStatus } from '../types';
import { EventEmitter } from '../EventEmitter';

export class PollingConnection extends BaseConnection {
    private pollingIntervals: Record<string, any> = {};
    private basePollingInterval = 3000; // 3 seconds initially
    private maxPollingInterval = 30000; // Max 30 seconds

    constructor(config: PaymentConfig, eventEmitter: EventEmitter) {
        super(config, eventEmitter);
    }

    async connect(): Promise<void> {
        this.connected = true;
        return Promise.resolve();
    }

    async disconnect(): Promise<void> {
        Object.keys(this.pollingIntervals).forEach(paymentId => {
            this.stopPollingForPayment(paymentId);
        });
        this.connected = false;
        return Promise.resolve();
    }

    async subscribe(paymentId: string): Promise<void> {
        if (!this.connected) {
            await this.connect();
        }

        this.subscriptions.add(paymentId);
        this.startPollingForPayment(paymentId);
        return Promise.resolve();
    }

    async unsubscribe(paymentId: string): Promise<void> {
        this.subscriptions.delete(paymentId);
        this.stopPollingForPayment(paymentId);
        return Promise.resolve();
    }

    private startPollingForPayment(paymentId: string): void {
        if (this.pollingIntervals[paymentId]) {
            return; // Already polling for this payment
        }

        let attempt = 0;
        let lastStatus: PaymentStatus | null = null;

        const poll = async () => {
            try {
                const response = await fetch(`${this.config.apiUrl}/v1/payments/${paymentId}/status`, {
                    headers: {
                        'Authorization': `Bearer ${this.config.apiKey}`,
                        'X-Client-ID': this.config.clientId
                    }
                });

                if (!response.ok) {
                    throw new Error(`Failed to fetch payment status: ${response.statusText}`);
                }

                const data = await response.json();

                // Only emit event if status has changed
                if (data.status !== lastStatus) {
                    lastStatus = data.status;

                    const event: PaymentEvent = {
                        type: this.mapStatusToEventType(data.status),
                        payload: data
                    };

                    this.handleEvent(event);
                }

                // If payment has reached a terminal state, stop polling
                if (['completed', 'failed', 'cancelled'].includes(data.status)) {
                    this.stopPollingForPayment(paymentId);
                } else {
                    // Exponential backoff for polling interval
                    attempt++;
                    const interval = Math.min(
                        this.basePollingInterval * Math.pow(1.5, attempt),
                        this.maxPollingInterval
                    );

                    this.pollingIntervals[paymentId] = setTimeout(poll, interval);
                }
            } catch (error) {
                console.error('Error polling for payment status:', error);

                // If we encounter an error, continue polling but back off
                attempt++;
                const interval = Math.min(
                    this.basePollingInterval * Math.pow(1.5, attempt),
                    this.maxPollingInterval
                );

                this.pollingIntervals[paymentId] = setTimeout(poll, interval);
            }
        };

        // Start polling immediately
        poll();
    }

    private stopPollingForPayment(paymentId: string): void {
        if (this.pollingIntervals[paymentId]) {
            clearTimeout(this.pollingIntervals[paymentId]);
            delete this.pollingIntervals[paymentId];
        }
    }

    private mapStatusToEventType(status: PaymentStatus): PaymentEvent['type'] {
        switch (status) {
            case 'completed':
                return 'payment.success';
            case 'failed':
            case 'cancelled':
                return 'payment.failure';
            case 'processing':
                return 'payment.processing';
            default:
                return 'payment.processing';
        }
    }
}
