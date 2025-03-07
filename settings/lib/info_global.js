exports.listLanguages = (prefix) => {
return `Você pode ver a lista de idiomas disponíveis em para usar no tradutor ou gtts aqui: https://cloud.google.com/translate/docs/languages
–
• Exemplificando o uso das funções dos comandos *gtts e tradutor*:
–
↳ *Comando:* ${prefix}gtts pt sabrina
*[pt]* - O idioma, o sotaque que ele(a) irá falar no áudio.
*[sabrina]* - Vai ser o que será o texto ou frase falado por ele(a).
–
↳ *Comando:* ${prefix}tradutor pt|love you
*[pt]* - O idioma que vai ser realizado a tradução da palavra ou texto.
*[love you]* - O texto/palavra que ele(a) vai fazer a tradução para o idioma.`
}

exports.bemvindo = (prefix) => {
return `Este comando é para informar, como você deve ativar o bem vindo, e lembrando, esse bemvindo, contém uma legenda diferente, a cada grupo que for colocado, o bemvindo2 tem essa função também.
–
• As diferenças entre os bem vindos é que o bemvindo tem foto e o bemvindo2 não contém foto em si somente a mensagem.
–
• Para desativar ou ativar o *bemvindo ou bemvindo2*, use os números 0 ou 1. 
\t• Exemplo de como ativar e desativar o recurso em seu grupo: 
\t\t→ *Ativando o recurso:* ${prefix}bemvindo 1 ou ${prefix}bemvindo2 1, ative somente um dos dois para evitar flood em seu grupo.
\t\t→ *Desativando o recurso:* ${prefix}bemvindo 0 ou ${prefix}bemvindo2 0, caso um dos 2 esteja ativado.
–
• Para realizar a troca do fundo da imagem do bem vindo, é só mandar uma foto no WhatsApp, retangular e marcar ela com o comando *${prefix}fundobemvindo* ou se quer trocar a do saiu, use *${prefix}fundosaiu*
\t→ *Observação:* Os comandos para mudar o fundo é somente disponibilizado o uso ao proprietário(s) do bot.
–
• *Parâmetros usados que podem ser usados para personalizar sua mensagem:*
*#hora#* → Com essa definição inserida em seu argumento, irá mostrar a hora no momento exato que foi realizada a entrada ou saída do integrante do grupo.
*#nomedogp#* → Usada para mostrar o nome do grupo em seu texto de bem-vindo.
*#numerodele#* → Tem a função de mostrar o número do integrante que entrou ou saiu do grupo.
*#prefixo#* → Vai aparecer qual o símbolo que você está utilizando no bot, para fazer ele funcionar.
*#descrição#* → Com essa definição irá mostrar a descrição do grupo ou regras como você preferir chamar.
–
Para definir uma legenda de quando um integrante sair ou entrar em seu grupo, veja os exemplos baixo:
• Adicionar a legenda ou mensagem para dar as saudações ao novo integrante de forma personalizada: 
\t\t→ Caso esteja usando o *bem-vindo* (com foto), use: *${prefix}legendabv sua mensagem..*
\t\t→ Usando o *bem-vindo2* (sem foto)? Use *${prefix}legendabv2 sua mensagem..*
• Definir uma legenda ou mensagem para a saída de um integrante do grupo:
\t\t→ Caso esteja usando o *bem-vindo* (com foto), use: *${prefix}legendasaiu sua mensagem..*
\t\t→ Usando o *bem-vindo2* (sem foto)? Use *${prefix}legendasaiu2 sua mensagem..*`
}

exports.infoOwner = (prefix, NickDono, numerodn, NomeDoBot, sender) => {
return `Olá @${sender.split("@")[0]}, aqui está as informações sobre meu dono:
–
• Número do proprietário: wa.me/${numerodn}
• Proprietário: ${NickDono}`
}

