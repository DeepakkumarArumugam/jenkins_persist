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

See `jenkins-persist --help` for options:

	Usage:
	  jenkins-persist [options]

	Options:
	  --init      Initialize Database
	  --build     Write to the build table
	  --release   Write to the release table
	  -h,--help   Display this message

