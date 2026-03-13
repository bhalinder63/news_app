const COUNTRY_DOMAINS = {
  gb: "bbc.co.uk,theguardian.com,independent.co.uk,telegraph.co.uk,mirror.co.uk",
  au: "abc.net.au,smh.com.au,news.com.au,9news.com.au",
  ca: "cbc.ca,globalnews.ca,nationalpost.com,thestar.com",
  in: "timesofindia.indiatimes.com,ndtv.com,indianexpress.com,hindustantimes.com,thehindu.com",
};

const CATEGORY_KEYWORDS = {
  general: "news OR world OR breaking",
  business: "business OR economy OR finance OR market",
  entertainment: "entertainment OR movie OR celebrity OR music",
  health: "health OR medical OR wellness",
  science: "science OR research OR discovery OR space",
  sports: "sports OR football OR cricket OR tennis",
  technology: "technology OR tech OR AI OR software",
};

async function fetchFromAPI(url) {
  const res = await fetch(url);
  return res.json();
}

export default async function handler(req, res) {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  if (req.method !== "GET") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const apiKey = process.env.NEWS_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "API key not configured on server" });
  }

  const { endpoint, country, category, ...rest } = req.query;

  try {
    if (endpoint === "everything") {
      const params = new URLSearchParams({ ...rest, apiKey });
      const data = await fetchFromAPI(
        `https://newsapi.org/v2/everything?${params}`
      );
      return res.status(200).json(data);
    }

    const params = new URLSearchParams({ country, category, ...rest, apiKey });
    const data = await fetchFromAPI(
      `https://newsapi.org/v2/top-headlines?${params}`
    );

    if (data.status === "ok" && data.totalResults > 0) {
      return res.status(200).json(data);
    }

    const domains = COUNTRY_DOMAINS[country];
    if (!domains) {
      return res.status(200).json(data);
    }

    const q = CATEGORY_KEYWORDS[category] || CATEGORY_KEYWORDS.general;
    const fallbackParams = new URLSearchParams({
      domains,
      q,
      page: rest.page || 1,
      pageSize: rest.pageSize || 5,
      sortBy: "publishedAt",
      language: "en",
      apiKey,
    });

    const fallbackData = await fetchFromAPI(
      `https://newsapi.org/v2/everything?${fallbackParams}`
    );
    return res.status(200).json(fallbackData);
  } catch {
    return res.status(502).json({ error: "Failed to fetch from NewsAPI" });
  }
}
