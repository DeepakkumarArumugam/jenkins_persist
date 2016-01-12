Jenkins Persist
===============

The following defaults can be overriden with environment variables:

```shell
export MYSQL_DATABASE='jenkins'
export MYSQL_HOST='localhost'
export MYSQL_PORT='3306'
export MYSQL_USER=''
```
You will still need to set your password though:

```shell
export MYSQL_PASSWORD=<Your password>
```

### Setup:

1. `npm i -g jenkins_persist`
2. `mysql --host=<host> --user=<username> -p < create_db.sql` (**Wipes out jenkins DB**)
3. Set your `MYSQL_PASSWORD`
4. In your jenkins build, add `jenkins_persist` on the end of your shell script.


