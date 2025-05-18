// 'use client'; // Remove this line for Pages Router

// import React, { useState, useEffect } from "react";
// import { useRouter } from "next/router"; // Change to next/router instead of next/navigation
// import axios from 'axios';

// // Error component to display when there's an issue
// const ErrorDisplay = ({ message, retry }) => {
//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center justify-center">
//       <div className="bg-white p-8 shadow-md rounded-md text-center max-w-md w-full">
//         <div className="flex justify-center mb-4">
//           <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
//             <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
//             </svg>
//           </div>
//         </div>
//         <h2 className="text-xl font-bold text-gray-800 mb-2">Une erreur est survenue</h2>
//         <p className="text-gray-600 mb-6">{message || "Impossible de charger les informations de paiement. Veuillez réessayer plus tard."}</p>
//         {retry && (
//           <button
//             onClick={retry}
//             className="bg-[#F37021] hover:bg-[#e05d0d] text-white py-2 px-4 rounded-md"
//           >
//             Réessayer
//           </button>
//         )}
//       </div>
//       <footer className="mt-10 text-center text-xs text-gray-500">
//         Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
//         <a href="https://naps.ma" className="text-[#F37021] hover:underline">
//           naps.ma
//         </a>
//       </footer>
//     </div>
//   );
// };

// // Modified for Pages Router approach
// const PaymentPage = () => {
//   const router = useRouter();
//   // In Pages Router, we get the token directly from router.query
//   const { token } = router.query;

//   console.log("Token from router.query:", token);

//   // States
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [isLoading, setIsLoading] = useState(true);
//   const [error, setError] = useState<string | null>(null);
//   const [paymentData, setPaymentData] = useState({
//     orderNumber: "",
//     merchant: "",
//     merchantWebsite: "",
//     amount: "",
//     currency: ""
//   });

//   // Form states
//   const [cardNumber, setCardNumber] = useState('');
//   const [expiryYear, setExpiryYear] = useState('');
//   const [expiryMonth, setExpiryMonth] = useState('');
//   const [cvv, setCvv] = useState('');
//   const [saveCard, setSaveCard] = useState(false);
//   const [acceptTerms, setAcceptTerms] = useState(false);
//   const [showToast, setShowToast] = useState(false);
//   const [toastMessage, setToastMessage] = useState('');
//   const [toastType, setToastType] = useState('');

//   const showNotification = (message, type) => {
//     setToastMessage(message);
//     setToastType(type);
//     setShowToast(true);
//     setTimeout(() => setShowToast(false), 3000);
//   };

//   // Fetch payment info based on token
//   const fetchPaymentInfo = async () => {
//     // Important: In Pages Router, router.query may be empty on initial render
//     // Check if router is ready and token exists
//     if (!router.isReady || !token) {
//       if (router.isReady && !token) {
//         console.log("Token is missing");
//         setError("Token de paiement manquant");
//         setIsLoading(false);
//       }
//       return;
//     }

//     setIsLoading(true);
//     setError(null);

//     try {
//       const response = await axios.post('/api/payment-info', { token });

//       console.log("Response data from backend:", response.data);

//       if (response.data && response.data.paymentInfo) {
//         setPaymentData({
//           orderNumber: response.data.paymentInfo.orderNumber || "",
//           merchant: response.data.paymentInfo.merchant || "",
//           merchantWebsite: response.data.paymentInfo.merchantWebsite || "",
//           amount: response.data.paymentInfo.amount || "",
//           currency: response.data.paymentInfo.currency || "DH"
//         });
//         setIsLoading(false);
//       } else {
//         throw new Error("Format de réponse invalide");
//       }
//     } catch (err) {
//       console.error("Error fetching payment info:", err);
//       const errorMessage = err.response?.data?.error || "Impossible de charger les informations de paiement";
//       setError(errorMessage);
//       setIsLoading(false);
//     }
//   };

