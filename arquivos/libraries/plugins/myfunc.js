const axios = require('axios');
const fs = require('fs');
const { tiktok } = require('./tiktok.js');
const configs = JSON.parse(fs.readFileSync('./settings/configs.json'));
const WebSite = configs["APIs"].website;
const ApiKey = configs["APIs"].apikey;

async function handleDownload(query, from, reply, mory, info, fetchJson) {
    try {
        var data = await fetchJson(`${WebSite}/download/auto-download?apikey=${ApiKey}&url=${query}`);
        
        if (data.source == "Instagram") {
            if (!data || !data.resultado || data.resultado.length === 0) {
                return reply('Não foi possível processar a mídia para a URL fornecida.');
            }
            const processedUrls = new Set();
            for (let mediaItem of data.resultado) {
                if (processedUrls.has(mediaItem.url)) return;
                processedUrls.add(mediaItem.url);

                if (mediaItem.url.includes('.jpg') || mediaItem.url.includes('.jpeg') || mediaItem.url.includes('.png') || mediaItem.url.includes('.webp')) {
                    await reply('Realizando o download da imagem do Instagram...');
                    await mory.sendMessage(from, { image: { url: mediaItem.url }, caption: `#MoryDonwloads | Download Completo - Instagram` }, { quoted: info });
                } else {
                    await reply('Realizando o download do vídeo do Instagram...');
                    await mory.sendMessage(from, { video: { url: mediaItem.url }, caption: `#MoryDonwloads | Download Completo - Instagram` }, { quoted: info });
                }
            }
        } else if (data.source == "Tiktok") {
            const videoData = await tiktok(query);
            if (videoData.images && videoData.images.length > 0) {
                for (let image of videoData.images) {
                    await mory.sendMessage(from, { image: { url: image }, caption: `*Perfil:* ${videoData.author.nickname}\n*Legenda:* ${videoData.title}\n—\n#MoryDownloads - Tiktok`, mimetype: "video/mp4" }, { quoted: info });
                }
            } else if (videoData.play) {
                await reply('Realizando o download do vídeo do TikTok...');
                await mory.sendMessage(from, { video: { url: videoData.play }, caption: `*Perfil:* ${videoData.author.nickname}\n*Legenda:* ${videoData.title}\n—\n#MoryDownloads - Tiktok` }, { quoted: info });
            } else {
                return reply("Não foi possível encontrar o conteúdo.");
            }
            if (videoData.music) {
                await mory.sendMessage(from, { audio: { url: videoData.music }, mimetype: 'audio/mpeg' });
            } else {
                await reply('Não foi possível encontrar a música no TikTok.');
            }
        } else if (data.source == "Twitter") {
            for (let i = 0; i < data.resultado.media.length; i++) {
                let mytype = data.resultado.media[i];
                if (data.resultado.type == "video") {
                    reply(`Realizando download do vídeo`);
                    await mory.sendMessage(from, { video: { url: mytype.url }, caption: '#MoryDonwloads | Download Completo - Twitter' }, { quoted: info });
                } else {
                    reply(`Realizando download da imagem`);
                    await mory.sendMessage(from, { image: { url: mytype.url }, caption: '#MoryDonwloads | Download Completo - Twitter' }, { quoted: info });
                }
            }
        } else if (data.source == "Threads") {
            for (let i = 0; i < data.resultado.media.length; i++) {
                var mytype = data.resultado.media[i];
                if (data.resultado.type === 'video') {
                    await reply('Realizando download do vídeo');
                    await mory.sendMessage(from, { video: { url: mytype.url }, caption: '#MoryDonwloads | Download Completo - Threads' }, { quoted: info });
                } else {
                    await reply('Realizando download da imagem');
                    await mory.sendMessage(from, { image: { url: mytype.url }, caption: '#MoryDonwloads | Download Completo - Threads' }, { quoted: info });
                }
            }
        } else if (data.source == "YouTube") {
            await reply('Realizando o Download do Vídeo para você!');
            try {
                var dataVideo = await fetchJson(`${WebSite}/download/youtube-video/v3?apikey=BielX愛&nome_url=${query}`);
                await mory.sendMessage(from, { video: { url: dataVideo.resultado.formats[0].url }, caption: `• Título: *${dataVideo.resultado.title || "Não encontrado."}*\n• Duração: *${dataVideo.resultado.duration || "Não encontrado."}* Segundos\n—\n> *Informações ~ Shorts*\nQualidade: *${dataVideo.resultado.formats[0].label}*\nFPS: *${dataVideo.resultado.formats[0].fps}*`,  mimetype: "video/mp4" }, { quoted: info });
            } catch (error) {
            console.error(error)
                await reply('Ocorreu um erro ao processar sua solicitação.');
            }
        } else if (data.source == "YouTube Shorts") {
            await reply('Realizando o Download do Vídeo para você!');
                var dataVideo = await fetchJson(`${WebSite}/download/youtube-video/v3?apikey=BielX愛&nome_url=${query}`);
                await mory.sendMessage(from, { video: { url: dataVideo.resultado.formats[0].url }, caption: `• Título: *${dataVideo.resultado.title || "Não encontrado."}*\n• Duração: *${dataVideo.resultado.duration || "Não encontrado."}* Segundos\n—\n> *Informações ~ Shorts*\nQualidade: *${dataVideo.resultado.formats[0].label}*\nFPS: *${dataVideo.resultado.formats[0].fps}*`,  mimetype: "video/mp4" }, { quoted: info });
        }
    } catch (error) {
        console.error(error);
        return reply("Ocorreu um erro ao processar seu pedido. Tente novamente. " + error);
    }
}

module.exports = { handleDownload }