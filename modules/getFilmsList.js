export default async function getFilmsFromApi(apiKey, url) {
    try {
        const resp = await fetch(url, {
            headers: {
                'X-API-KEY': apiKey,
                'Content-Type': 'application/json',
            },
        })

        const data = await resp.json();
        return data;
    } catch (e) {
        console.error(e);
    }
}