//   useEffect(() => {
//     // In Pages Router, we need to wait for router to be ready
//     if (router.isReady) {
//       console.log("Router is ready, token:", token);
//       fetchPaymentInfo();
//     }
//   }, [router.isReady, token]); // Add router.isReady as dependency

//   const handlePayment = (e) => {
//     e.preventDefault();

//     if (!acceptTerms) {
//       showNotification("Veuillez accepter les conditions générales d'utilisation", "error");
//       return;
//     }

//     setIsSubmitting(true);

//     // Format card data
//     const paymentPayload = {
//       token,
//       cardHolderName: "Nom de l'utilisateur", // Placeholder for card holder name
//       cardNumber: cardNumber.replace(/\s/g, ''),
//       expiryDate: `${expiryMonth}/${expiryYear.toString().slice(-2)}`, // Combined month/year format
//       cvv,
//       saveCard
//     };

//     // Process payment
//     axios.post('/api/payment-process', paymentPayload)
//       .then(response => {
//         // Handle success
//         if (typeof token === 'string') {
//           localStorage.setItem('token', token);
//           localStorage.setItem('cardToken', response.data.validationToken);
//         } else {
//           console.error("Token is not a valid string:", token);
//         }
//         const redirectUrl = `/otp-verification/${response.data.validationToken}`;
//         router.push(redirectUrl);
//       })
//       .catch(error => {
//         // Handle error
//         console.error("Payment error:", error);
//         const errorMessage = error.response?.data?.error || "Erreur lors du traitement du paiement";
//         showNotification(errorMessage, "error");
//         setIsSubmitting(false);
//       });
//   };

//   const handleCancel = () => {
//     showNotification('Votre transaction a été annulée.', 'error');
//   };

//   // Card number formatting
//   const formatCardNumber = (value) => {
//     // Remove all non-digit characters
//     const digits = value.replace(/\D/g, '');

//     // Add space after every 4 digits
//     let formatted = '';
//     for (let i = 0; i < digits.length; i++) {
//       if (i > 0 && i % 4 === 0) {
//         formatted += ' ';
//       }
//       formatted += digits[i];
//     }

//     // Limit to 19 digits (16 + 3 spaces)
//     return formatted.slice(0, 19);
//   };

//   // Generate year options for expiry date
//   const currentYear = new Date().getFullYear();
//   const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);

//   // Generate month options
//   const monthOptions = Array.from({ length: 12 }, (_, i) => {
//     const month = i + 1;
//     return month < 10 ? `0${month}` : `${month}`;
//   });

//   // If there's an error, show the error component instead of the full page
//   if (error) {
//     return <ErrorDisplay message={error} retry={fetchPaymentInfo} />;
//   }

