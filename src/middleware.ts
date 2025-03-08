import { type APIContext, type MiddlewareNext } from "astro";

export const onRequest = async (context: APIContext, next: MiddlewareNext) => {
  const userAgent =
    context.request.headers.get("user-agent")?.toLowerCase() || "";
  const isTextBrowser =
    userAgent.includes("curl") ||
    userAgent.includes("w3m") ||
    userAgent.includes("lynx");
  const browserIsCoffee = userAgent.toLowerCase().includes("coffee");

  if (new URL(context.request.url).pathname === "/") {
    console.log(context.request.headers.get("Content-Type"));
    if (
      browserIsCoffee ||
      context.request.headers.get("Content-Type") ===
        "application/coffee-pot-command"
    ) {
      return context.redirect("/coffeebrew");
    } else if (isTextBrowser) {
      return new Response("🫖 I'm a teapot", {
        status: 418,
        statusText: "I'm a teapot",
        headers: { "Content-Type": "text/plain" },
      });
    }  

    const response = await next();
    const html = await response.text();

    return new Response(html, {
      status: 418,
      statusText: "I'm a teapot",
      headers: response.headers,
    });
  }

  if (new URL(context.request.url).pathname === "/teabrew") {
    if (isTextBrowser) {
      return new Response("🫖 I'm a teapot", {
        status: 418,
        statusText: "I'm a teapot",
        headers: { "Content-Type": "text/plain" },
      });
    } else if (browserIsCoffee) {
      return context.redirect("/coffeebrew");
    }

    const response = await next();
    const html = await response.text();

    return new Response(html, {
      status: 418,
      statusText: "I'm a teapot",
      headers: response.headers,
    });
  }

  if (new URL(context.request.url).pathname === "/coffeebrew") {
    if (isTextBrowser || browserIsCoffee) {
      return new Response(
        `# How to brew coffee
1. Grind coffee beans
2. Boil water
3. Add coffee grounds to filter
4. Pour water over coffee grounds
5. Let steep for 4 minutes
6. Enjoy!

# How to brew tea
Please refer to [teabrew](/teabrew)`,
        {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        }
      );
    }

    const response = await next();
    const html = await response.text();

    return new Response(html, {
      status: 200,
      headers: response.headers,
    });
  }

  return next();
};
