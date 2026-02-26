// workers/proxy/index.js
export default {
    async fetch(request, env, ctx) {
        const url = new URL(request.url);

        // The "Secret Origin" (Your server's back door)
        const ORIGIN_HOSTNAME = "origin.voteflow.xyz";
        const destination = `https://${ORIGIN_HOSTNAME}${url.pathname}${url.search}`;

        // Create the forwarded request
        const proxyRequest = new Request(destination, {
            method: request.method,
            headers: new Headers(request.headers),
            body: request.body,
            redirect: "manual",
        });

        // Set the Host header so Coolify knows which app to show
        proxyRequest.headers.set("Host", ORIGIN_HOSTNAME);
        proxyRequest.headers.set("X-Proxy-By", "Cloudflare-Worker-Dynamic");

        try {
            return await fetch(proxyRequest);
        } catch (e) {
            return new Response(`Worker Proxy Error: ${e.message}`, { status: 502 });
        }
    },
};