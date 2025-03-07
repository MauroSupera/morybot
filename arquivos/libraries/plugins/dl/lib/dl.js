"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tomp3 = exports.y2bs = exports.yt1d = void 0;
const cheerio = require('cheerio');
const {
	isUrl,
	fetch,
	random,
	getHTML,
	userAgent,
	bytesToSize,
	convertSforM,
	getOriginalUrl,
	gerarPHPSESSID
} = require('./function.js');
const { promise } = require('./download.js');

function generateNewCookies() {
	const user = userAgent()
	return {
		y2Matego: {
			'User-Agent': user,
			'X-Agent': user,
			Origin: 'https://www.y2matego.com',
			Referer: 'https://www.y2matego.com/',
			Accept: '*/*',
			'Content-Type': 'application/json',
			'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
			'Sec-Ch-Ua': `"Not-A.Brand";v="99", "Chromium";v="124"`,				'Sec-Ch-Ua-Mobile': '?1',
			'Sec-Ch-Ua-Platform': "Android",
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-site'
		},
		saveTube: {
			'User-Agent': user,
			Origin: 'https://savetube.io',
			//Referer: 'https://savetube.io/pt12/youtube-to-mp3/',
			Accept: '*/*',
			'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
			'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
			'Sec-Ch-Ua': `"Not-A.Brand";v="99", "Chromium";v="124"`,				'Sec-Ch-Ua-Mobile': '?1',
			'Sec-Ch-Ua-Platform': "Android",
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-site'
		},
		y2bs: {
			"User-agent": user,
			'accept-language': "pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7,ru;q=0.6",
			cookie: 'pll_language=pt; PHPSESSID='+gerarPHPSESSID()
		}
	}
}

class ScrapperData {
	
	static ytMateQualitiesHigh(obj) {
		let result = null
		const arry = (id) => Object.keys(obj).find(i => i == id)
		const id = arry('320') || arry('1') || arry('256') || arry('2') || arry('192') || arry('3') || arry('128') || arry('4') || arry('mp3128') || arry('140') || arry('299') || arry('22') || arry('298') || arry('135') || arry('18') || arry('133') || arry('160')
		return obj[id] || null
	}
	
	static tomp3CC(query, vt) {
		const toReload = (body, type = 'search') => {
			body = new URLSearchParams(body).toString()
			return fetch("https://tomp3.cc/api/ajax/"+type, {
				headers: {
					"accept": "*/*",
					"accept-language": "pt-BR,pt;q=0.7",
					"content-type": "application/x-www-form-urlencoded; charset=UTF-8",
					"sec-ch-ua": "\"Not_A Brand\";v=\"8\", \"Chromium\";v=\"120\", \"Brave\";v=\"120\"",
					"sec-ch-ua-mobile": "?0",
					"sec-ch-ua-platform": "\"Linux\"",
					"sec-fetch-dest": "empty",
					"sec-fetch-mode": "cors",
					"sec-fetch-site": "same-origin",
					"sec-gpc": "1",
					"x-requested-with": "XMLHttpRequest",
					"Referrer-Policy": "strict-origin-when-cross-origin"
				},
				body,
				method: "POST"
			}).then(i => i.json())
		}
		return toReload({ query, vt }).then(({ title, a, t, links, vid }) => {
			const meta = links[vt] && this.ytMateQualitiesHigh(links[vt]);
			if (!meta) return Promise.reject('Sem mídia em qualidade alta.');
			
			return toReload({ vid, k: meta.k }, 'convert').then(({ dlink, status }) => {
				if (status !== 'ok') return Promise.reject('Sem resultado de data.');
				if (!dlink) return Promise.reject('Sem resultado da URL.');
				
				return Promise.resolve({
					size: meta.size,
					quality: meta.q,
					minutes: convertSforM(t),
					seconds: t,
					result: dlink
				});
			});
		});
	};
	
	static getKeyY2bs(url, user) {
		return getHTML("https://y2bs.com/en17/pt/#url="+url, {
			method: 'GET',
			headers: user
		}).then(html => {
			const $ = cheerio.load(html)
			try {
				return $('.container.mt-8 > .row.align-items-center > .col-12.col-lg-6.mb-5.mb-lg-0 > .d-flex.flex-wrap').html().split('value="')[1].split('">')[0]
			} catch {
				return null
			}
		});
	};
	
