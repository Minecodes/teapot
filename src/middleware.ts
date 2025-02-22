import { type APIContext, type MiddlewareNext } from "astro";

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
    if (new URL(context.request.url).pathname === "/") {
        const response = await next();
        const html = await response.text();
        
        return new Response(html, {
            status: 418,
            statusText: "I'm a teapot",
            headers: response.headers
        })
    }

    console.log("Request URL:", context.request.url);

  return next();
}