exports.configbot = (prefix) => {
return `*COMO CONFIGURAR O BOT, TUTORIAL ABAIXO:*
–
Primeiro ligue o bot no termux, e vá para o WhatsApp do bot em algum privado, utilize os seguintes comandos.
*Obs:* Pode por letras modificadas também se você quiser!
–
• *1)* Para alterar o nome do bot, use o seguinte comando:
\t• ${prefix}Nome-bot Nome que deseja colocar em seu bot
–
• *2)* Para alterar o nick do dono do bot, use o seguinte comando:
\t• ${prefix}Nick-dono Seu nick aqui
–
• *3)* Configure o número do dono, com o seguinte comando:
\t• ${prefix}numero-dono 558288279194
*Obs:* O número tem que ser junto, e não pode conter o símbolo de + nem - e não pode ter o 9 da operadora, tem que ser o número idêntico ao seu do whatsapp.
–
• *4)* Configure o prefixo que você deseja no bot, usando o seguinte comando:
\t• ${prefix}prefixo-bot #
*Obs:* Pode por qualquer símbolo, se o seu símbolo for ${prefix} ele vai passar a ser # de acordo com o que você mudou.
–
Boa sorte! Dúvidas? Entre em contato com o criador, usando: *${prefix}criador*`
}

exports.infoRent = (prefix) => {
return `• INFORMAÇÕES SOBRE O ALUGUEL:
–
Novo sistema de aluguel para facilitar a vida de nossos usuários, recentemente foi criado o modo aluguel para os grupos, agora ele está de forma global, ou seja, desativou esse modo em todos os grupos os usos serão liberados para todos os participantes sem a necessidade de registrar o grupo na lista de aluguel.
~ Aviso: O comando *${prefix}dados* é usado para consultar o tempo que falta para acabar o seu aluguel no grupo. (Para os adms do grupo aonde está alugado!)
–
• Caso você alugue seu bot está configuração é muito boa e funcional para você, para manter o controle com seus clientes... 
O comando está desativado de fábrica, para ativar e desativar use o comando: ${prefix}modoaluguel, ou seja o 1 é para ativar, já o 0 é para desativar o modo de forma global. Caso ative, leia os próximos parágrafos da informação, aqui esta todo o tutorial de como usar este sistema:
–
*1.* Para adicionar o grupo na lista de aluguel registrado sem gerar o código que faz o registro automático e nescessário o dono está no grupo futuramente à ser registrado no aluguel, use: *${prefix}addrent 558298.../dias*.
—
*2.* Para remover dias do grupo adicionado no aluguel, use o comando (usar o comando no grupo que está registrado): *${prefix}tirarrent quantidade de dias que você deseja remover..*
—
*3.* Para remover o aluguel do grupo da lista, use este comando no grupo aonde você vai alugar o bot: *${prefix}delrent*, após o uso deste comando devo lembrar que o bot não irá emitir mais nenhuma função no grupo, haverá o limite de 5 tentativas em cada grupo, isto é o padrão do bot.
—
*4.* Para liberar o uso no grupo por 24 horas como um teste, é nescessário o uso deste comando no grupo aonde vai ser disponibilizado o recurso: *${prefix}cortesia24*
—
*5.* Este comando tem a função de mostrar todos os grupos alugados registrados: *${prefix}listrent*, já este mostra top 3 de grupos que estão perto de vencer: *${prefix}lastrent*
—
*6.* Este comando mostra todas aa chaves de aluguel que foram criadas por você (dono(a) do bot) e também mostra o status da chave, se ela foi validada ou não: *${prefix}codelistrent*
—
*7.* Como você já leu o tópico 1, você viu que ele ativa dentro do grupo, já este comando você pode utilizar no pv do bot para realizar o registro do grupo. Este comando gera uma chave e você irá passar a mesma ao seu cliente que deseja alugar o grupo: *${prefix}gerarcoderent (558298.../dias)*, de forma rápida e complexa o grupo será ativado em segundos.
—
*8.* Este comando deleta o código gerado por você, ou seja, no tópico 7 é adicionar o código na lista de ativação do grupo, mas ele não desativa o aluguel no grupo, isso você vê no tópico 3: *${prefix}delcoderent (código)*
—
*9.* De acordo com o tópico que fala sobre a cortesia, que seria o uso do bot liberado por 24h no grupo aonde foi disponibilizado, este comando é praticamente a mesma funcionalidade de gerar o código fixo de aluguel, o comando: *${prefix}gerarcodecort*
—
*10.* O comando *${prefix}savegp* serve para ativar o grupo, sem a necessidade de registrar o aluguel no grupo aonde usar...`
}

