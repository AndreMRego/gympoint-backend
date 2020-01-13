import { subDays } from 'date-fns';
import { Op } from 'sequelize';
import Checkin from '../models/Checkin';
import Student from '../models/Student';

class CheckinController {
  async index(req, res) {
    const { page = 1 } = req.query;

    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.findAll({
      where: {
        student_id: student.id,
      },
      order: ['created_at'],
      limit: 20,
      offset: (page - 1) * 20,
    });

    return res.json(checkins);
  }

  async store(req, res) {
    const student = await Student.findByPk(req.params.id);

    if (!student) {
      return res.status(400).json({ error: 'Student not found' });
    }

    const checkins = await Checkin.findAndCountAll({
      where: {
        student_id: student.id,
        created_at: {
          [Op.between]: [subDays(new Date(), 7), new Date()],
        },
      },
    });

    if (checkins.count >= 5) {
      return res
        .status(400)
        .json({ error: 'You can only do 5 checkins during the week ' });
    }

    const checkin = await Checkin.create({
      student_id: student.id,
    });

    return res.json(checkin);
  }
}

export default new CheckinController();
