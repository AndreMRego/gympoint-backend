import Sequelize, { Model } from 'sequelize';
import { formatDistanceStrict } from 'date-fns';
import pt from 'date-fns/locale/pt';

class Student extends Model {
  static init(sequelize) {
    super.init(
      {
        name: Sequelize.STRING,
        email: Sequelize.STRING,
        nasc_date: Sequelize.DATE,
        age: {
          type: Sequelize.VIRTUAL,
          get() {
            return formatDistanceStrict(new Date(), this.nasc_date, {
              locale: pt,
            });
          },
        },
        weight: Sequelize.DECIMAL(5, 2),
        height: Sequelize.DECIMAL(4, 2),
      },
      {
        sequelize,
      }
    );

    this.addHook('afterInit');

    return this;
  }
}

export default Student;