exports.mensagemTabela = (tabela) => {
  return 'Aqui estão os preços para alugar a chave por dias:\n—\n' + 
    tabela.map(item => `${item.tempo} dias: ${item.valor} moedas\n`).join('') +
    '\n📝 *Tutorial para alugar a chave*:\n1. Escolha o número de dias que deseja alugar a chave.\n2. Digite o número de dias como um comando (por exemplo: "comprar-chave 5").\n3. Certifique-se de ter saldo suficiente em sua conta.\n4. A chave será gerada e enviada para você após o pagamento ser confirmado.\n5. Caso tenha saldo insuficiente, você será notificado sobre o erro.\n6. Aproveite o serviço!';
};

exports.infoPremium = (prefix) => {
return `⭐ - Aprenda como configurar o sistema de premium temporário:\n–\n→ Para adicionar um usuário à lista Premium, use o comando: *!AddPremium*.\n• Exemplo: *!AddPremium @/dias*\n\t• Observação:\n\t\t→ Se não desejar especificar a quantidade de dias, você pode optar pelo valor 0 *(INFINITY ∞)* na hora da execução do comando.\n\t\t→ Você optar de mencionar o usuário (em grupos) ou digitar o número do usuário (no privado).\n\t\t→ Após adicionar este usuário à lista, ele terá direito à uso de todos os comandos Premiuns.\n–\n→ Para realizar a remoção de um usuário da lista Premium, use o comando *!DelPremium*.\n\t• Exemplo: *!DelPremium @*\n\t• Observação:\n\t\t→ Ao remover este usuário da lista, todos os benefícios do mesmo como Premium será removido.\n\t\t→ Você pode mencionar o usuário em um grupo ou inserir o número do usuário no privado ou em um grupo onde ele não esteja presente.`
}

exports.infoCmdPremium = (prefix) => {
return `⭐ - Aprenda como configurar o sistema de comandos premiuns:\n–\n• Para adicionar um comando exclusivo para usuários premium:\n\t↳ Comando: *${prefix}Addcmdprem*\n→ Acesse o menu principal, escolha entre os outros menus e selecione o comando desejado. Em seguida, use o comando acima para adicioná-lo à lista, lembrando de digitá-lo exatamente como está no menu.\n–\n• Para remover um comando exclusivo para usuários premium:\n\t↳ Comando: *${prefix}Delcmdprem*\n→ Esse comando removerá o comando da lista mencionada acima, excluindo automaticamente da lista de Comandos.\n–\n• Para verificar os comandos atualmente na lista:\n\t↳ Comando: *${prefix}Cmdpremlist*\n→ Esse comando exibirá todos os comandos presentes na lista atual. Lembre-se de que qualquer usuário pode utilizar este comando.`
}

exports.infoCommandAds = (prefix) => {
return `⚠️ Como configurar o comando de divulgação automática em seu grupo? Estes são os comandos responsáveis pela configuração, leia um por um:

*1.* ${prefix}Setads Mensagem|Tempo
> Defina uma mensagem para anunciar e defina o tempo, o tempo você irá colocar depois da |, ou seja, o tempo você irá escolher s(segundos), m(minutos), h(horas) e d(dias), *Veja:*
• [Prefixo]Setads Segue no insta|10m
Obs: _De 10 em 10 min será anunciado a mensagem a qual foi definida._
> Também você pode definir imagens e só mencionar ela quando for executar o comando acima. Boa sorte!

*2.* ${prefix}Delads Numeração (Ex: 1)
> Coloque o número do anúncio após o comando,  mas lembre-se antes de executar a ação confira a lista de anúncios definidos no grupo.

*3.* ${prefix}Stopads | ${prefix}Startads
> Ativação e desativação dos anúncios dentro do seu grupo.

*4.* ${prefix}Listads
> Ver na lista a mensagem, horários e como foi registrado em seu grupo.`
}