//   return (
//     <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
//       <div className="w-full max-w-2xl mx-auto">
//         {/* Logo and Header */}
//         <div className="flex flex-col items-center mb-8">
//           <div className="w-32 h-16 mb-4 relative flex justify-end">
//             <div className="text-right text-xs text-gray-500">Powered by</div>
//             <div className="w-20">
//               <svg viewBox="0 0 160 80" className="w-full h-full">
//                 <rect width="150" height="70" rx="10" fill="#F37021" />
//                 <text x="30" y="45" fontFamily="Arial" fontSize="30" fontWeight="bold" fill="white">NAPS</text>
//               </svg>
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-center text-[#F37021]">
//             Espace de paiement en ligne
//           </h1>
//         </div>

//         {/* Payment Information Card */}
//         {isLoading ? (
//           <div className="bg-white p-6 shadow-md rounded-md mb-6 border border-gray-200 flex justify-center items-center min-h-[120px]">
//             <div className="h-8 w-8 animate-spin rounded-full border-4 border-[#F37021] border-t-transparent"></div>
//           </div>
//         ) : (
//           <div className="bg-white p-6 shadow-md rounded-md mb-6 border border-gray-200">
//             <h2 className="text-xl font-medium text-[#F37021] mb-4">Informations de votre paiement</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//               <div>
//                 <div className="flex mb-2">
//                   <span className="font-medium mr-2">Commande :</span>
//                   <span>{paymentData.orderNumber.slice(-10)}</span>
//                 </div>
//                 <div className="flex mb-2">
//                   <span className="font-medium mr-2">Site web :</span>
//                   <span>{paymentData.merchantWebsite.slice(0, 13)}.com</span>
//                 </div>
//               </div>
//               <div>
//                 <div className="flex mb-2">
//                   <span className="font-medium mr-2">Commerçant :</span>
//                   <span>{paymentData.merchant}</span>
//                 </div>
//                 <div className="flex mb-2">
//                   <span className="font-medium mr-2">Montant à payer :</span>
//                   <span className="text-[#F37021]">{paymentData.amount} {paymentData.currency}</span>
//                 </div>
//               </div>
//             </div>
//           </div>
//         )}

//         {/* Card Information Form */}
//         <form onSubmit={handlePayment}>
//           <div className="bg-white p-6 shadow-md rounded-md mb-6 border border-gray-200">
//             <h2 className="text-xl font-medium text-[#F37021] mb-4">Informations de votre carte</h2>

//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">N° carte bancaire</label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F37021]"
//                   placeholder="Numéro de carte"
//                   value={cardNumber}
//                   onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
//                   maxLength={19}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">CVV</label>
//                 <input
//                   type="text"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F37021]"
//                   placeholder="Code à 3 chiffres"
//                   maxLength={3}
//                   value={cvv}
//                   onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
//                   required
//                 />
//               </div>
//               <div>
//                 <label className="block mb-2 font-medium text-gray-700">Date d'expiration</label>
//                 <div className="grid grid-cols-2 gap-2">
//                   <select
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F37021]"
//                     value={expiryYear}
//                     onChange={(e) => setExpiryYear(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Année</option>
//                     {yearOptions.map((year) => (
//                       <option key={year} value={year}>{year}</option>
//                     ))}
//                   </select>

//                   <select
//                     className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-[#F37021]"
//                     value={expiryMonth}
//                     onChange={(e) => setExpiryMonth(e.target.value)}
//                     required
//                   >
//                     <option value="" disabled>Mois</option>
//                     {monthOptions.map((month) => (
//                       <option key={month} value={month}>{month}</option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>

//             <div className="mt-6 space-y-4">
//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="saveCard"
//                   className="w-4 h-4 text-[#F37021] border-gray-300 rounded focus:ring-[#F37021]"
//                   checked={saveCard}
//                   onChange={(e) => setSaveCard(e.target.checked)}
//                 />
//                 <label htmlFor="saveCard" className="text-sm font-medium text-gray-700">
//                   Sauvegarder la carte
//                 </label>
//               </div>

//               <div className="flex items-center gap-2">
//                 <input
//                   type="checkbox"
//                   id="terms"
//                   className="w-4 h-4 text-[#F37021] border-gray-300 rounded focus:ring-[#F37021]"
//                   checked={acceptTerms}
//                   onChange={(e) => setAcceptTerms(e.target.checked)}
//                   required
//                 />
//                 <label htmlFor="terms" className="text-sm font-medium text-gray-700">
//                   J'ai lu et j'accepte{" "}
//                   <a href="#" className="text-[#F37021] hover:underline">
//                     les conditions générales d'utilisation
//                   </a>
//                 </label>
//               </div>

//               <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 p-3 rounded-md">
//                 <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 text-green-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
//                 </svg>
//                 <p>Toutes vos données personnelles sont cryptées et sécurisées</p>
//               </div>
//             </div>
//           </div>

