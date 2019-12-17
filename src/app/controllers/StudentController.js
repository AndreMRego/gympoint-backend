import * as Yup from 'yup';
import Student from '../models/Student';
import User from '../models/User';

class StudentController {
  async store(req, res) {
    const schema = Yup.object().shape({
      name: Yup.string().required(),
      email: Yup.string()
        .email()
        .required(),
      age: Yup.number().required(),
      weight: Yup.number().required(),
      height: Yup.number().required(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
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
      age: Yup.number(),
      weight: Yup.number(),
      height: Yup.number(),
    });

    if (!(await schema.isValid(req.body))) {
      return res.status(400).json({ error: 'Validation fails' });
    }

    const { email } = req.body;

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const { id, name, age } = await student.update(req.body);

    return res.json({ id, name, email, age });
  }
}

export default new StudentController();
