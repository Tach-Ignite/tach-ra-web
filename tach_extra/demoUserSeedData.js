import bcrypt from 'bcryptjs';

const data = {
  users: [
    {
      name: 'Demo User',
      email: 'user@tachcolorstore.com',
      password: bcrypt.hashSync('userpassword', 10),
      roles: [],
      addresses: [],
    },
    {
      name: 'Demo Admin',
      email: 'admin@tachcolorstore.com',
      password: bcrypt.hashSync('adminpassword', 10),
      roles: ['Admin'],
      addresses: [],
    },
  ],
};

export default data;
