import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, RefreshCcw, AlertCircle } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";
import axios, { AxiosError } from "axios";

interface ErrorDisplayProps {
  message?: string;
  retry?: () => void;
}

// Error component to display when there's an issue
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <AlertCircle className="h-10 w-10 text-red-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
        <p className="text-gray-600 mb-6">{message || "Impossible de charger les informations de paiement. Veuillez réessayer plus tard."}</p>
        {retry && (
          <button
            onClick={retry}
            className="bg-[#F37021] hover:bg-[#e05d0d] text-white py-2 px-4 rounded-md"
          >
            Réessayer
          </button>
        )}
      </div>
      <footer className="mt-10 text-center text-xs text-gray-500">
        Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
        <a href="https://naps.ma" className="text-[#F37021] hover:underline">
          naps.ma
        </a>
      </footer>
    </div>
  );
};

// Loading Spinner component
const Spinner: React.FC = () => (
  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
);

// Success component to display after successful OTP verification
const SuccessDisplay: React.FC<{ returnToClient: () => void }> = ({ returnToClient }) => {
  const [countdown, setCountdown] = useState(5);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          returnToClient();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [returnToClient]);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-8 shadow-md rounded-md text-center max-w-md w-full">
        <div className="flex justify-center mb-4">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <Check className="h-10 w-10 text-green-500" />
          </div>
        </div>
        <h2 className="text-xl font-bold text-gray-800 mb-2">Paiement réussi</h2>
        <p className="text-gray-600 mb-6">Votre transaction a été traitée avec succès.</p>
        <p className="text-sm text-gray-500">
          Redirection automatique dans {countdown} secondes...
        </p>
        <Button
          onClick={returnToClient}
          className="mt-4 bg-[#F37021] hover:bg-[#e05d0d] text-white"
        >
          Retourner maintenant
        </Button>
      </div>
      <footer className="mt-10 text-center text-xs text-gray-500">
        Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
        <a href="https://naps.ma" className="text-[#F37021] hover:underline">
          naps.ma
        </a>
      </footer>
    </div>
  );
};

