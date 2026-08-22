import { onMount } from "solid-js";

/* ===========================================================
   COLETA PRIVADA E OPCIONAL DA CLOUDFLARE

   Sem um token configurado na compilação, nenhum script externo
   é carregado. A Cloudflare acompanha automaticamente as rotas
   de aplicações de página única quando a coleta está ativa.
=========================================================== */

export default function CloudflareAnalytics() {
    onMount(() => {
        const token = String(
            import.meta.env.VITE_CLOUDFLARE_WEB_ANALYTICS_TOKEN || "",
        ).trim();

        if (!token || document.querySelector("script[data-cf-beacon]")) {
            return;
        }

        const script = document.createElement("script");
        script.type = "module";
        script.src = "https://static.cloudflareinsights.com/beacon.min.js";
        script.dataset.cfBeacon = JSON.stringify({ token });
        document.body.append(script);
    });

    return null;
}
