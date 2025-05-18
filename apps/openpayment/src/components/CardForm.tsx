
import React, { useState } from "react";
import { CreditCard } from "lucide-react";
import { Input } from "@/components/ui/input";

const CardForm = () => {
  const [cardNumber, setCardNumber] = useState("");
  
  // Format card number with spaces
  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const input = e.target.value.replace(/\D/g, "").substring(0, 16);
    const formatted = input.replace(/(\d{4})(?=\d)/g, "$1 ");
    setCardNumber(formatted);
  };

  // Generate years for the dropdown
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 10 }, (_, i) => currentYear + i);

  // Generate months for the dropdown
  const months = Array.from({ length: 12 }, (_, i) => {
    const month = i + 1;
    return month < 10 ? `0${month}` : `${month}`;
  });

  return (
    <div>
      <h2 className="text-xl font-semibold text-payment-orange mb-4 flex items-center gap-2">
        <CreditCard className="h-5 w-5" />
        Informations de votre carte
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="md:col-span-2">
          <label htmlFor="cardNumber" className="block text-sm font-medium text-gray-700 mb-1">
            N° carte bancaire
          </label>
          <div className="relative">
            <Input
              id="cardNumber"
              type="text"
              placeholder="Numéro de carte"
              value={cardNumber}
              onChange={handleCardNumberChange}
              className="pl-10 w-full focus:ring-payment-orange focus:border-payment-orange"
              required
            />
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          </div>
        </div>
        
        <div>
          <label htmlFor="expiryMonth" className="block text-sm font-medium text-gray-700 mb-1">
            Date d'expiration
          </label>
          <div className="grid grid-cols-2 gap-2">
            <select 
              id="expiryMonth" 
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-payment-orange focus:border-payment-orange"
              required
            >
              <option value="">Mois</option>
              {months.map((month) => (
                <option key={month} value={month}>
                  {month}
                </option>
              ))}
            </select>
            <select 
              id="expiryYear" 
              className="w-full border border-gray-300 rounded-md shadow-sm px-3 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-payment-orange focus:border-payment-orange"
              required
            >
              <option value="">Année</option>
              {years.map((year) => (
                <option key={year} value={year}>
                  {year}
                </option>
              ))}
            </select>
          </div>
        </div>
        
        <div>
          <label htmlFor="cvv" className="block text-sm font-medium text-gray-700 mb-1">
            CVV
          </label>
          <div className="relative">
            <Input
              id="cvv"
              type="text"
              placeholder="Code à 3 chiffres"
              maxLength={3}
              pattern="\d{3}"
              className="w-full focus:ring-payment-orange focus:border-payment-orange"
              required
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-400">
              CVV
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CardForm;
