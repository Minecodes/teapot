import { type APIContext, type MiddlewareNext } from "astro";

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
    const userAgent = context.request.headers.get("user-agent")?.toLowerCase() || "";
    const isTextBrowser = userAgent.includes("curl") || 
                         userAgent.includes("w3m") || 
                         userAgent.includes("lynx");

    if (new URL(context.request.url).pathname === "/") {
        if (isTextBrowser) {
            return new Response("🫖 I'm a teapot", {
                status: 418,
                statusText: "I'm a teapot",
                headers: { "Content-Type": "text/plain" }
            });
        }

        const response = await next();
        const html = await response.text();
        
        return new Response(html, {
            status: 418,
            statusText: "I'm a teapot",
            headers: response.headers
        });
    }

  return next();
}
