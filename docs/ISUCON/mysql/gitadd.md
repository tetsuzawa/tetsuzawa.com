# mysql8をgit addしたいとき

```shell
mkdir -p ./etc
mkdir -p ./backup/etc
sudo cp -r /etc/mysql ./backup/etc/mysql
sudo mkdir -p /home/isucon/etc/mysql/conf.d
sudo mkdir -p /home/isucon/etc/mysql/mysql.conf.d
sudo ln /etc/mysql/conf.d/mysql.cnf /home/isucon/etc/mysql/conf.d/mysql.cnf
sudo ln /etc/mysql/conf.d/mysqldump.cnf /home/isucon/etc/mysql/conf.d/mysqldump.cnf
sudo ln /etc/mysql/mysql.conf.d/mysql.cnf /home/isucon/etc/mysql/mysql.conf.d/mysql.cnf
sudo ln /etc/mysql/mysql.conf.d/mysqld.cnf /home/isucon/etc/mysql/mysql.conf.d/mysqld.cnf
sudo chmod 755 -R /home/isucon/etc/mysql
mkdir -p /var/log/mysql
sudo chmod 777 -R /var/log/mysql
``````

```shell
git add etc/mysql
git commit -m "add mysql conf"
git push
```

b, cで

```shell
git pull
sudo rm -rf /etc/mysql/conf.d/mysql.cnf       
sudo rm -rf /etc/mysql/conf.d/mysqldump.cnf   
sudo rm -rf /etc/mysql/mysql.conf.d/mysql.cnf 
sudo rm -rf /etc/mysql/mysql.conf.d/mysqld.cnf
sudo ln /home/isucon/etc/mysql/conf.d/mysql.cnf         /etc/mysql/conf.d/mysql.cnf       
sudo ln /home/isucon/etc/mysql/conf.d/mysqldump.cnf     /etc/mysql/conf.d/mysqldump.cnf   
sudo ln /home/isucon/etc/mysql/mysql.conf.d/mysql.cnf   /etc/mysql/mysql.conf.d/mysql.cnf 
sudo ln /home/isucon/etc/mysql/mysql.conf.d/mysqld.cnf  /etc/mysql/mysql.conf.d/mysqld.cnf
sudo chmod 775 -R /etc/mysql
sudo chown -R root:root /etc/mysql

sudo systemctl restart mysql
sudo systemctl status mysql
```
