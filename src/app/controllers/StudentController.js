import { Op } from 'sequelize';
import * as Yup from 'yup';
import Student from '../models/Student';
import User from '../models/User';

class StudentController {
  async show(req, res) {
    const {
      id,
      name,
      email,
      nasc_date,
      age,
      weight,
      height,
    } = await Student.findByPk(req.params.id);

    return res.json({ id, name, email, nasc_date, age, weight, height });
  }

  async index(req, res) {
    const { q = '', page = 1 } = req.query;

    const students = await Student.findAll({
      where: {
        name: {
          [Op.iLike]: `%${q}%`,
        },
      },
      order: ['name'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(students);
  }

  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      nasc_date: Yup.date().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const userExists = await User.findOne({ where: { email: req.body.email } });

    if (userExists) {
      return res.status(400).json({ error: 'User already exists.' });
    }
    const adminExists = await User.findByPk(req.userId);

    if (!adminExists) {
      return res
        .status(400)
        .json({ error: 'Only administradors can store student' });
    }

    const { id, name, email, age } = await Student.create(req.body);

    return res.json({ id, name, email, age });
  }

  async update(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string(),
      email: Yup.string().email(),
      nasc_date: Yup.date(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { id, name, email, age } = await student.update(req.body);

    return res.json({ id, name, email, age });
  }

  async delete(req, res) {
    const student = await Student.findByPk(req.params.id);

    await student.destroy();

    return res.send();
  }
}

export default new StudentController();
