wget http://www.almhuette-raith.at/apache-log/access.log

```
process
  .on('unhandledRejection', (reason, p) => {
    console.error(reason, 'Unhandled Rejection at Promise', p);
  })
  .on('uncaughtException', err => {
    console.error(err, 'Uncaught Exception thrown');
    process.exit(1);
  });
```

```
mongodb://heroku_vv3n7lzh:lghqhbp9ibhtguom2sjoi43u5a@ds125723.mlab.com:25723/heroku_vv3n7lzh
```
