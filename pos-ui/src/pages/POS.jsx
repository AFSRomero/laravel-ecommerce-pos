import React, { useEffect, useState } from "react";
import ProductList from "../components/ProductList";
import Cart from "../components/Cart";
import echo from "../services/socket";
import api from "../services/api";

function POS() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    const channel = echo.channel("inventory").listen("InventoryUpdated", () => {
      fetchProducts();
    });

    return () => {
      echo.leaveChannel("inventory");
      if (channel && channel.stopListening) {
        channel.stopListening("InventoryUpdated");
      }
    };
  }, []);

  const fetchProducts = async () => {
    const response = await api.get("/products");
    setProducts(response.data);
  };

  return (
    <div className="container">
      <h1>Point of Sale</h1>
      <div className="row">
        <div className="col-8">
          <ProductList products={products} />
        </div>
        <div className="col-4">
          <Cart />
        </div>
      </div>
    </div>
  );
}

export default POS;
