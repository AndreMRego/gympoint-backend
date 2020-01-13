import Mail from '../../lib/Mail';

class AnswerMail {
  get key() {
    return 'AnswerMail';
  }

  async handle({ data }) {
    const { help_order } = data;

    console.log(help_order);
    await Mail.sendMail({
      to: `${help_order.Student.name} <${help_order.Student.email}>`,
      subject: `Nova resposta para o pedido de auxílio #${help_order.id}`,
      template: 'answer',
      context: {
        student: help_order.Student.name,
        question: help_order.question,
        answer: help_order.answer,
      },
    });
  }
}

export default new AnswerMail();