interface PaymentResponse {
  validationToken: string;
  success: boolean;
  message?: string;
}

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(180); // 3 minutes
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const { toast } = useToast();
  const router = useRouter();

  // Ensure localStorage is only accessed on client side
  const [token, setToken] = useState<string | null>(null);
  const [cardToken, setCardToken] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  useEffect(() => {
    // Access localStorage only on client-side
    setToken(localStorage.getItem("token"));
    setCardToken(localStorage.getItem("cardToken"));
    setReturnUrl(localStorage.getItem("returnUrl") || "/");
  }, []);

  useEffect(() => {
    const timer = setInterval(() => {
      setRemainingTime((prev) => {
        if (prev <= 0) return 0;
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  const handleVerifyOtp = async (e: React.FormEvent): Promise<void> => {
    e.preventDefault();

    if (otp.length !== 6) {
      toast({
        title: "Erreur de validation",
        description: "Veuillez saisir un code OTP à 6 chiffres",
        variant: "destructive",
      });
      return;
    }

    if (!token || !cardToken) {
      setError("Informations de paiement manquantes. Veuillez réessayer.");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const paymentPayload = {
        token,
        cardToken,
        otp,
      };

      // Process payment
      const response = await axios.post<PaymentResponse>('/api/payment-otp', paymentPayload);

      if (response.data.success) {
        // Handle success
        if (response.data.validationToken) {
          localStorage.setItem('validationToken', response.data.validationToken);
        }

        toast({
          title: "Paiement réussi",
          description: "Votre transaction a été traitée avec succès.",
          variant: "default",
        });

        setSuccess(true);
      } else {
        throw new Error(response.data.message || "Erreur lors du traitement du paiement");
      }
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error ||
        (axiosError instanceof Error ? axiosError.message : "Erreur lors du traitement du paiement");

      toast({
        title: "Échec de la transaction",
        description: errorMessage,
        variant: "destructive",
      });

      setError(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendOtp = async (): Promise<void> => {
    if (!token || !cardToken) {
      setError("Informations de paiement manquantes. Veuillez réessayer.");
      return;
    }

    try {
      await axios.post('/api/resend-otp', { token, cardToken });
      setRemainingTime(180);
      toast({
        title: "Code OTP renvoyé",
        description: "Un nouveau code OTP a été envoyé à votre téléphone.",
      });
    } catch (error) {
      const axiosError = error as AxiosError<{ error: string }>;
      const errorMessage = axiosError.response?.data?.error || "Erreur lors de l'envoi du code OTP";

      toast({
        title: "Échec de l'envoi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const returnToClient = (): void => {
    // Clear payment data from localStorage
    localStorage.removeItem("token");
    localStorage.removeItem("cardToken");

    // Navigate back to the client page
    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      router.push("/");
    }
  };

  // If we're in a success state, show the success page
  if (success) {
    return <SuccessDisplay returnToClient={returnToClient} />;
  }

  // If no token is found, show error
  if (token === null && typeof window !== 'undefined') {
    return (
      <ErrorDisplay
        message="Aucun token trouvé. Veuillez vous reconnecter."
        retry={() => router.back()}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-md mx-auto">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-16 mb-4 relative">
            <svg viewBox="0 0 160 80" className="w-full h-full">
              <rect width="150" height="70" rx="10" fill="#F37021" />
              <text x="30" y="45" fontFamily="Arial" fontSize="30" fontWeight="bold" fill="white">NAPS</text>
            </svg>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold text-center text-[#F37021]">
            Vérification de sécurité
          </h1>
        </div>

        <Card className="bg-white p-6 shadow-lg rounded-lg mb-6 border-t-4 border-[#F37021]">
          {error && (
            <div className="mb-4 p-3 rounded-md bg-red-50 text-red-700 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-2 shrink-0 mt-0.5" />
              <p>{error}</p>
            </div>
          )}

          <form onSubmit={handleVerifyOtp} className="space-y-6">
            <div className="text-center">
              <h2 className="text-xl font-medium text-gray-900 mb-2">Code de vérification</h2>
              <p className="text-gray-500 mb-6">
                Veuillez saisir le code à 6 chiffres envoyé à votre numéro de téléphone
              </p>

              <div className="flex justify-center mb-8">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    <InputOTPSlot index={0} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={1} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={2} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={3} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={4} className="w-12 h-12 text-lg" />
                    <InputOTPSlot index={5} className="w-12 h-12 text-lg" />
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="text-sm text-gray-600 mb-4">
                Expire dans: <span className="font-bold">{formatTime(remainingTime)}</span>
              </div>

              <div className="flex justify-center">
                <Button
                  type="button"
                  variant="ghost"
                  className="text-[#F37021] hover:text-[#e05d0d] hover:bg-orange-50"
                  onClick={handleResendOtp}
                  disabled={remainingTime > 0 || isSubmitting}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {remainingTime > 0 ? "Renvoyer le code" : "Renvoyer le code OTP"}
                </Button>
              </div>
            </div>

            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md">
              <Check size={16} className="shrink-0 text-green-600" />
              <p>Cette étape permet de sécuriser votre paiement</p>
            </div>

            <Button
              type="submit"
              className="w-full text-white bg-[#F37021] hover:bg-[#e05d0d]"
              disabled={otp.length !== 6 || isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Vérification...
                </>
              ) : (
                <>
                  <Lock size={16} className="mr-2" />
                  Vérifier
                </>
              )}
            </Button>
          </form>
        </Card>

        <footer className="mt-10 text-center text-xs text-gray-500">
          Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
          <a href="https://naps.ma" className="text-[#F37021] hover:underline">
            naps.ma
          </a>
        </footer>
      </div>
    </div>
  );
};

export default OtpVerification;