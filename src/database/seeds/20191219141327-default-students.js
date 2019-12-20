module.exports = {
  up: queryInterface => {
    return queryInterface.bulkInsert(
      'students',
      [
        {
          name: 'Andre Rego',
          email: 'andrer@gmail.com',
          nasc_date: '1997-02-13',
          weight: 70,
          height: 1.68,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Marcelo Santos',
          email: 'marcelos@gmail.com',
          nasc_date: '1995-10-20',
          weight: 75,
          height: 1.71,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'João Martins',
          email: 'joaom@gmail.com',
          nasc_date: '1994-05-18',
          weight: 68,
          height: 1.66,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Kleiver Nascimento',
          email: 'kleivern@gmail.com',
          nasc_date: '1993-11-30',
          weight: 74,
          height: 1.75,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'Amanda Reis',
          email: 'amandar@gmail.com',
          nasc_date: '1997-08-13',
          weight: 65,
          height: 1.69,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: () => {},
};
