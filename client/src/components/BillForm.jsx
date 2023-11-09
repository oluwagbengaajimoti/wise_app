import axios from "axios";
import { useState } from "react";
import Label from "./Label";
import InputField from "./InputField";
import card from "../assets/card.svg";
import { useMask } from "@react-input/mask";

export default function BillForm() {
  const [paymentId, setPaymentId] = useState("");
  const [errMsg, setErrMsg] = useState("");
  const [empty, setEmpty] = useState(false);
  const [loading, setLoading] = useState(false);
  const [payment, setPayment] = useState({
    price: "",
    currency: "AUD",
    invoiceNo: "",
    invoiceID: "",
    description: "",
    first_name: "",
    last_name: "",
    cardNo: "",
    exp: "",
    securityCode: "",
    billingCode: "",
    email: "",
  });
  const cardRef = useMask({
    mask: "____-____-____-____",
    replacement: { _: /\d/ },
  });
  const expRef = useMask({ mask: "__ / __", replacement: { _: /\d/ } });
  const priceRef = useMask({
    mask: "_______________",
    replacement: { _: /\d/ },
  });
  const NoRef = useMask({ mask: "_______________", replacement: { _: /\d/ } });
  const IdRef = useMask({ mask: "_______________", replacement: { _: /\d/ } });

  const createPayment = async () => {
    if (
      payment.price === 0 ||
      payment.currency === "" ||
      payment.first_name === "" ||
      payment.last_name === "" ||
      payment.cardNo === "" ||
      payment.exp === 0 ||
      payment.securityCode === "" ||
      payment.billingCode === "" ||
      payment.email === ""
    ) {
      setEmpty(true);
      return;
    }
    try {
      setErrMsg("");
      setLoading(true);
      const response = await axios.post(
        "http://localhost:5000/api/createPayment",
        {
          payment: payment,
        }
      );
      if (response.status === 200) {
        const { paymentId } = response.data.success;
        setPaymentId(paymentId);
        setErrMsg("");
        setLoading(false);
      } else {
        console.log(response.status, response.data);
        setErrMsg("Payment creation failed");
        setLoading(false);
      }
    } catch (error) {
      console.log(error);
      setErrMsg("The Bank info doesn't exist");
      setLoading(false);
    }
  };

  const onChange = (event) => {
    setEmpty(false);
    setPayment({ ...payment, [event.target.name]: event.target.value });
  };

  return (
    <>
      <form className="shadow-lg p-12">
        <div className="mb-6">
          <Label htmlFor="price" Lavel_name="Price" />
          <div className="relative mt-2 rounded-md shadow-sm">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <span className="text-gray-500 sm:text-sm">$</span>
            </div>
            <InputField
              type="text"
              name="price"
              id="price"
              classes="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full py-2.5 pr-2.5 pl-7 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
              placeholder="0.00"
              value={payment.price}
              onChange={(e) => onChange(e)}
              ref={priceRef}
            />
            <div className="absolute inset-y-0 right-0 flex items-center">
              <Label
                htmlFor="currency"
                Lavel_name="Currency"
                classes="sr-only"
              />
              <select
                id="currency"
                name="currency"
                value={payment.currency}
                onChange={(e) => onChange(e)}
                className="h-full rounded-md border-0 bg-transparent py-0 pl-2 pr-7 text-gray-500 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm"
              >
                <option>AUD</option>
                <option>USD</option>
                <option>CAD</option>
                <option>EUR</option>
              </select>
            </div>
          </div>
          {empty && <p className="text-red-700">Input is required</p>}
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label htmlFor="invoiceNo" Lavel_name="Invoice No (Optional)" />
            <InputField
              type="text"
              name="invoiceNo"
              id="invoiceNo"
              value={payment.invoiceNo}
              onChange={(e) => onChange(e)}
              placeholder="Invoice No (Optional)"
              ref={NoRef}
            />
          </div>
          <div>
            <Label htmlFor="invoiceID" Lavel_name="Invoice ID (Optional)" />
            <InputField
              type="text"
              name="invoiceID"
              id="invoiceID"
              value={payment.invoiceID}
              onChange={(e) => onChange(e)}
              placeholder="Invoice ID (Optional)"
              ref={IdRef}
            />
          </div>
        </div>
        <div className="mb-6">
          <Label
            htmlFor="description"
            Lavel_name="Order Description (Optional)"
          />
          <textarea
            type="text"
            id="description"
            name="description"
            value={payment.description}
            onChange={(e) => onChange(e)}
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Order Description (Optional)"
          />
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label htmlFor="first_name" Lavel_name="First name on card" />
            <InputField
              type="text"
              name="first_name"
              id="first_name"
              value={payment.first_name}
              onChange={(e) => onChange(e)}
              placeholder="John"
            />
            {empty && <p className="text-red-700">Input is required</p>}
          </div>
          <div>
            <Label htmlFor="last_name" Lavel_name="Last name on card" />
            <InputField
              type="text"
              name="last_name"
              id="last_name"
              value={payment.last_name}
              onChange={(e) => onChange(e)}
              placeholder="Doe"
            />
            {empty && <p className="text-red-700">Input is required</p>}
          </div>
        </div>
        <div className="mb-6">
          <div>
            <Label htmlFor="cardNo" Lavel_name="Card Number" />
            <div className="relative mb-6">
              <InputField
                type="text"
                name="cardNo"
                id="cardNo"
                value={payment.cardNo}
                onChange={(e) => onChange(e)}
                placeholder="0000-0000-0000-0000"
                ref={cardRef}
              />
              <div className="absolute inset-y-0 right-0 flex items-center pr-3.5 pointer-events-none">
                <img src={card} className="h-10 w-10" alt="card" />
              </div>
            </div>
          </div>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label htmlFor="exp" Lavel_name="Expiration Time" />
            <InputField
              type="text"
              name="exp"
              id="exp"
              value={payment.exp}
              onChange={(e) => onChange(e)}
              placeholder="MM / YY"
              ref={expRef}
            />
            {empty && <p className="text-red-700">Input is required</p>}
          </div>
          <div>
            <Label htmlFor="securityCode" Lavel_name="Security Code" />
            <InputField
              type="password"
              name="securityCode"
              id="securityCode"
              value={payment.securityCode}
              onChange={(e) => onChange(e)}
              placeholder="*************"
            />
            {empty && <p className="text-red-700">Input is required</p>}
          </div>
        </div>
        <div className="grid gap-6 mb-6 md:grid-cols-2">
          <div>
            <Label htmlFor="billingCode" Lavel_name="Billing Postcode" />
            <InputField
              type="text"
              name="billingCode"
              id="billingCode"
              value={payment.billingCode}
              onChange={(e) => onChange(e)}
              placeholder="Billing PostCode"
            />
            {empty && <p className="text-red-700">Input is required</p>}
          </div>
          <div>
            <Label htmlFor="email" Lavel_name="Email Address (Optional)" />
            <InputField
              type="email"
              name="email"
              id="email"
              value={payment.email}
              onChange={(e) => onChange(e)}
              placeholder="johndoe@gmail.com"
            />
          </div>
        </div>
        <button
          type="button"
          className="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm w-full sm:w-auto px-5 py-2.5 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800"
          onClick={createPayment}
        >
          {loading ? "Creating..." : "Create Payment"}
        </button>
        {paymentId && (
          <p className="text-blue-700">
            Payment created successfully with ID: {paymentId}
          </p>
        )}
        {errMsg && <p className="text-red-700">Error: {errMsg}</p>}
      </form>
      {/* <NotificationContainer /> */}
    </>
  );
}
