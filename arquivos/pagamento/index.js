const requests = require("./settings/requests.js");

function generateNumeric(tamanho = 16) {
    const numberRandom = '962611528629083762';
    let resposta = '';
    for (let i = 0; i < tamanho; i++) {
        const indiceAleatorio = Math.floor(Math.random() * numberRandom.length);
        resposta += numberRandom.charAt(indiceAleatorio);
    }
    return `${resposta}`;
}

class payment {
  constructor(access_token) {
    this.access_token = "Bearer " + access_token;
    this.user_id = null;
    this.payment_id = null;
    this.user_name = null;
    this.value = null;
  }

  async expire_date(time) {
    this.date = new Date();
    this.date.setMinutes(this.date.getMinutes() + 30);
    this.sum_time = time * 60;
    this.max_time = new Date(
      this.date.getTime() + this.sum_time - this.date.getTimezoneOffset() * 60000
    );
    return this.max_time.toISOString().slice(0, -1) + "-10:00";
  }

  async create_payment(value, time = 30) {
    this.expire = await this.expire_date(time);
    try {
      this.response = await requests.requests({
        method: "POST",
        uri: "https://api.mercadopago.com/v1/payments", 
        headers: {
          Authorization: this.access_token,
          'X-Idempotency-Key': generateNumeric() // Substitua 'your-unique-id' por um ID único para cada requisição
        },
        json: {
          transaction_amount: parseFloat(value),
          description: "MORY STORE OFICIAL",
          payment_method_id: "pix",
          payer: {
            email: 'isaacdasilva518@gmail.com',
            identification: { type: '000.375.093-06', number: '+55 88 98831-2319' },
            address: {},
          },
          date_of_expiration: this.expire,
        },
      });

      this.payment = this.response.res.body;
      if (this.payment.id) {
        this.payment_id = this.payment.id.toString();
        return {
          payment_id: this.payment_id,
          copy_paste: this.payment.point_of_interaction.transaction_data.qr_code,
          qr_code: this.payment.point_of_interaction.transaction_data.qr_code_base64,
        };
      } else {
        console.error("Erro ao obter o ID do pagamento");
        return null;
      }
    } catch (error) {
      console.error("Erro ao criar pagamento:", error);
      return null;
    }
  }
  
  async check_payment() {
    this.response = await requests.requests({
      method: "GET",
      uri: "https://api.mercadopago.com/v1/payments/" + this.payment_id,
      headers: {
        Authorization: this.access_token
      }
    })
    this.get_pay = JSON.parse(this.response.res.body)

    return {status: this.get_pay.status}
  }
}

module.exports = { payment };