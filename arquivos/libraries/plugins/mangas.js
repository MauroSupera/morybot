const axios = require('axios');
const cheerio = require('cheerio');

function generateUniqueId() {
    return Math.random().toString(36).substr(2, 9);
}

class mangas {
    static async search(searchTerm, pageNumber = 1) {
        try {
            const url = `https://battwo.com/search?word=${encodeURIComponent(searchTerm)}&page=${pageNumber}`;
            const { data: html } = await axios.get(url);
            const $ = cheerio.load(html);
            const results = [];

            $('div.col.item.line-b').each((index, element) => {
                const language = $(element).find('.eflag.flag-brazil').length > 0;
                if (language) {
                    const title = $(element).find('.item-title').text().trim();
                    const link = $(element).find('.item-title').attr('href');
                    const imageUrl = $(element).find('.item-cover img').attr('src');
                    const subtitle = $(element).find('.item-alias span.text-muted').first().text().trim();

                    // Pegando os gêneros
                    const genres = [];
                    $(element).find('.item-genre span, .item-genre u').each((i, genreElement) => {
                        genres.push($(genreElement).text().trim());
                    });

                    // Pegando o volume
                    const volume = $(element).find('.item-volch a').text().trim();
                    
                    results.push({
                        title,
                        subtitle,
                        link: `https://battwo.com${link}`,
                        imageUrl,
                        genres,
                        volume
                    });
                }
            });

            return results;
        } catch (error) {
            console.error('Erro ao buscar no battwo:', error);
            throw new Error('Erro ao buscar resultados');
        }
    }

    static async info(name) {
        try {
            const { data } = await axios.get(`https://api.jikan.moe/v4/manga?q=${encodeURIComponent(name)}&limit=1`);
            if (data.data && data.data.length > 0) {
                const manga = data.data[0]; 
                return {
                    title: manga.title,
                    synopsis: manga.synopsis,
                    author: manga.authors ? manga.authors.map(author => author.name).join(', ') : 'Desconhecido',
                    published: manga.published ? manga.published.string : 'Desconhecido',
                    image_url: manga.images.jpg.large_image_url
                };
            } else {
                return { error: 'Manga não encontrado' };
            }
        } catch (error) {
            console.error('Erro ao buscar manga:', error);
            return { error: 'Erro ao buscar manga' };
        }
    }

    static async chapters(url) {
        try {
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const chapters = [];
            $('.episode-list .main .item').each((index, element) => {
                const chapterTitle = $(element).find('b').text().trim();
                const chapterLink = $(element).find('a').attr('href');
                chapters.push({ title: chapterTitle, link: `https://battwo.com${chapterLink}` });
            });
            const total = chapters.length;
            return { total, chapters };
        } catch (error) {
            console.error('Erro ao buscar capítulos:', error);
            throw error;
        }
    }

    static async download(url) {
        try {
            const uniqueId = generateUniqueId();
            const { data } = await axios.get(url);
            const $ = cheerio.load(data);
            const scripts = $('script');
            let tsReaderRaw = '';
            let title = '';
            title = $('h3.nav-title a').text().trim();
            scripts.each((i, script) => {
                const scriptContent = $(script).html();
                if (scriptContent && scriptContent.includes('const imgHttps')) {
                    const regex = /const imgHttps\s*=\s*(\[[\s\S]*?\]);/;
                    const match = scriptContent.match(regex);
                    if (match && match[1]) {
                        tsReaderRaw = match[1].trim();
                    } else {
                        console.log('⚠ Não foi possível extrair corretamente o imgHttps.');
                    }
                }
            });

            let urls = {};
            tsReaderRaw = tsReaderRaw.replace(/^\[|\]$/g, '').replace(/\"/g, '');
            const links = tsReaderRaw.split(',');
            links.forEach((link, index) => {
                const trimmedLink = link.trim();
                if (trimmedLink) {
                    urls[`${index + 1}`] = trimmedLink;
                }
            });

            return { id: uniqueId, title: title, URLs: urls };
        } catch (error) {
            console.error('Erro ao buscar os links:', error);
            return 'Erro ao obter os dados';
        }
    }
}

module.exports = mangas;
