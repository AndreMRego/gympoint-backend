import * as Yup from 'yup';
import { addMonths, parseISO } from 'date-fns';
import Registration from '../models/Registration';
import Student from '../models/Student';
import Plan from '../models/Plan';

import Mail from '../../lib/Mail';

class Registrationcontroller {
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

    const existsRegistration = await Registration.findOne({
      where: {
        student_id: student.id,
      },
    });

    if (existsRegistration) {
      return res.status(400).json({ error: 'Registration already exists' });
    }

    const end_date = addMonths(parseISO(req.body.start_date), plan.duration);
    const price = plan.duration * plan.price;

    const registration = await Registration.create({
      end_date,
      price,
      ...req.body,
    });

    await Mail.sendMail({
      to: `${student.name} <${student.email}>`,
      subject: 'Matrícula Realizada com Sucesso!',
      text: 'Você tem uma nova matricula',
    });

    return res.json(registration);
  }
}

export default new Registrationcontroller();
