import { BaseConnection } from './ConnectionStrategy';
import { PaymentConfig, PaymentEvent } from '../types';
import { EventEmitter } from '../EventEmitter';

export class WebSocketConnection extends BaseConnection {
    private ws: WebSocket | null = null;
    private reconnectAttempts = 0;
    private maxReconnectAttempts = 5;
    private reconnectTimeoutId: any = null;

    constructor(config: PaymentConfig, eventEmitter: EventEmitter) {
        super(config, eventEmitter);
    }

    async connect(): Promise<void> {
        if (this.connected) return;

        return new Promise((resolve, reject) => {
            try {
                const wsUrl = `${this.config.apiUrl.replace('http', 'ws')}/v1/events?apiKey=${encodeURIComponent(this.config.apiKey)}&clientId=${encodeURIComponent(this.config.clientId)}`;
                this.ws = new WebSocket(wsUrl);

                this.ws.onopen = () => {
                    this.connected = true;
                    this.reconnectAttempts = 0;
                    resolve();
                };

                this.ws.onmessage = (event) => {
                    try {
                        const paymentEvent = JSON.parse(event.data) as PaymentEvent;
                        this.handleEvent(paymentEvent);
                    } catch (err) {
                        console.error('Error processing WebSocket message:', err);
                    }
                };

                this.ws.onclose = () => {
                    this.connected = false;
                    this.attemptReconnect();
                };

                this.ws.onerror = (error) => {
                    console.error('WebSocket error:', error);
                    if (!this.connected) {
                        reject(error);
                    }
                };
            } catch (error) {
                reject(error);
            }
        });
    }

    private attemptReconnect(): void {
        if (this.reconnectAttempts >= this.maxReconnectAttempts) {
            console.error('Maximum reconnection attempts reached');
            return;
        }

        const backoffTime = Math.min(1000 * Math.pow(2, this.reconnectAttempts), 30000);
        this.reconnectAttempts++;

        console.log(`Attempting to reconnect in ${backoffTime}ms (attempt ${this.reconnectAttempts})`);

        this.reconnectTimeoutId = setTimeout(() => {
            this.connect().catch(err => {
                console.error('Reconnection failed:', err);
            });
        }, backoffTime);
    }

    async disconnect(): Promise<void> {
        if (this.reconnectTimeoutId) {
            clearTimeout(this.reconnectTimeoutId);
            this.reconnectTimeoutId = null;
        }

        if (this.ws && this.connected) {
            return new Promise((resolve) => {
                if (this.ws) {
                    this.ws.onclose = () => {
                        this.connected = false;
                        this.ws = null;
                        resolve();
                    };
                    this.ws.close();
                } else {
                    resolve();
                }
            });
        }
        return Promise.resolve();
    }

    async subscribe(paymentId: string): Promise<void> {
        if (!this.connected) {
            await this.connect();
        }

        if (this.ws && this.connected) {
            this.subscriptions.add(paymentId);
            this.ws.send(JSON.stringify({
                type: 'subscribe',
                paymentId
            }));
        }
    }

    async unsubscribe(paymentId: string): Promise<void> {
        if (this.ws && this.connected) {
            this.subscriptions.delete(paymentId);
            this.ws.send(JSON.stringify({
                type: 'unsubscribe',
                paymentId
            }));
        }
    }
}