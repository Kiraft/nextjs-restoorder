
import { MercadoPagoConfig, Preference } from "mercadopago";

export const dynamic = "force-dynamic";

export async function POST(req) {
  try {
    const body = await req.json();  
    const { title, quantity, price } = body;  
    console.log('Llege aqui');
    

    const client = new MercadoPagoConfig({
      accessToken: 'APP_USR-5679284319579167-120619-c9404267198521dec7e8c434fac7022f-2140133213',
    });

    const bodyData = {
      items: [{
        title: title,
        quantity: Number(quantity),
        unit_price: Number(price),
        currency_id: "MXN",
      }],
      back_urls: {
        success: "https://www.facebook.com/search/top?q=tecnm%20-%20cuautla",
        failure: "https://www.facebook.com/search/top?q=tecnm%20-%20cuautla",
        pending: "https://www.facebook.com/search/top?q=tecnm%20-%20cuautla",
      },
      auto_return: "approved",
    };

    const preference = new Preference(client);
    const result = await preference.create({ body: bodyData });

    return new Response(
      JSON.stringify({ id: result.id }),
      { status: 200, headers: { "Content-Type": "application/json" } }
    );

      

  } catch (error) {
    console.error(error);
    return new Response(
      JSON.stringify({ error: "Error al crear la preferencia" }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}
