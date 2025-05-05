import React, { useState, useCallback, useEffect, useRef } from 'react';
import { PaymentProvider, usePaymentContext } from './PaymentContext';
import {
    ReactPaymentConfig,
    PaymentCallbacks,
    PaymentMessage,
    PaymentDetails,
    PaymentSession,
    UseSaasPaymentOptions
} from './types';

// Stand-alone hook for use with PaymentProvider
export const usePayment = () => {
    return usePaymentContext();
};

// Complete hook with embedded provider
export function useSaasPayment(
    config: ReactPaymentConfig,
    callbacks?: PaymentCallbacks,
    options?: UseSaasPaymentOptions
) {
    const [localMessage, setLocalMessage] = useState<PaymentMessage>({ type: null, text: null });
    const [localLoading, setLocalLoading] = useState(false);
    const [paymentSession, setPaymentSession] = useState<PaymentSession | null>(null);

    // Use these refs to hold the wrapped context functions
    const createPaymentRef = useRef<((details: PaymentDetails) => Promise<PaymentSession>) | null>(null);
    const cancelPaymentRef = useRef<((paymentId: string) => Promise<void>) | null>(null);
    const getPaymentStatusRef = useRef<((paymentId: string) => Promise<PaymentSession>) | null>(null);
    const resetMessageRef = useRef<(() => void) | null>(null);

    // Function to create a payment
    const createPayment = useCallback(async (details: PaymentDetails): Promise<PaymentSession> => {
        if (createPaymentRef.current) {
            setLocalLoading(true);
            try {
                const session = await createPaymentRef.current(details);
                setPaymentSession(session);
                return session;
            } finally {
                setLocalLoading(false);
            }
        } else {
            throw new Error('Payment system not initialized');
        }
    }, []);

    // Function to cancel a payment
    const cancelPayment = useCallback(async (paymentId: string): Promise<void> => {
        if (cancelPaymentRef.current) {
            setLocalLoading(true);
            try {
                await cancelPaymentRef.current(paymentId);
                // Update local session if it's the same payment
                if (paymentSession && paymentSession.id === paymentId) {
                    setPaymentSession({
                        ...paymentSession,
                        status: 'cancelled'
                    });
                }
            } finally {
                setLocalLoading(false);
            }
        } else {
            throw new Error('Payment system not initialized');
        }
    }, [paymentSession]);

    // Function to get payment status
    const getPaymentStatus = useCallback(async (paymentId: string): Promise<PaymentSession> => {
        if (getPaymentStatusRef.current) {
            const session = await getPaymentStatusRef.current(paymentId);
            // Update local session if it's the same payment
            if (paymentSession && paymentSession.id === paymentId) {
                setPaymentSession(session);
            }
            return session;
        } else {
            throw new Error('Payment system not initialized');
        }
    }, [paymentSession]);

    // Function to reset message
    const resetMessage = useCallback(() => {
        if (resetMessageRef.current) {
            resetMessageRef.current();
        }
        setLocalMessage({ type: null, text: null });
    }, []);

    // Auto-reset message if enabled
    useEffect(() => {
        if (options?.autoReset && localMessage.text) {
            const timeout = setTimeout(() => {
                resetMessage();
            }, options.resetTimeout || 5000);

            return () => clearTimeout(timeout);
        }
    }, [localMessage, options, resetMessage]);

    // Capture context functions when they're provided by PaymentContextCapture
    const captureContextFunctions = useCallback((
        createPaymentFn: (details: PaymentDetails) => Promise<PaymentSession>,
        cancelPaymentFn: (paymentId: string) => Promise<void>,
        getPaymentStatusFn: (paymentId: string) => Promise<PaymentSession>,
        resetMessageFn: () => void,
        contextMessage: PaymentMessage,
        isContextLoading: boolean
    ) => {
        createPaymentRef.current = createPaymentFn;
        cancelPaymentRef.current = cancelPaymentFn;
        getPaymentStatusRef.current = getPaymentStatusFn;
        resetMessageRef.current = resetMessageFn;

        // Update local state from context
        if (contextMessage.text) {
            setLocalMessage(contextMessage);
        }
        if (isContextLoading !== localLoading) {
            setLocalLoading(isContextLoading);
        }
    }, [localLoading]);

    // This component captures the context values and passes them up to the hook
    const PaymentContextCapture: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        const context = usePaymentContext();

        useEffect(() => {
            captureContextFunctions(
                context.createPayment,
                context.cancelPayment,
                context.getPaymentStatus,
                context.resetMessage,
                context.message,
                context.isLoading
            );
        }, [context]);

        return <>{children}</>;
    };

    // Component that will be rendered with the hook
    const Provider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
        return (
            <PaymentProvider
                config={config}
                onSuccess={callbacks?.onSuccess}
                onFailure={callbacks?.onFailure}
                onProcessing={callbacks?.onProcessing}
                autoResetMessages={options?.autoReset}
                resetTimeout={options?.resetTimeout}
            >
                <PaymentContextCapture>
                    {children}
                </PaymentContextCapture>
            </PaymentProvider>
        );
    };

    return {
        Provider,
        isLoading: localLoading,
        message: localMessage,
        paymentSession,
        createPayment,
        cancelPayment,
        getPaymentStatus,
        resetMessage
    };
}