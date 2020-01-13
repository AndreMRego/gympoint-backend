import * as Yup from 'yup';
import Plan from '../models/Plan';
import User from '../models/User';

class PlanController {
  async show(req, res) {
    const { id, title, duration, price, total } = await Plan.findByPk(
      req.params.id
    );

    return res.json({ id, title, duration, price, total });
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const plans = await Plan.findAll({
      limit: 20,
      offset: (page - 1) * 20,
      attributes: ['id', 'title', 'duration', 'price'],
    });

    return res.json(plans);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string().required(),
      duration: Yup.number().required(),
      price: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const adminExists = await User.findByPk(req.userId);

    if (!adminExists) {
      return res
        .status(400)
        .json({ error: 'Only administradors can store plan' });
    }

    const { id, title, duration, price } = await Plan.create(req.body);

    return res.json({ id, title, duration, price });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      title: Yup.string(),
      duration: Yup.number(),
      price: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const plan = await Plan.findByPk(req.params.id);

    if (!plan) {
      return res.status(400).json({ error: 'Plan not found' });
    }

    const { id, title, duration, price } = await plan.update(req.body);

    return res.json({ id, title, duration, price });
  }

  async delete(req, res) {
    const plan = await Plan.findByPk(req.params.id);

    await plan.destroy();

    return res.send();
  }
}

export default new PlanController();