	static async y2bs(url) {
		const { y2bs } = generateNewCookies()
		const token = await this.getKeyY2bs(url, y2bs)
		if (!token) return Promise.reject('Sem token no vídeo! (Y)');
		
		return getHTML("https://y2bs.com/wp-json/aio-dl/video-data/", {
    		method: "POST",
			headers: y2bs,
			form: { url, token }
    	});
	};
	
	static y2matego(id, vt) {
		const BASE_URL = "https://api.y2matego.com/yt/"
		const { y2Matego } = generateNewCookies()
		return getHTML(BASE_URL+id, {
			method: "GET",
			json: true,
			headers: y2Matego
		}).then((res) => {
			const { status, data: { name, duration, formats } } = res
			if (status !== 200) return Promise.reject(res)
			
			const qualitys = {}
			for (let v of formats) {
				qualitys[v.ext] = qualitys[v.ext] || {}
				Object.assign(qualitys[v.ext], {
					[v.id]: {
						id: v.id,
						quality: v.format,
						size: bytesToSize(v.filesize),
						fileSize: v.filesize
					}
				})
			}
			const meta = qualitys[vt] && this.ytMateQualitiesHigh(qualitys[vt]);
			if (!meta) return Promise.reject('Sem mídia em qualidade alta.');
			const type = vt.replace('mp3', 'audios').replace('mp4', 'videos')
			return getHTML(BASE_URL+id+"/"+type+"/"+meta.id, {
				method: "GET",
				json: true,
				headers: y2Matego
			}).then((res) => {
				const { data, status } = res
				switch (status) {
					case 200:
						return Promise.resolve(Object.assign(meta, {
							result: data
						}))
					case 201:
						return new Promise(async (resolve, reject) => {
							const resu = { status: 102 }
							while (resu.status === 102) {
								await getHTML(BASE_URL+id+"/status/"+data, {
									method: "GET",
									json: true,
									headers: y2Matego
								}).then(r => {
									Object.assign(resu, r)
								}).catch(err => {
									reject(err)
								})
							}
							resolve(resu);
						})
					default:
					return Promise.reject(res)
				}
			});
		});
	};
    
}

function downConfig(medias, type) {
	medias = medias?.sort((a, b) => (Number(a.size) < Number(b.size)) ? 1 : -1).find(i => i.audioAvailable && (i.extension == type))
	if (!medias) return Promise.reject('Sem resultado da URL.');
				
	return Promise.resolve({
		type: medias.extension,
		size: (medias.formattedSize || Number(medias.size)),
		quality: medias.quality,
		result: medias.url
	});
}

exports.y2matego = (id, type = 'mp3') => ScrapperData.y2matego(id, type)

exports.tomp3 = (url, type = 'mp3') => ScrapperData.tomp3CC(url, type)

exports.y2bs = (url, type = 'mp3') => ScrapperData.y2bs(url).then(({ medias }) => downConfig(medias, type))

exports.spotifydown = async (url) => {
	url = isUrl(url)
	if (!(
		url && url[0].includes('spotify')
	)) return Promise.reject('Necessita ser uma URL Spotify.')
	if (url[0].includes('spotify.link')) {
		url = await getOriginalUrl(url[0])
	} else {
		url = url[0]
	}
	if (!/\/track\//.test(url)) return Promise.reject('Não foi reconhecido a url.')
		
	const id = url.split(/track\//g).pop().split("?")[0]
	const ops = {
		method: 'GET',
		json: true,
		headers: {
			'User-Agent': userAgent(),
			Origin: 'https://spotifydown.com',
			Referer: 'https://spotifydown.com/',
			Accept: '*/*',
			'Accept-Language': 'pt-BR,pt;q=0.9,en-US;q=0.8,en;q=0.7',
			'Sec-Ch-Ua': `"Not-A.Brand";v="99", "Chromium";v="124"`,
			'Sec-Ch-Ua-Mobile': '?1',
			'Sec-Ch-Ua-Platform': "Android",
			'Sec-Fetch-Dest': 'empty',
			'Sec-Fetch-Mode': 'cors',
			'Sec-Fetch-Site': 'same-site'
		}
	}
	return getHTML('https://api.spotifydown.com/metadata/track/'+id, ops).then((data) => {
		if (!data.success) return Promise.reject(data)
		return getHTML('https://api.spotifydown.com/download/'+id, ops).then(v => Promise.resolve({ result: v.link, size: 0, quality: '320 Kbps' }))
	})
};