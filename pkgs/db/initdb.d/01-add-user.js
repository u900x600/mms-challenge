connect('mongodb://localhost/admin')
  .createUser({
    user: 'mms',
    pwd: 'mms',
    roles: [ 
      { role: 'userAdminAnyDatabase', db: 'admin' },
      { role: 'readWriteAnyDatabase', db: 'admin' },
      { role: 'readWriteAnyDatabase', db: 'admin' },
    ]
  });