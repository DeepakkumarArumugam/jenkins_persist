Jenkins Persist
===============

The following variables need to be set in your environment:

```shell
export MYSQL_DATABASE='jenkins'
export MYSQL_HOST='localhost'
export MYSQL_PASSWORD=<Your password>
export MYSQL_PORT='3306'
export MYSQL_USER=<Your username>
```

1. `git clone`
2. `cd jenkins_persist`
3. `npm install`
4. `mysql --host=<host> --user=<username> -p < create_db.sql` (**Wipes out jenkins DB**)
5. `source mock_data.sh`
6. `npm start` or `node .` or `node index.js`