//           <div className="flex flex-col sm:flex-row gap-4 justify-end mt-6">
//             <button
//               type="button"
//               className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-md flex items-center justify-center order-2 sm:order-1"
//               onClick={handleCancel}
//             >
//               <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                 <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//               </svg>
//               Annuler
//             </button>
//             <button
//               type="submit"
//               className="bg-[#F37021] hover:bg-[#e05d0d] text-white py-2 px-4 rounded-md flex items-center justify-center order-1 sm:order-2"
//               disabled={isSubmitting || isLoading}
//             >
//               {isSubmitting ? (
//                 <>
//                   <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
//                   Traitement...
//                 </>
//               ) : (
//                 <>
//                   <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//                     <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
//                   </svg>
//                   Payer
//                 </>
//               )}
//             </button>
//           </div>
//         </form>

//         {/* Toast Notification */}
//         {showToast && (
//           <div className={`fixed bottom-4 right-4 px-4 py-2 rounded-md ${toastType === 'error' ? 'bg-red-500' : 'bg-green-500'
//             } text-white shadow-lg z-50`}>
//             {toastMessage}
//           </div>
//         )}

//         {/* Footer */}
//         <footer className="mt-10 text-center text-xs text-gray-500">
//           Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
//           <a href="https://naps.ma" className="text-[#F37021] hover:underline">
//             naps.ma
//           </a>
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default PaymentPage;


'use client';

import React, { useState, useEffect } from "react";
import { useRouter } from "next/router";
import axios from 'axios';

// Types
interface PaymentDataType {
  orderNumber: string;
  merchant: string;
  merchantWebsite: string;
  amount: string;
  currency: string;
}

interface ErrorDisplayProps {
  message?: string;
  retry?: () => void;
}

// Toast notification types
type ToastType = 'success' | 'error' | 'info';

// Error component to display when there's an issue
const ErrorDisplay: React.FC<ErrorDisplayProps> = ({ message, retry }) => {
  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 flex flex-col items-center justify-center">
      <div className="bg-white p-8 shadow-lg rounded-lg text-center max-w-md w-full">
        <div className="flex justify-center mb-6">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
        <h2 className="text-2xl font-bold text-gray-800 mb-3">Une erreur est survenue</h2>
        <p className="text-gray-600 mb-8">{message || "Impossible de charger les informations de paiement. Veuillez réessayer plus tard."}</p>
        {retry && (
          <button
            onClick={retry}
            className="bg-[#F37021] hover:bg-[#e05d0d] text-white py-3 px-6 rounded-lg transition-colors duration-300 font-medium"
          >
            Réessayer
          </button>
        )}
      </div>
      <footer className="mt-12 text-center text-sm text-gray-500">
        Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
        <a href="https://naps.ma" className="text-[#F37021] hover:underline">
          naps.ma
        </a>
      </footer>
    </div>
  );
};

// Toast Notification Component
const Toast: React.FC<{ message: string; type: ToastType }> = ({ message, type }) => {
  const bgColor =
    type === 'success' ? 'bg-green-500' :
      type === 'error' ? 'bg-red-500' :
        'bg-blue-500';

  return (
    <div className={`fixed bottom-4 right-4 px-5 py-3 rounded-lg ${bgColor} text-white shadow-xl z-50 flex items-center`}>
      {type === 'success' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      )}
      {type === 'error' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {type === 'info' && (
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      )}
      {message}
    </div>
  );
};

