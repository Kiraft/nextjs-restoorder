"use client";

import { useState, useMemo } from "react";
import { toast } from "react-toastify";
import { useStore } from "@/src/store";
import ProductDetails from "./ProductDetails";
import { formatCurrency } from "@/src/utils";
import { createOrder } from "@/actions/create-order-action";
import { OrderSchema } from "@/src/schema";
import { initMercadoPago, Wallet } from "@mercadopago/sdk-react"; // Aquí importas Wallet del SDK

// Inicializamos MercadoPago correctamente
initMercadoPago("APP_USR-37eff6e7-3519-45ed-8541-aa5056bbcc4e");

export default function OrderSummary() {
  const order = useStore((state) => state.order);
  const clearOrder = useStore((state) => state.clearOrder);
  const total = useMemo(
    () => order.reduce((total, item) => total + item.quantity * item.price, 0),
    [order]
  );
  const [mostrar, setMostrar] = useState(false);
  const [preferenceId, setPreferenceId] = useState(null); 

  const pagarMercado = async () => {
    setMostrar(true);

    try {
      const orderData = {
        title: "Comida RestOorder",
        quantity: 1,
        price: 1,
      };

      const response = await fetch("/order/api", { 
        method: "POST",
        headers: {
          "Content-Type": "application/json", // Especificamos que estamos enviando datos en formato JSON
        },
        body: JSON.stringify(orderData), // Convierte los datos en formato JSON
      });

      const preference = await response.json();
      setPreferenceId(preference.id); // Guardamos el id de la preferencia

    } catch (error) {
      toast.error("Hubo un error al procesar el pago.");
    }
  };

  const handleCreateOrder = async (formData: FormData) => {
    const data = {
      name: formData.get("name"),
      total,
      order,
    };

    const result = OrderSchema.safeParse(data);
    if (!result.success) {
      result.error.issues.forEach((issue) => {
        toast.error(issue.message);
      });
      return;
    }

    const response = await createOrder(data);
    if (response?.errors) {
      response.errors.forEach((issue) => {
        toast.error(issue.message);
      });
    }

    toast.success("Pedido Realizado Correctamente");
    clearOrder();
  };

  return (
    <aside className="lg:h-screen lg:overflow-y-scroll md:w-64 lg:w-96 p-5 bg-[#FCE6D0]">
      <h1 className="text-4xl text-center font-black">Mi Pedido</h1>

      {order.length === 0 ? (
        <p className="text-center my-10">El pedido está vacío</p>
      ) : (
        <div className="mt-5">
          {order.map((item) => (
            <ProductDetails key={item.id} item={item} />
          ))}

          <p className="text-2xl mt-20 text-center">
            Total a pagar: <span className="font-bold">{formatCurrency(total)}</span>
          </p>

          <input
            type="button"
            className="py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer font-bold"
            value="Seleccionar Metodo"
            onClick={pagarMercado}
          />

          {mostrar && preferenceId && (
            <>
              <form className="w-full mt-10 space-y-5" action={handleCreateOrder}>
                <input
                  type="text"
                  placeholder="Tu Nombre"
                  className="bg-white border border-gray-100 p-2 w-full"
                  name="name"
                />

                <input
                  type="submit"
                  className="py-2 rounded uppercase text-white bg-black w-full text-center cursor-pointer font-bold"
                  value="Pagar en efectivo"
                />
              </form>

              {/* Usamos el componente Wallet del SDK de MercadoPago */}
              <div id="wallet_container">
                <Wallet
                  initialization={{ preferenceId }}
                  customization={{
                    texts: {
                      valueProp: "smart_option",
                    },
                  }}
                />
              </div>
            </>
          )}
        </div>
      )}
    </aside>
  );
}
