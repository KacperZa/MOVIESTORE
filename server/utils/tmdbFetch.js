const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

const tmdbFetch = async (endpoint, params = {}) => {
    const url = new URL(`${TMDB_BASE_URL}${endpoint}`);

    url.searchParams.set('language', 'en-US')

    Object.entries(params).forEach(([key, value]) => {
            url.searchParams.set(key, value)
    })
        const res = await fetch(url.toString(), {
            method: 'GET',
            headers: {
                accept: 'application/json',
                Authorization: `Bearer ${process.env.TMDB_TOKEN}`
            },
        });
        if(!res.ok){
            throw new Error (`HTTP: ${res.status}`)
        }
        return res.json();
};

module.exports = { tmdbFetch }