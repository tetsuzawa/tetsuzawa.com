# MySQL8.0 で外部からアクセスできるユーザーを作る

ユーザー作成

```mysql
CREATE USER 'admin'@'%' IDENTIFIED BY 'password';
```

権限付与

```mysql
GRANT ALL ON *.* TO 'admin'@'%';
```

※ mysql-server自体が外部からアクセスできるようになってないといけない。変更後は再起動が必要

```diff title="/etc/mysql/mysql.conf.d/mysqld.cnf"
- bind-address           = 127.0.0.1
+ bind-address            = 0.0.0.0
```

```shell
sudo systemctl restart mysql
```


