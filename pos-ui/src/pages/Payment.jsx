import React, { useContext } from "react";
import { CartContext } from "../context/CartContext";
import api from "../services/api";

function Payment() {
  const { cart, clearCart } = useContext(CartContext);

  const handlePayment = async () => {
    const payload = {
      source: "ecommerce",
      items: cart.map((item) => ({
        product_id: item.id,
        quantity: item.quantity,
      })),
    };

    try {
      await api.post("/orders", payload);

      alert("Transaction Successful!");
      clearCart();

    } catch (error) {
      if (error.response?.status === 422) {
        const message = error.response?.data?.message || "Validation failed.";
        alert(message);
      } else if (error.response?.status === 500) {
        alert("Order failed due to stock/server error.");
      } else {
        alert("Transaction Failed.");
      }
    }
  };

  return (
    <div>
      <h1>Payment</h1>
      <button onClick={handlePayment}>Confirm Payment</button>
    </div>
  );
}

export default Payment;
