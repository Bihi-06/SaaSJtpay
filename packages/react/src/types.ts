import {
    PaymentConfig as CorePaymentConfig,
    PaymentDetails,
    PaymentSession,
    PaymentResult,
    PaymentError,
    PaymentStatus
} from '@saas-payment/core';

export interface PaymentMessage {
    type: 'success' | 'error' | 'info' | null;
    text: string | null;
}

export interface PaymentCallbacks {
    onSuccess?: (result: PaymentResult) => void;
    onFailure?: (error: PaymentError) => void;
    onProcessing?: (result: PaymentResult) => void;
}

export interface UseSaasPaymentOptions {
    autoReset?: boolean; // Auto reset messages after a timeout
    resetTimeout?: number; // Time in ms to reset messages (if autoReset is true)
}

// Re-export core types that React developers will need
export type {
    PaymentConfig,
    PaymentDetails,
    PaymentSession,
    PaymentResult,
    PaymentError,
    PaymentStatus
} from '@saas-payment/core';

// Extend PaymentConfig to add React-specific options
export interface ReactPaymentConfig extends CorePaymentConfig {
    // React-specific options could go here
    autoConnect?: boolean; // Whether to auto-connect on mount
}
