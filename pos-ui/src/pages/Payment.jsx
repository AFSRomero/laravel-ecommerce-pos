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
      if (error.response?.status === 409) {
        const ingredient = error.response?.data?.ingredient;
        alert(
          ingredient
            ? `Insufficient stock: ${ingredient}`
            : "Insufficient stock."
        );
      } else if (error.response?.status === 422) {
        alert(error.response?.data?.message || "Validation failed.");
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
