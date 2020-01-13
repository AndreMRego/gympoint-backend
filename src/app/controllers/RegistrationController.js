import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import ConfirmationMail from '../jobs/ConfirmationMail';
import Queue from '../../lib/Queue';

class Registrationcontroller {
  async show(req, res) {
    const registration = await Registration.findByPk(req.params.id, {
      include: [
        {
          model: Plan,
          attributes: ['id', 'title', 'duration', 'price'],
        },
        {
          model: Student,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(registration);
  }

  async index(req, res) {
    const { page = 1 } = req.query;

    const registrations = await Registration.findAll({
      attributes: ['id', 'start_date', 'end_date', 'price', 'active'],
      order: [['start_date', 'DESC']],
      limit: 20,
      offset: (page - 1) * 20,
      include: [
        {
          model: Plan,
          attributes: ['id', 'title'],
        },
        {
          model: Student,
          attributes: ['id', 'name'],
        },
      ],
    });

    return res.json(registrations);
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number(),
      plan_id: Yup.number(),
      start_date: Yup.date(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const registration = await Registration.findByPk(req.params.id);

    if (!registration) {
      return res.status(400).json({ error: 'Registration not found' });
    }

    const { student_id, plan_id, start_date } = req.body;

    const student = await Student.findByPk(student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const end_date = addMonths(parseISO(start_date), plan.duration);

    const { id, price } = await registration.update({
      end_date,
      price: plan.total,
      ...req.body,
    });

    return res.json({ id, student_id, plan_id, price });
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      student_id: Yup.number().required(),
      plan_id: Yup.number().required(),
      start_date: Yup.date().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation Fails' });
    }

    const student = await Student.findByPk(req.body.student_id);

    if (!student) {
      return res.status(401).json({ error: 'Student not found' });
    }

    const plan = await Plan.findByPk(req.body.plan_id);

    if (!plan) {
      return res.status(401).json({ error: 'Plan not found' });
    }

    const end_date = addMonths(parseISO(req.body.start_date), plan.duration);

    const registration = await Registration.create({
      end_date,
      price: plan.total,
      ...req.body,
    });

    await Queue.add(ConfirmationMail.key, {
      student,
      plan,
      registration,
    });

    return res.json(registration);
  }

  async delete(req, res) {
    const registration = await Registration.findByPk(req.params.id);

    await registration.destroy();

    return res.send();
  }
}

export default new Registrationcontroller();
