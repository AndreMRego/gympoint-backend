import * as Yup from 'yup';
import HelpOrder from '../models/HelpOrder';

class HelpOrderController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const student_id = req.params.id;

    const help_orders = await HelpOrder.findAll({
      where: {
        student_id,
      },
      order: ['answer_at'],
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'question', 'answer', 'answer_at'],
    });

    return res.json(help_orders);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      question: Yup.string().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student_id = req.params.id;

    const help_order = await HelpOrder.create({
      student_id,
      ...req.body,
    });

    return res.json(help_order);
  }
}

export default new HelpOrderController();
