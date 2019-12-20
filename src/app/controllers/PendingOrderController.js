import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class PendingOrderController {
  async index(req, res) {
    const pending_answers = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      order: ['created_at'],
      attributes: ['id', 'question'],
    });

    return res.json(pending_answers);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      answer: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const help_order = await HelpOrder.findByPk(req.params.id);

    if (!help_order) {
      return res.status(400).json({ error: 'Help Order not found' });
    }

    const {
      id,
      student_id,
      question,
      answer,
      answer_at,
    } = await help_order.update(req.body);

    return res.json({ id, student_id, question, answer, answer_at });
  }
}

export default new PendingOrderController();
