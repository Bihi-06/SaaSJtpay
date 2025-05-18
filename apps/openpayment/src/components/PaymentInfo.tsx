
import React from "react";
import { Receipt } from "lucide-react";

interface PaymentInfoProps {
  paymentData: {
    orderNumber: string;
    merchant: string;
    merchantWebsite: string;
    amount: string;
  };
}

const PaymentInfo: React.FC<PaymentInfoProps> = ({ paymentData }) => {
  return (
    <div>
      <h2 className="text-xl font-semibold text-payment-orange mb-4 flex items-center gap-2">
        <Receipt className="h-5 w-5" />
        Informations de votre paiement
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-8">
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Commande :</p>
          <p className="text-base font-medium overflow-hidden text-ellipsis">{paymentData.orderNumber}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Commerçant :</p>
          <p className="text-base font-medium">{paymentData.merchant}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Site web commerçant :</p>
          <p className="text-base font-medium text-blue-600">{paymentData.merchantWebsite}</p>
        </div>
        <div className="space-y-1">
          <p className="text-sm font-medium text-gray-500">Montant à payer :</p>
          <p className="text-lg font-bold text-red-600">{paymentData.amount}</p>
        </div>
      </div>
    </div>
  );
};

export default PaymentInfo;
