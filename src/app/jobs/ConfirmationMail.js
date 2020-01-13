import { format, parseISO } from 'date-fns';

import formatPrice from '../../utils/formatPrice';
import Mail from '../../lib/Mail';

class ConfirmationMail {
  get key() {
    return 'ConfirmationMail';
  }

  async handle({ data }) {
    const { student, plan, registration } = data;

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Bem vindo a Gympoint!',
      template: 'confirmation',
      context: {
        student: student.name,
        plan: plan.title,
        start_date: format(parseISO(registration.start_date), 'dd/MM/yyyy'),
        end_date: format(parseISO(registration.end_date), 'dd/MM/yyyy'),
        price: formatPrice(plan.total),
      },
    });
  }
}

export default new ConfirmationMail();