const PaymentPage: React.FC = () => {
  const router = useRouter();

  // States
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [paymentData, setPaymentData] = useState<PaymentDataType>({
    orderNumber: "",
    merchant: "",
    merchantWebsite: "",
    amount: "",
    currency: ""
  });

  // Form states
  const [cardHolderName, setCardHolderName] = useState<string>('');
  const [cardNumber, setCardNumber] = useState<string>('');
  const [expiryYear, setExpiryYear] = useState<string>('');
  const [expiryMonth, setExpiryMonth] = useState<string>('');
  const [cvv, setCvv] = useState<string>('');
  const [saveCard, setSaveCard] = useState<boolean>(false);
  const [acceptTerms, setAcceptTerms] = useState<boolean>(false);
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [toastType, setToastType] = useState<ToastType>('info');

  // Card type indicators
  const [cardType, setCardType] = useState<string>('');

  useEffect(() => {
    const { token } = router.query;
    if (token) {
      setToken(token as string);
      console.log("Token from URL:", token);
    } else {
      console.log("Token is missing");
      setError("Token de paiement manquant");
      setIsLoading(false);
    }
  }, [router.query]);

  useEffect(() => {
    if (token) {
      fetchPaymentInfo();
    }
  }, [token]);

  const showNotification = (message: string, type: ToastType) => {
    setToastMessage(message);
    setToastType(type);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  // Fetch payment info based on token
  const fetchPaymentInfo = async () => {
    if (!token) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await axios.post('/api/payment-info', { token });

      console.log("Response data from backend:", response.data);

      if (response.data && response.data.paymentInfo) {
        setPaymentData({
          orderNumber: response.data.paymentInfo.orderNumber || "",
          merchant: response.data.paymentInfo.merchant || "",
          merchantWebsite: response.data.paymentInfo.merchantWebsite || "",
          amount: response.data.paymentInfo.amount || "",
          currency: response.data.paymentInfo.currency || "DH"
        });
        setIsLoading(false);
      } else {
        throw new Error("Format de réponse invalide");
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      console.error("Error fetching payment info:", err);
      const errorMessage = err.response?.data?.error || "Impossible de charger les informations de paiement";
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handlePayment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!acceptTerms) {
      showNotification("Veuillez accepter les conditions générales d'utilisation", "error");
      return;
    }

    setIsSubmitting(true);

    // Format card data
    const paymentPayload = {
      token,
      cardHolderName,
      cardNumber: cardNumber.replace(/\s/g, ''),
      expiryDate: `${expiryMonth}/${expiryYear.toString().slice(-2)}`, // Combined month/year format
      cvv,
      saveCard
    };

    // Process payment
    axios.post('/api/payment-process', paymentPayload)
      .then(response => {
        // Handle success
        if (typeof token === 'string') {
          localStorage.setItem('token', token);
          localStorage.setItem('cardToken', response.data.validationToken);
        } else {
          console.error("Token is not a valid string:", token);
        }
        showNotification("Redirection vers la vérification OTP...", "success");

        setTimeout(() => {
          const redirectUrl = `/otp-verification`;
          router.push(redirectUrl);
        }, 1000);
      })
      .catch(error => {
        // Handle error
        console.error("Payment error:", error);
        const errorMessage = error.response?.data?.error || "Erreur lors du traitement du paiement";
        showNotification(errorMessage, "error");
        setIsSubmitting(false);
      });
  };

  const handleCancel = () => {
    showNotification('Votre transaction a été annulée.', 'error');
    setTimeout(() => {
      // Navigate back or to cancel page
      router.push('/payment-canceled');
    }, 1500);
  };

  // Card number formatting and validation
  const formatCardNumber = (value: string): string => {
    // Remove all non-digit characters
    const digits = value.replace(/\D/g, '');

    // Add space after every 4 digits
    let formatted = '';
    for (let i = 0; i < digits.length; i++) {
      if (i > 0 && i % 4 === 0) {
        formatted += ' ';
      }
      formatted += digits[i];
    }

    // Identify card type based on first digits
    if (digits.startsWith('4')) {
      setCardType('visa');
    } else if (digits.startsWith('5')) {
      setCardType('mastercard');
    } else if (digits.startsWith('34') || digits.startsWith('37')) {
      setCardType('amex');
    } else {
      setCardType('');
    }

    // Limit to 19 digits (16 + 3 spaces)
    return formatted.slice(0, 19);
  };

  // Generate year options for expiry date
  const currentYear = new Date().getFullYear();
  const yearOptions = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Generate month options
  const monthOptions = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month < 10 ? `0${month}` : `${month}`;
  });

  // If there's an error, show the error component instead of the full page
  if (error) {
    return <ErrorDisplay message={error} retry={fetchPaymentInfo} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-12 px-4 sm:px-6 lg:px-8 flex flex-col items-center">
      <div className="w-full max-w-3xl mx-auto">
        {/* Logo and Header */}
        <div className="flex flex-col items-center mb-12">
          <div className="w-32 h-16 mb-6 relative flex justify-end">
            <div className="text-right text-xs text-gray-500 absolute -top-4 right-0">Powered by</div>
            <div className="w-24">
              <svg viewBox="0 0 160 80" className="w-full h-full drop-shadow-md">
                <rect width="150" height="70" rx="10" fill="#F37021" />
                <text x="30" y="45" fontFamily="Arial" fontSize="30" fontWeight="bold" fill="white">NAPS</text>
              </svg>
            </div>
          </div>
          <h1 className="text-4xl font-bold text-center text-gray-800">
            Espace de <span className="text-[#F37021]">paiement</span> en ligne
          </h1>
          <div className="h-1 w-24 bg-[#F37021] rounded-full mt-4"></div>
        </div>

        {/* Payment Information Card */}
        {isLoading ? (
          <div className="bg-white p-8 shadow-lg rounded-lg mb-8 border border-gray-200 flex justify-center items-center min-h-[160px]">
            <div className="flex flex-col items-center">
              <div className="h-10 w-10 animate-spin rounded-full border-4 border-[#F37021] border-t-transparent mb-4"></div>
              <p className="text-gray-500">Chargement des informations...</p>
            </div>
          </div>
        ) : (
          <div className="bg-white p-8 shadow-lg rounded-lg mb-8 border border-gray-200 transform transition-all hover:shadow-xl">
            <h2 className="text-2xl font-medium text-[#F37021] mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Informations de votre paiement
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 font-medium text-gray-600">Commande :</div>
                  <div className="bg-gray-50 px-3 py-2 rounded-md flex-1 text-gray-800">
                    {paymentData.orderNumber.slice(-10)}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 font-medium text-gray-600">Site web :</div>
                  <div className="bg-gray-50 px-3 py-2 rounded-md flex-1 text-gray-800">
                    {paymentData.merchantWebsite.slice(0, 13)}.com
                  </div>
                </div>
              </div>
              <div className="space-y-4">
                <div className="flex items-center">
                  <div className="w-32 font-medium text-gray-600">Commerçant :</div>
                  <div className="bg-gray-50 px-3 py-2 rounded-md flex-1 text-gray-800">
                    {paymentData.merchant}
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-32 font-medium text-gray-600">Montant :</div>
                  <div className="bg-green-50 px-3 py-2 rounded-md flex-1 text-green-700 font-bold">
                    {paymentData.amount} {paymentData.currency}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Card Information Form */}
        <form onSubmit={handlePayment}>
          <div className="bg-white p-8 shadow-lg rounded-lg mb-8 border border-gray-200 transform transition-all hover:shadow-xl">
            <h2 className="text-2xl font-medium text-[#F37021] mb-6 flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
              Informations de votre carte
            </h2>

            <div className="space-y-6">
              {/* Card holder name - new field */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">Nom et prénom du titulaire</label>
                <input
                  type="text"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent"
                  placeholder="Nom sur la carte"
                  value={cardHolderName}
                  onChange={(e) => setCardHolderName(e.target.value)}
                  required
                />
              </div>

              {/* Card number */}
              <div>
                <label className="block mb-2 font-medium text-gray-700">N° carte bancaire</label>
                <div className="relative">
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent pr-12"
                    placeholder="0000 0000 0000 0000"
                    value={cardNumber}
                    onChange={(e) => setCardNumber(formatCardNumber(e.target.value))}
                    maxLength={19}
                    required
                  />
                  {cardType && (
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      {cardType === 'visa' && (
                        <div className="w-10 h-6 bg-blue-600 rounded-md flex items-center justify-center text-white font-bold text-xs">VISA</div>
                      )}
                      {cardType === 'mastercard' && (
                        <div className="w-10 h-6 bg-red-600 rounded-md flex items-center justify-center text-white font-bold text-xs">MC</div>
                      )}
                      {cardType === 'amex' && (
                        <div className="w-10 h-6 bg-gray-600 rounded-md flex items-center justify-center text-white font-bold text-xs">AMEX</div>
                      )}
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Expiry date */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">Date d'expiration</label>
                  <div className="grid grid-cols-2 gap-3">
                    <select
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent appearance-none bg-white"
                      value={expiryMonth}
                      onChange={(e) => setExpiryMonth(e.target.value)}
                      required
                    >
                      <option value="" disabled>Mois</option>
                      {monthOptions.map((month) => (
                        <option key={month} value={month}>{month}</option>
                      ))}
                    </select>

                    <select
                      className="px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent appearance-none bg-white"
                      value={expiryYear}
                      onChange={(e) => setExpiryYear(e.target.value)}
                      required
                    >
                      <option value="" disabled>Année</option>
                      {yearOptions.map((year) => (
                        <option key={year} value={year}>{year}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* CVV */}
                <div>
                  <label className="block mb-2 font-medium text-gray-700">CVV</label>
                  <div className="relative">
                    <input
                      type="text"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F37021] focus:border-transparent"
                      placeholder="123"
                      maxLength={3}
                      value={cvv}
                      onChange={(e) => setCvv(e.target.value.replace(/\D/g, ''))}
                      required
                    />
                    <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mt-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="saveCard"
                    className="w-5 h-5 text-[#F37021] border-gray-300 rounded focus:ring-[#F37021]"
                    checked={saveCard}
                    onChange={(e) => setSaveCard(e.target.checked)}
                  />
                  <label htmlFor="saveCard" className="text-sm font-medium text-gray-700">
                    Sauvegarder la carte pour mes futurs achats
                  </label>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="terms"
                    className="w-5 h-5 text-[#F37021] border-gray-300 rounded focus:ring-[#F37021]"
                    checked={acceptTerms}
                    onChange={(e) => setAcceptTerms(e.target.checked)}
                    required
                  />
                  <label htmlFor="terms" className="text-sm font-medium text-gray-700">
                    J'ai lu et j'accepte{" "}
                    <a href="#" className="text-[#F37021] hover:underline">
                      les conditions générales d'utilisation
                    </a>
                  </label>
                </div>

                <div className="flex items-center gap-3 text-sm text-green-700 bg-green-50 p-4 rounded-lg mt-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-green-600 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                  </svg>
                  <p>Toutes vos données personnelles sont cryptées et sécurisées selon les normes PCI DSS</p>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-end mt-8">
            <button
              type="button"
              className="bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-3 px-6 rounded-lg flex items-center justify-center order-2 sm:order-1 transition-colors duration-300"
              onClick={handleCancel}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              Annuler
            </button>
            <button
              type="submit"
              className="bg-[#F37021] hover:bg-[#e05d0d] text-white font-medium py-3 px-6 rounded-lg flex items-center justify-center order-1 sm:order-2 transition-colors duration-300 shadow-md hover:shadow-lg"
              disabled={isSubmitting || isLoading}
            >
              {isSubmitting ? (
                <>
                  <div className="h-5 w-5 mr-3 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                  Traitement...
                </>
              ) : (
                <>
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                  </svg>
                  Payer maintenant
                </>
              )}
            </button>
          </div>
        </form>



        {/* Toast Notification */}
        {showToast && (
          <Toast message={toastMessage} type={toastType} />
        )}

        {/* Footer */}
        <footer className="mt-12 text-center">
          <div className="flex items-center justify-center mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-[#F37021] mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <span className="text-sm text-gray-600">Paiement sécurisé par Naps Payment</span>
          </div>
          <div className="text-sm text-gray-500">
            Copyright © {new Date().getFullYear()} Naps Tous droits réservés.{" "}
            <a href="https://naps.ma" className="text-[#F37021] hover:underline">
              naps.ma
            </a>
          </div>
        </footer>
      </div>
    </div>
  );
};

export default PaymentPage;