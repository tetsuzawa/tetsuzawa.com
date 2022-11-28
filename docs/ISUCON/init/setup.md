# 最初にやること

## githubにsshできるようにする

AWS上で作ったssh keyの公開鍵をgithubにも登録しておくと便利

KEY_NAME=<ssh key名>

```shell
rsync -avz ~/.ssh/$KEY_NAME.pem a:~/.ssh/id_rsa && rsync -avz ~/.ssh/$KEY_NAME.pub a:~/.ssh/id_rsa.pub
rsync -avz ~/.ssh/$KEY_NAME.pem b:~/.ssh/id_rsa && rsync -avz ~/.ssh/$KEY_NAME.pub b:~/.ssh/id_rsa.pub
rsync -avz ~/.ssh/$KEY_NAME.pem c:~/.ssh/id_rsa && rsync -avz ~/.ssh/$KEY_NAME.pub c:~/.ssh/id_rsa.pub
```

各インスタンス内で↓を実行

```shell
git config --global core.filemode false && \
git config --global user.name "isucon" && \
git config --global user.email "root@example.com" && \
git config --global color.ui auto && \
git config --global core.editor 'vim -c "set fenc=utf-8"' && \
git config --global push.default current && \
git config --global init.defaultBranch main && \
git config --global alias.st status 
```


## 各種ツールのインストール

### ubuntu && x86_64の場合

```shell title="setup-tools.sh"
#!/usr/bin/env bash

set -eu

# alp
echo -e "\n--------------------  alp  --------------------\n"
curl -sSLo alp.zip https://github.com/tkuchiki/alp/releases/download/v1.0.12/alp_linux_amd64.zip
unzip alp.zip
sudo install alp /usr/local/bin/alp
rm -rf alp alp.zip
alp --version


# netdata
# echo -e "\n--------------------  netdata  --------------------\n"
# sudo yes | curl -Lo /tmp/netdata-kickstart.sh https://my-netdata.io/kickstart.sh && yes | sudo sh /tmp/netdata-kickstart.sh --no-updates all


# vim
echo -e "\n--------------------  vim  --------------------\n"
sudo apt install -y vim
vim --version


# pt-query-digest
echo -e "\n--------------------  pt-query-digest  --------------------\n"
sudo apt install -y percona-toolkit
pt-query-digest --version


# go
echo -e "\n--------------------  go  --------------------\n"
curl -sSLo go.tar.gz https://go.dev/dl/go1.19.2.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go.tar.gz
sudo rm -rf go.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bash_profile
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export PATH=$PATH:/home/isucon/go/bin' >> ~/.bash_profile
echo 'export PATH=$PATH:/home/isucon/go/bin' >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:/home/isucon/go/bin
go version


# gh
echo -e "\n--------------------  gh  --------------------\n"
curl -sSLO https://github.com/cli/cli/releases/download/v2.17.0/gh_2.17.0_linux_amd64.tar.gz
tar -xf gh_2.17.0_linux_amd64.tar.gz
sudo install gh_2.17.0_linux_amd64/bin/gh /usr/local/bin/gh
rm -rf gh_2.17.0_linux_amd64*
gh --version


# trdsql
curl -sSLO https://github.com/noborus/trdsql/releases/download/v0.10.1/trdsql_v0.10.1_linux_amd64.zip
unzip trdsql_v0.10.1_linux_amd64.zip
sudo install trdsql_v0.10.1_linux_amd64/trdsql /usr/local/bin/trdsql
rm -rf trdsql_v0.10.1_linux_amd64*
trdsql -version


# jq
sudo apt install -y jq


# netstat
echo -e "\n--------------------  netstat  --------------------\n"
sudo apt install -y net-tools


# dstat
echo -e "\n--------------------  dstat  --------------------\n"
sudo apt install -y dstat


# sysstat
echo -e "\n--------------------  dstat  --------------------\n"
sudo apt install -y sysstat


# listroute 
# see https://github.com/tetsuzawa/listroute
curl -L -o listroute.tar.gz https://github.com/tetsuzawa/listroute/releases/download/v0.0.5/listroute_0.0.5_linux_amd64.tar.gz
tar xvf listroute.tar.gz -C /tmp
sudo install /tmp/listroute /usr/local/bin/
sudo rm -rf listroute.tar.gz 

echo -e "\n\nall ok\n"
```

```shell
chmod +x setup-tools.sh

rsync -avz setup-tools.sh a:~/
rsync -avz setup-tools.sh b:~/
rsync -avz setup-tools.sh c:~/
```

各インスタンスで

```shell
./setup-tools.sh
```


## レポジトリ作成 & 初回push

```shell
git init
git config core.filemode false
git commit -m "empty" --allow-empty
git remote add origin git@github.com:<user name>/<repo name>.git
git push -u origin main
```

## .gitをb, cと共有

```shell
rsync -avz .git isucon@192.168.0.12:~/
rsync -avz .git isucon@192.168.0.13:~/
```


## 初期ファイルをgit add

`du -sh *` とか`ls -alh` とかで頑張る


### サービス一覧を確認したいとき

```shell
sudo systemctl list-units --type=service
```

### nginxをgit addしたいとき

aで

```shell
mkdir -p ./etc
mkdir -p ./backup/etc
cp -r /etc/nginx ./backup/etc/nginx
sudo mv /etc/nginx ./etc/nginx
sudo ln -s /home/isucon/etc/nginx /etc/nginx
sudo chmod 775 -R /home/isucon/etc/nginx
sudo chmod 777 -R /var/log/nginx
#@#sudo chown isucon:isucon -R /home/isucon/etc/nginx
sudo nginx -t
```

```shell
git add etc/nginx
git commit -m "add nginx conf"
git push
```

b, cで

```shell
git pull
sudo rm -rf /etc/nginx
sudo ln -s /home/isucon/etc/nginx /etc/nginx
sudo chmod 775 -R /etc/nginx
sudo chown -R root:root /etc/nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx
```

### mysql8をgit addしたいとき

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


## 計測前後のスクリプトを置く

```shell
mkdir -p $HOME/result
```


## appのログ吐き出し先を変える

```shell
mkdir -p $HOME/log
```


よしなに

## nginxをalpに対応させる&吐き出し先を変える

access logの設定を [access logをalpに対応する](../nginx/alp) を参考にやる。

メインのファイルを読んで [analyze.sh](./prepare-analyze) のalpのmatch stringを書き換える。

```shell
mkdir -p $HOME/log
```


## logrotateのconfを置く

```shell
sudo cat << EOF > /home/isucon/etc/logrotate.d/nginx 
/home/isucon/log/nginx/access.log {
  missingok
  ifempty
  nocompress
  copytruncate
  rotate 10
  su isucon isucon
}

/home/isucon/log/nginx/error.log {
  missingok
  ifempty
  nocompress
  copytruncate
  rotate 10
  su isucon isucon
}
EOF
```

```shell
sudo cat << EOF > /home/isucon/etc/logrotate.d/app
/home/isucon/log/app/app.log {
  missingok
  ifempty
  nocompress
  copytruncate
  rotate 10
  su isucon isucon
}
EOF
```

### goファイルからルーティングの一覧を出力したいとき


```shell
go vet -vettool=`which listroute` ./...
```

matcher functionを変えたいとき

```shell
go vet -vettool=`which listroute` -listroute.matcherFunctions=Get,Post,Handle
```

## mysql接続の環境変数を読めるように調整する

↓をenv.shに追加しないとprepare.shが動かない

```shell
DB_HOST=
DB_PORT=
DB_USER=
DB_PASS=
DB_DATABASE=
```
