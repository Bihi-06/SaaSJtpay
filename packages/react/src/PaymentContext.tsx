// src/PaymentContext.tsx
import React, { createContext, useContext, useState, useEffect, useRef, ReactNode } from 'react';
import {
  PaymentClient,
  PaymentSession,
  PaymentResult,
  PaymentError,
  PaymentDetails
} from '@saas-payment/core';
import { ReactPaymentConfig, PaymentCallbacks, PaymentMessage } from './types';

export interface PaymentContextValue {
  isLoading: boolean;
  message: PaymentMessage;
  createPayment: (details: PaymentDetails) => Promise<PaymentSession>;
  cancelPayment: (paymentId: string) => Promise<void>;
  getPaymentStatus: (paymentId: string) => Promise<PaymentSession>;
  resetMessage: () => void;
  client: PaymentClient | null;
}

// Create context with a default undefined value
const PaymentContext = createContext<PaymentContextValue | undefined>(undefined);

interface PaymentProviderProps {
  config: ReactPaymentConfig;
  children: ReactNode;
  onSuccess?: (result: PaymentResult) => void;
  onFailure?: (error: PaymentError) => void;
  onProcessing?: (result: PaymentResult) => void;
  autoResetMessages?: boolean;
  resetTimeout?: number;
}

export const PaymentProvider: React.FC<PaymentProviderProps> = ({
  config,
  children,
  onSuccess,
  onFailure,
  onProcessing,
  autoResetMessages = false,
  resetTimeout = 5000
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<PaymentMessage>({ type: null, text: null });
  const clientRef = useRef<PaymentClient | null>(null);
  const resetTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    // Initialize the payment client
    const client = new PaymentClient(config);
    clientRef.current = client;

    const initialize = async () => {
      try {
        if (config.autoConnect !== false) {
          await client.initialize();
        }
      } catch (err) {
        setMessage({
          type: 'error',
          text: err instanceof Error ? err.message : 'Failed to initialize payment client'
        });
      }
    };

    // Set up event handlers
    const successUnsubscribe = client.onPaymentSuccess((event: { payload: any; }) => {
      const result = event.payload as PaymentResult;
      setMessage({
        type: 'success',
        text: `Payment ${result.id} completed successfully!`
      });

      if (onSuccess) {
        onSuccess(result);
      }
    });

    const failureUnsubscribe = client.onPaymentFailure((event: { payload: any; }) => {
      const error = event.payload as PaymentError;
      setMessage({
        type: 'error',
        text: error.message || `Payment failed: ${error.code}`
      });

      if (onFailure) {
        onFailure(error);
      }
    });

    const processingUnsubscribe = client.onPaymentProcessing((event: { payload: any; }) => {
      const result = event.payload as PaymentResult;
      setMessage({
        type: 'info',
        text: `Payment ${result.id} is processing`
      });

      if (onProcessing) {
        onProcessing(result);
      }
    });

    const errorUnsubscribe = client.onError((err: { message: any; }) => {
      setMessage({
        type: 'error',
        text: err.message
      });
    });

    initialize();

    // Cleanup on unmount
    return () => {
      successUnsubscribe();
      failureUnsubscribe();
      processingUnsubscribe();
      errorUnsubscribe();

      if (resetTimeoutRef.current) {
        clearTimeout(resetTimeoutRef.current);
      }

      if (clientRef.current) {
        clientRef.current.cleanup();
      }
    };
  }, [config, onSuccess, onFailure, onProcessing]);

  // Auto-reset message after timeout if enabled
  useEffect(() => {
    if (autoResetMessages && message.text && resetTimeout > 0) {
      resetTimeoutRef.current = setTimeout(() => {
        resetMessage();
      }, resetTimeout);

      return () => {
        if (resetTimeoutRef.current) {
          clearTimeout(resetTimeoutRef.current);
        }
      };
    }
  }, [message, autoResetMessages, resetTimeout]);

  const createPayment = async (details: PaymentDetails): Promise<PaymentSession> => {
    if (!clientRef.current) {
      throw new Error('Payment client not initialized');
    }

    setIsLoading(true);
    setMessage({ type: null, text: null });

    try {
      const session = await clientRef.current.createPayment(details);
      return session;
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to create payment'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const cancelPayment = async (paymentId: string): Promise<void> => {
    if (!clientRef.current) {
      throw new Error('Payment client not initialized');
    }

    setIsLoading(true);
    setMessage({ type: null, text: null });

    try {
      await clientRef.current.cancelPayment(paymentId);
      setMessage({
        type: 'info',
        text: `Payment ${paymentId} cancelled`
      });
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to cancel payment'
      });
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  const getPaymentStatus = async (paymentId: string): Promise<PaymentSession> => {
    if (!clientRef.current) {
      throw new Error('Payment client not initialized');
    }

    try {
      return await clientRef.current.getPaymentStatus(paymentId);
    } catch (err) {
      setMessage({
        type: 'error',
        text: err instanceof Error ? err.message : 'Failed to get payment status'
      });
      throw err;
    }
  };

  const resetMessage = () => setMessage({ type: null, text: null });

  const value = {
    isLoading,
    message,
    createPayment,
    cancelPayment,
    getPaymentStatus,
    resetMessage,
    client: clientRef.current
  };

  return (
    <PaymentContext.Provider value={value}>
      {children}
    </PaymentContext.Provider>
  );
};

// Hook to use payment context
export const usePaymentContext = (): PaymentContextValue => {
  const context = useContext(PaymentContext);
  if (context === undefined) {
    throw new Error('usePaymentContext must be used within a PaymentProvider');
  }
  return context;
};