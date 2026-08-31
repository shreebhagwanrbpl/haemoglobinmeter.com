export default function robots() {
    return {
        rules: {
            userAgent: "*",
            allow: "/",
            disallow: [
                "/admin",
                "/dashboard",
                "/api/",
                "/search",
                "/*?*", // Block query parameters to prevent crawling duplicate filter/sorting combinations
            ],
        },

        sitemap: "https://haemoglobinmeter.com/sitemap.xml",
    };
}
