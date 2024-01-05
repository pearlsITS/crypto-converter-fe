import React, { useState, useEffect } from "react";
import axios from "../services/api";
import { useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";

function ConverterForm() {
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors }
  } = useForm({
  });
  const watchAllFields = watch();

  const [convertedAmount, setConvertedAmount] = useState(null);
  const [topCryptos, setTopCryptos] = useState([]);
  const [supportedVsCurrencies, setSupportedVsCurrencies] = useState([]);
  const [selectedCurrency, setSelectedCurrency] = useState("");

  useEffect(() => {
    fetchTopCryptos();
    fetchSupportedCurrency();
  }, []);

   useEffect(() => {
    reset((formValues) => ({
      ...formValues,
      targetCurrency: "usd",
    }));
  }, [supportedVsCurrencies]);

  const fetchTopCryptos = async () => {
    try {
      const response = await axios.get("/top-cryptos");
      setTopCryptos(response.data.topCryptos);
    } catch (error) {
      toast.error(error?.response?.statusText ? error?.response?.statusText :"Something went wrong" );
    }
  };

  const fetchSupportedCurrency = async () => {
    try {
      const response = await axios.get("/supported-vs-currencies");
      setSupportedVsCurrencies(response.data.supportedVsCurrencies);
    } catch (error) {
      toast.error(error?.response?.statusText ? error?.response?.statusText :  "Something went wrong");
    }
  };

  const onSubmit = async (data) => {
    try {
      const response = await axios.post("/convert", {
        sourceCrypto: data.sourceCrypto,
        amount: data.amount,
        targetCurrency: data.targetCurrency,
      });
      setConvertedAmount(response.data.convertedAmount);
      setSelectedCurrency(data.targetCurrency);
    } catch (error) {
      toast.error(error?.response?.statusText ? error?.response?.statusText : "Something went wrong");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-teal-400 to-purple-500">
      <div className="w-full max-w-md p-8 bg-gradient-to-br from-teal-200 to-purple-400  shadow-md rounded-md space-y-6 transform scale-105 transition-transform duration-300">
        <h1 className="text-3xl font-extrabold text-center text-gray-800 mb-6 font-serif">
          Currency Converter
        </h1>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Amount:
            </label>
            <input
              className={`form-input w-full ${
                errors.amount ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 border-solid border-2 focus:outline-none `}
              type="text"
              {...register("amount", {
                required: "Please enter amount",
                validate: (value) => {
                  if (value) {
                    value = 22;
                    return true;
                  }
                  return false;
                },
              })}
              onKeyPress={(event) => {
                if (!/[0-9]/.test(event.key)) {
                  event.preventDefault();
                }
              }}
            />
            {errors.amount && (
              <p className="text-red-600 text-xs mt-1">
                {errors.amount.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Source Crypto:
            </label>
            <select
              className={`form-select w-full ${
                errors.sourceCrypto ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 border-solid border-2 focus:outline-none`}
              {...register("sourceCrypto", {
                required: "Please select any crypto currency",
              })}
            >
              <option value="">Select Crypto</option>
              {topCryptos?.map((crypto) => (
                <option key={crypto.id} value={crypto.id}>
                  {crypto.name} ({crypto.symbol})
                </option>
              ))}
            </select>
            {errors.sourceCrypto && (
              <p className="text-red-600 text-xs mt-1">
                {errors.sourceCrypto.message}
              </p>
            )}
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-700">
              Target Currency:
            </label>
            <select
              className={`form-select w-full ${
                errors.targetCurrency ? "border-red-500" : "border-gray-300"
              } rounded-md p-2 focus:outline-none border-solid border-2`}
              {...register("targetCurrency", {
                required: "Please select any target currency",
              })}
            >
              <option value="">Select Target Currency</option>
              {supportedVsCurrencies?.map((currency) => (
                <option key={currency} value={currency}>
                  {currency}
                </option>
              ))}
            </select>
            {errors.targetCurrency && (
              <p className="text-red-600 text-xs mt-1">
                {errors.targetCurrency.message}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-800 focus:outline-none focus:shadow-outline-blue active:bg-blue-900"
          >
            Convert
          </button>
        </form>
        <div className="justify-between grid grid-cols-2 divide-x-0">
          <h2 className="text-lg font-semibold text-gray-700 col-span-1">
            Converted Amount:
          </h2>
          <div className="text-black grid grid-cols-3 divide-x bg-gray-300 opacity-90 col-span-1 rounded-md">
            <div className="text-center px-2">{selectedCurrency}</div>
            <div className="text-right px-2 col-span-2">{convertedAmount}</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConverterForm;
