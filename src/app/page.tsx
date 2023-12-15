"use client";
import { useEffect, useState } from "react";

export default function Home() {
  const [items, setItems] = useState<any[] | null>([]);
  const [cart, setCart] = useState<any | null>({});
  const [email, setEmail] = useState<string>("");

  useEffect(() => {
    const fetchItems = async () => {
      const response = await fetch("/api/skus", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const items = await response.json();
      console.log("items", items[0]);
      setItems(items);
    };

    fetchItems();
  }, []);

  const handleAddToCart = async (item: any) => {
    const response = await fetch("/api/skus", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ item }), // Stringify the item
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const order = await response.json();

    setCart(order);
  };

  const handleAddEmailToOrder = async () => {
    const response = await fetch("/api/skus", {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ orderId: cart.order.id, email }), // Stringify the item
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <h1>This are the available items</h1>
      {items &&
        items.length > 0 &&
        items.map((item) => (
          <div key={item.id} className="flex flex-col items-center">
            <h2>{item.name}</h2>
            <p>
              Price starts at:{" "}
              {item.prices[0].price_volume_tiers[0].price_amount_float}
            </p>
            <button onClick={() => handleAddToCart(item)}>Add to cart</button>
          </div>
        ))}
      {cart && cart.order && cart.order.id && (
        <div>
          <p>Cart id: {cart.order.id}</p>
          <p>Line items: {cart.order.line_items.length}</p>

          <p>Do you want to purchase?</p>
          <input
            placeholder="insert email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <button onClick={handleAddEmailToOrder}>Add email to order</button>
        </div>
      )}
    </main>
  );
}
