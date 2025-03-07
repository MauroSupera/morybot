const { verificarJSON, atualizarJSON, getNumberUser, moedas, chaves } = require('../../exports.js');

const valor = {
  aluguel: [
    { id: 1, tempo: 15, valor: 10 },
    { id: 2, tempo: 30, valor: 15 },
    { id: 3, tempo: 60, valor: 30 },
    { id: 4, tempo: 90, valor: 45 },
    { id: 5, tempo: 120, valor: 60 }
  ],
  premium: {
    usuario: {
      basico: 10,
      completo: 20
    }
  }
};

const tabelaAluguel = valor.aluguel;

const buscarValorAluguel = (nmr) => {
  let value = [{tempo: 0, valor: 0}];
  for (let i of tabelaAluguel) {
    if (Number(nmr) === i.tempo) value.push(i);
  }
  return value[value.length - 1];
};

async function criarUsuario(nome, cliente, data, saldoInicial = 0) {
  if(!verificarJSON(moedas, cliente)) {
  const usuario = { nome, cliente, data, saldo: saldoInicial };
  moedas.push(usuario);
  await atualizarJSON("./database/func/users/moedas.json", moedas);  
  console.log(`Usuário ${nome} criado com sucesso.`);
  return usuario;
 }
}

async function encontrarUsuario(cliente) {
  return moedas.find(usuario => usuario.cliente === cliente);
}

async function verificarSaldo(cliente, reply) {
  if(!verificarJSON(moedas, cliente)) {
  const usuarioMoedas = moedas.find(usuario => usuario.cliente === cliente);
  let resposta = `Nome: ${usuarioMoedas ? usuarioMoedas.nome : 'Desconhecido'}\nNúmero: ${getNumberUser(cliente)}\n`;
  if (!usuarioMoedas) {
    resposta += "Você não está registrado nas moedas.";
    return reply(resposta);
  }
  resposta += `Saldo: ${usuarioMoedas.saldo} moedas`;
  const usuarioChaves = chaves.find(usuario => usuario.cliente === cliente);
  if (usuarioChaves && usuarioChaves.chaves.length > 0) {
    resposta += `\n\nChaves associadas:\n`;
    usuarioChaves.chaves.forEach((chaveObj, index) => {
      chaveObj.detalhes.forEach(detalhe => {
        resposta += `${index + 1} - Chave: ${chaveObj.chave}\nDias: ${detalhe.dias}\n—\n`;
      });
    });
  } else {
    resposta += `\n\nNão há chaves associadas a este cliente.`;
  }
  reply(resposta);
}
}

async function adicionarMoedas(cliente, quantidade, reply) {
  const usuario = moedas.find(usuario => usuario.cliente === cliente);

  if (usuario && quantidade > 0) {
    usuario.saldo += Number(quantidade);
    await atualizarJSON("./database/func/users/moedas.json", moedas);  
    reply(`${quantidade},00 moedas foram adicionadas ao saldo a sua conta ${usuario.nome}!`);
  } else {
    reply("Usuário não encontrado ou quantidade inválida.");
  }
}

async function retirarMoedas(cliente, quantidade, reply) {
  const usuario = moedas.find(usuario => usuario.cliente === cliente);

  if (usuario && quantidade > 0) {
    if (usuario.saldo >= quantidade) {
      usuario.saldo -= Number(quantidade);
      await atualizarJSON("./database/func/users/moedas.json", moedas);  
      reply(`${quantidade},00 moedas foram retiradas do saldo da sua conta ${usuario.nome}!`);
    } else {
      reply("Saldo insuficiente para realizar a compra.");
    }
  } else {
    reply("Usuário não encontrado ou quantidade inválida.");
  }
}

async function transferirMoedas(clienteRemetente, clienteDestinatario, quantidade) {
  const remetente = moedas.find(usuario => usuario.cliente === clienteRemetente, reply);
  const destinatario = moedas.find(usuario => usuario.cliente === clienteDestinatario);

  if (!remetente || !destinatario) {
    reply("Remetente ou destinatário não encontrado.");
    return;
  }

  if (quantidade > 0 && remetente.saldo >= quantidade) {
    remetente.saldo -= Number(quantidade);
    destinatario.saldo += Number(quantidade);
    await atualizarJSON("./database/func/users/moedas.json", moedas);
    reply(`${remetente.nome} transferiu ${quantidade} moedas para ${destinatario.nome}.`);
  } else {
    reply("Transferência inválida. Verifique o saldo ou a quantidade.");
  }
}

module.exports = { criarUsuario, encontrarUsuario, verificarSaldo, adicionarMoedas, retirarMoedas, transferirMoedas, tabelaAluguel, buscarValorAluguel };