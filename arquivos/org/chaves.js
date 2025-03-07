const fs = require("fs").promises;
const moment = require("moment-timezone");
const { aluguel, chaves, grupos, premium, sleep, colors, verificarJSON, atualizarJSON } = require("../../exports.js");

/**
 * Função para pegar todas as chaves e seus detalhes.
 * @returns {Array} Array com objetos contendo chave, tipo, dias e valor
 */
const getTodasChaves = () => {
  let caixa = [];
  if (chaves.length > 0) {
    for (const a of chaves) {
      if (a.chaves.length > 0) {
        for (const b of a.chaves) {
          if (b.detalhes && b.detalhes.length > 0) {
            for (const detalhe of b.detalhes) {
              caixa.push({
                chave: b.chave,
                tipo: detalhe.tipo,
                dias: detalhe.dias,
                valor: detalhe.valor,
                cliente: a.cliente 
              });
            }
          }
        }
      }
    }
  }
  return caixa;
};

const todasChaves = getTodasChaves();

/**
 * Valida se a chave fornecida existe no sistema.
 * @param {string} txt - Chave fornecida
 * @returns {boolean} Se a chave existe
 */
const chaveValidar = (txt) => {
  return todasChaves.some(a => a.chave === txt);
};

/**
 * Função para adicionar um grupo ao sistema ou atualizar se já existir.
 * @param {string} id - ID do grupo
 * @param {Array} grupos - Lista de grupos
 * @param {number} limite - Limite de grupos (padrão: 5)
 * @param {boolean} validado - Se o grupo está validado (padrão: true)
 */
async function adicionarGrupo(id, grupos, limite = 5, validado = true) {
  const grupoExistente = grupos.find(g => g.id === id);
  if (!grupoExistente) {
    grupos.push({ id, limite, validado });
  } else {
    grupoExistente.validado = validado;
  }
  await atualizarJSON("./database/groups/aluguel/grupos.json", grupos);
}

/**
 * Registra ou valida a chave e associa o grupo ou usuário.
 * @param {string} query - Chave fornecida
 * @param {string} from - ID do grupo ou usuário
 * @param {string} groupName - Nome do grupo
 * @param {string} pessoa - Usuário associado
 * @param {Function} reply - Função para enviar resposta
 */
async function validarKey(query, from, groupName, pessoa, reply) {
  if (chaves.length === 0) return reply(`[!] Nenhuma chave cadastrada.`);
  const chaveValida = todasChaves.find(a => a.chave === query);
  if (!chaveValida) return reply(`[!] Chave inválida.`);
  const { dias: timeday, cliente, tipo } = chaveValida;
  const infinity = timeday <= 0;

  await adicionarGrupo("MORY BOT OFICIAL", grupos);
  await adicionarGrupo(from, grupos);

  if (!infinity) {
    if (tipo === 1) {
      await registrarGrupo(chaveValida, aluguel, from, groupName, timeday, cliente, reply);
    } else if (tipo === 2) {
      await registrarCortesia(chaveValida, from, groupName, cliente, reply);
    } else if (tipo === 3) {
      await adicionarPremium(from, cliente, timeday, reply);
    }
  } else {
    reply(`[!] O grupo foi salvo no banco de dados com sucesso!`);
  }
 await sleep(5000)
  await removerChave(chaveValida.chave);
}

async function registrarGrupo(chaveValida, aluguel, from, groupName, tempo, cliente, reply) {
  const grupoExistente = aluguel.find(g => g.id === from);
  if (!grupoExistente) {aluguel.push({ id: from, nome: groupName, tempo, totalRent: tempo, cliente: cliente, save: Number(moment.tz("America/Sao_Paulo").format("DD")), cortesia: false });
  } else {
    grupoExistente.tempo += tempo;
    grupoExistente.totalRent += tempo;
    grupoExistente.cortesia = false;
  }
  await atualizarJSON("./database/groups/aluguel/aluguel.json", aluguel);
  await reply(`+${tempo > 1 ? tempo + ' dias adicionados' : '1 dia adicionado'} ao Grupo`);
}

async function registrarCortesia(chaveValida, from, groupName, cliente, reply) {
  const grupo = grupos.find(g => g.id === "MORY BOT OFICIAL");
  if (!verificarJSON(grupo.gps || [], from)) {
    grupo.gps = grupo.gps || [];
    grupo.gps.push({ id: from });
    aluguel.push({ id: from, nome: groupName, tempo: 24, totalRent: 24, cliente: cliente, save: Number(moment.tz("America/Sao_Paulo").format("mm")), cortesia: true });
    await atualizarJSON("./database/groups/aluguel/grupos.json", grupos);
    await atualizarJSON("./database/groups/aluguel/aluguel.json", aluguel);
    await reply(`🌟 Código Card Cortesia validado com sucesso!`);
  } else {
    await reply(`[!] Já foi validado neste mês uma cortesia neste grupo.`);
  }
}

async function adicionarPremium(from, pessoa, tempoPremium, reply) {
  const usuarioPremium = premium.find(p => p.id === pessoa);
  if (!usuarioPremium) {
    premium.push({ id: pessoa, dias: Number(tempoPremium), save: Number(moment.tz("America/Sao_Paulo").format("DD")), infinito: false });
  } else {
    usuarioPremium.dias += Number(tempoPremium);
  }
  await atualizarJSON("./database/func/users/premium.json", premium);
  await reply(`${tempoPremium > 1 ? tempoPremium + ' dias de premium adicionados' : '1 dia de premium adicionado'} ao usuário @${pessoa.split("@")[0]}`);
}

async function removerChave(chave) {
  if (chaves.length > 0) {
    for (let i = 0; i < chaves.length; i++) {
      const a = chaves[i];
      const chaveIndex = a.chaves.findIndex(b => b.chave === chave);
      if (chaveIndex !== -1) {
        a.chaves.splice(chaveIndex, 1);
        for (const b of a.chaves) {
          if (b.detalhes && b.detalhes.length > 0) {
            const detalheIndex = b.detalhes.findIndex(d => d.chave === chave);
            if (detalheIndex !== -1) {
              b.detalhes.splice(detalheIndex, 1);
            }
          }
        }
        await atualizarJSON("./database/groups/aluguel/chaves.json", chaves);
      }
    }
  }
  console.log(colors.red('Reiniciando para salvar os arquivos!'))
 process.exit()
}

module.exports = { validarKey, chaveValidar };