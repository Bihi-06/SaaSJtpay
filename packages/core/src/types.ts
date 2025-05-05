export interface PaymentConfig {
    apiKey: string;
    clientId: string;
    apiUrl: string;
    webhookSecret?: string;
}

export interface PaymentDetails {
    amount: number;
    currency: string;
    description: string;
    customerId?: string;
    returnUrl?: string;
    metadata?: Record<string, any>;
}

export interface PaymentSession {
    id: string;
    status: PaymentStatus;
    paymentUrl?: string;
    expiresAt: string;
}

export type PaymentStatus = 'pending' | 'processing' | 'completed' | 'failed' | 'cancelled';

export interface PaymentResult {
    id: string;
    status: PaymentStatus;
    amount: number;
    currency: string;
    createdAt: string;
    completedAt?: string;
    metadata?: Record<string, any>;
}

export interface PaymentError {
    code: string;
    message: string;
    paymentId?: string;
    details?: Record<string, any>;
}

export interface PaymentEvent {
    type: 'payment.success' | 'payment.failure' | 'payment.processing' | 'error';
    payload: PaymentResult | PaymentError;
}

export type PaymentEventCallback = (event: PaymentEvent) => void;