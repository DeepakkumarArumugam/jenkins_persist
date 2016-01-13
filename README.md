Jenkins Persist
===============

The following defaults can be overriden with environment variables:

```shell
export MYSQL_DATABASE='jenkins'
export MYSQL_HOST='localhost'
export MYSQL_PORT='3306'
export MYSQL_USER='jenkins'
```
You will still need to set your password though:

```shell
export MYSQL_PASSWORD=<Your password>
```

### Setup:

1. `npm i -g jenkins_persist`
2. `mysql --host=<host> --user=<username> -p < create_db.sql` (**Wipes out jenkins DB**)
3. Set your `MYSQL_PASSWORD`

See `jenkins_persist --help` for options:

	Usage:
	  jenkins-persist [options]

	Options:
	  --init      Initialize Database
	  --build     Write to the build table
	  --release   Write to the release table
	  -h,--help   Display this message

