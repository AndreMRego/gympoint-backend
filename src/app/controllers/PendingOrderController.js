import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

import AnswerMail from '../jobs/AnswerMail';
import Queue from '../../lib/Queue';
import Student from '../models/Student';

class PendingOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const pending_answers = await HelpOrder.findAll({
      where: {
        answer: null,
      },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
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

    const help_order = await HelpOrder.findByPk(req.params.id, {
      include: [
        {
          model: Student,
          attributes: ['name', 'email'],
        },
      ],
    });

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

    await Queue.add(AnswerMail.key, {
      help_order,
    });

    return res.json({ id, student_id, question, answer, answer_at });
  }
}

export default new PendingOrderController();
