const axios = require('axios');
const qs = require('qs');

const credentials = {
    clientId: '271f6e790fb943cdb34679a4adcc34cc',
    clientSecret: 'c009525564304209b7d8b705c28fd294'
};

async function getAccessToken() {
    try {
        const response = await axios({
            method: 'post',
            url: 'https://accounts.spotify.com/api/token',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
            },
            auth: {
                username: credentials.clientId,
                password: credentials.clientSecret
            },
            data: qs.stringify({
                grant_type: 'client_credentials'
            })
        });

        return response.data.access_token;
    } catch (error) {
        throw new Error('Erro ao obter token de acesso do Spotify: ' + error.message);
    }
}

function formatTime(milissegundos) {
    const segundos = Math.floor(milissegundos / 1000);
    const minutos = Math.floor(segundos / 60);
    const restantesSegundos = segundos % 60;

    const minutosTexto = minutos === 1 ? "Minuto" : "Minutos";
    const segundosTexto = restantesSegundos === 1 ? "Segundo" : "Segundos";

    if (milissegundos === 0) {
        return "0 Segundos";
    } else if (restantesSegundos === 0) {
        return `${minutos} ${minutosTexto}`;
    } else {
        return `${minutos} ${minutosTexto} e ${restantesSegundos} ${segundosTexto}`;
    }
}

async function downloadSpotify(track) {
    if (!track || typeof track !== 'string') {
        throw new Error('A URL da track é inválida ou não foi fornecida.');
    }

    try {
        const { data: downloadResponse } = await axios.post('https://spotydown.media/api/download-track', {
            url: track
        });
        return downloadResponse.file_url;
    } catch (error) {
        console.error('Erro ao tentar baixar a música:', error.message);
        throw new Error('Não foi possível baixar a música. Por favor, tente novamente mais tarde.');
    }
}

async function searchSpotify(query) {
    try {
        const token = await getAccessToken();
        if (query.includes('https://open.spotify.com/track/')) {
            return await downloadSpotifyFromURL(query);
        }
        const response = await fetch(`https://api.spotify.com/v1/search?q=${encodeURIComponent(query)}&type=track`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }
       const data = await response.json();
        if (!data.tracks || !data.tracks.items || data.tracks.items.length === 0) {
            return 'Desculpe, não consegui encontrar resultados para sua pesquisa.';
        }
        const track = data.tracks.items[0];
        const downloadURL = await downloadSpotify(track.external_urls.spotify);
        return {
            artist: track.artists.map(artist => artist.name).join(', '),
            title: track.name,
            popularity: track.popularity,
            type: track.type,
            duration: formatTime(track.duration_ms),
            imageURL: track.album.images[0]?.url || 'https://agathabot.com.br/uploads/images/file-1730737429919-529561433.jpeg',
            musicURL: track.external_urls.spotify,
            downloadURL: downloadURL || 'Download não disponível.'
        };
    } catch (error) {
        console.error("Spotify search failed:", error);
        return 'Ocorreu um erro ao tentar realizar a busca ou o download.';
    }
}

async function downloadSpotifyFromURL(trackURL) {
    try {
        const token = await getAccessToken();
        
        const playList = GetNumberPlayList(trackURL);

        const response = await fetch(`https://api.spotify.com/v1/tracks/${playList}`, {
            method: 'GET',
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });

        if (!response.ok) {
            throw new Error(`Error: ${response.status} ${response.statusText}`);
        }

        const track = await response.json();

        if (!track) {
            return 'Desculpe, não consegui encontrar informações para o link fornecido.';
        }

        const downloadURL = await downloadSpotify(track.external_urls.spotify);

        return {
            artist: track.artists.map(artist => artist.name).join(', '), 
            title: track.name,
            popularity: track.popularity,
            type: track.type,
            duration: formatTime(track.duration_ms),
            imageURL: track.album.images[0]?.url || 'https://agathabot.com.br/uploads/images/file-1730737429919-529561433.jpeg',
            musicURL: track.external_urls.spotify,
            downloadURL: downloadURL || 'Download não disponível.'
            
        };
        
    } catch (error) {
        console.error("Failed to get track info:", error);
        return 'Ocorreu um erro ao tentar obter as informações da música.';
    }
}

async function playlistSpotify(query) {
    try {
        const accessToken = await getAccessToken();
        
        const axiosInstance = axios.create({
            headers: { 'Authorization': `Bearer ${accessToken}` }
        });

        const playList = GetNumberPlayList(query);
        const response = await axiosInstance.get(`https://api.spotify.com/v1/playlists/${playList}`);

        const detalhes = {
            nome: response.data.name || 'Nome não disponível',
            descricao: response.data.description || 'Descrição não disponível',
            imagem: response.data.images.length > 0 ? response.data.images[0].url : null,
            faixas: response.data.tracks.items.map(item => ({
                nome: item.track.name || 'Nome não disponível',
                artistas: item.track.artists.map(artist => artist.name).join(', ') || 'Artista não disponível',
                album: item.track.album.name || 'Álbum não disponível',
                duracao: formatTime(item.track.duration_ms) || 'Sem informações',
                popularidade: item.track.popularity || 'Sem informações',
                imageURL: item.track.preview_url || 'https://agathabot.com.br/uploads/images/file-1730737429919-529561433.jpeg',
                musicURL: item.track.external_urls.spotify
            }))
        };

        return detalhes;
    } catch (error) {
        throw new Error(`Erro ao obter informações da playlist do Spotify: ${error.response ? error.response.data.error.message : error.message}`);
    }
}

function GetNumberPlayList(query) {
    try {
        const id = query.split('/').pop().split('?')[0];

        if (!id) {
            throw new Error('ID da playlist não encontrado.');
        }

        return id;
    } catch (error) {
        console.error(`Erro: ${error.message}`);
        return null;
    }
}

module.exports = { searchSpotify, playlistSpotify }