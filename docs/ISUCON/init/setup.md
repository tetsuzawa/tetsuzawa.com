# 最初にやること

## githubのリポジトリ作成

## デプロイキーの作成

```shell
ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/isucon-xx-xxxxxx
```

## githubにデプロイキーを登録

allow write accessにチェックを入れる

## デプロイキーを各インスタンスにrsync

```shell
export DEPLOY_KEY_NAME=isucon-xx-xxxxxx
export ISU_USER=isucon
export TARGET_HOSTS="isu_1 isu_2 isu_3"
bash -c '
set -eu
for HOST in $TARGET_HOSTS; do
    echo "--------------------------------------"
    echo "host: $HOST, DEPLOY_KEY_NAME: $DEPLOY_KEY_NAME"
    
    rsync -avz ~/.ssh/$DEPLOY_KEY_NAME $ISU_USER@$HOST:/home/isucon/.ssh/id_rsa
    rsync -avz ~/.ssh/$DEPLOY_KEY_NAME.pub $ISU_USER@$HOST:/home/isucon/.ssh/id_rsa.pub
done'
```

## (一応) デプロイキーのpub keyで各インスタンス内から相互にsshできるようにする

```shell
printenv | sort | grep -E '^isu_.+=' | bash -c 'while IFS="=" read -r host ip; do echo -e "Host $host\n    HostName $ip\n    User isucon\n    IdentityFile ~/.ssh/id_rsa\n    ServerAliveInterval 60\n    StrictHostKeyChecking no\n"; done' > /tmp/sshd_config
bash -c '
set -eu
for HOST in $TARGET_HOSTS; do 
    ssh $ISU_USER@$HOST "cat /home/isucon/.ssh/id_rsa.pub >> /home/isucon/.ssh/authorized_keys"
    rsync -avz /tmp/sshd_config $ISU_USER@$HOST:/home/isucon/.ssh/config
done'
```


## gitの設定

gitは最新を使いたいのでppaを追加してインストール

各インスタンス内で↓を実行

```shell
sudo add-apt-repository ppa:git-core/ppa && sudo apt update && sudo apt install -y git
git config --global core.filemode false && \
git config --global user.name "isucon" && \
git config --global user.email "root@example.com" && \
git config --global color.ui auto && \
git config --global core.editor 'vim -c "set fenc=utf-8"' && \
git config --global push.default current && \
git config --global init.defaultBranch main && \
git config --global alias.st status 
```

```shell
bash -c '
set -eux
for HOST in $TARGET_HOSTS; do
    ssh $ISU_USER@$HOST "sudo add-apt-repository ppa:git-core/ppa && sudo apt update && sudo apt install -y git"
    ssh $ISU_USER@$HOST git config --global core.filemode false
    ssh $ISU_USER@$HOST git config --global user.name "isucon"
    ssh $ISU_USER@$HOST git config --global user.email "root@example.com"
    ssh $ISU_USER@$HOST git config --global color.ui auto
    ssh $ISU_USER@$HOST "git config --global core.editor \'vim -c \"set fenc=utf-8\"\'"
    ssh $ISU_USER@$HOST git config --global push.default current
    ssh $ISU_USER@$HOST git config --global init.defaultBranch main
    ssh $ISU_USER@$HOST git config --global alias.st status 
done'
```


## 各種ツールのインストール

### ubuntu && x86_64の場合

```shell title="setup-tools.sh"
#!/usr/bin/env bash

set -eu

# tools
echo -e "\n--------------------  tools  --------------------\n"
sudo apt install -y unzip make

# alp
echo -e "\n--------------------  alp  --------------------\n"
curl -sSLo alp.zip https://github.com/tkuchiki/alp/releases/download/v1.0.14/alp_linux_amd64.zip
unzip alp.zip
sudo install alp /usr/local/bin/alp
rm -rf alp alp.zip
alp --version

# alp-trace
echo -e "\n--------------------  alp-trace  --------------------\n"
curl -sSLo alp-trace.zip https://github.com/tetsuzawa/alp-trace/releases/download/v0.0.8/alp-trace_linux_amd64.zip
unzip alp-trace.zip
sudo install alp-trace /usr/local/bin/alp-trace
rm -rf alp-trace alp-trace.zip
alp-trace --version


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
curl -sSLo go.tar.gz https://go.dev/dl/go1.21.0.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go.tar.gz
sudo rm -rf go.tar.gz
echo 'export PATH=/usr/local/go/bin:$PATH' >> ~/.bash_profile
echo 'export PATH=/usr/local/go/bin:$PATH' >> ~/.bashrc
echo 'export PATH=/home/isucon/go/bin:$PATH' >> ~/.bash_profile
echo 'export PATH=/home/isucon/go/bin:$PATH' >> ~/.bashrc
echo 'export GOROOT=' >> ~/.bash_profile
echo 'export GOROOT=' >> ~/.bashrc
echo 'export GOPATH=/home/isucon/go' >> ~/.bash_profile
echo 'export GOPATH=/home/isucon/go' >> ~/.bashrc
export PATH=/usr/local/go/bin:$PATH
export PATH=/home/isucon/go/bin:$PATH
export GOROOT=
export GOPATH=/home/isucon/go
go version


# gh
echo -e "\n--------------------  gh  --------------------\n"
curl -sSLO https://github.com/cli/cli/releases/download/v2.27.0/gh_2.27.0_linux_amd64.tar.gz
tar -xf gh_2.27.0_linux_amd64.tar.gz
sudo install gh_2.27.0_linux_amd64/bin/gh /usr/local/bin/gh
rm -rf gh_2.27.0_linux_amd64*
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
echo -e "\n--------------------  sysstat --------------------\n"
sudo apt install -y sysstat


# openresty
echo -e "\n--------------------  openresty  --------------------\n"
sudo systemctl disable nginx
sudo systemctl stop nginx
sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates
wget -O - https://openresty.org/package/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/openresty.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/ubuntu $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/openresty.list > /dev/null
sudo apt-get update
sudo apt-get -y install openresty

# luarocks
echo -e "\n--------------------  luarocks  --------------------\n"
wget http://luarocks.org/releases/luarocks-2.0.13.tar.gz
tar -xzvf luarocks-2.0.13.tar.gz
cd luarocks-2.0.13/
./configure --prefix=/usr/local/openresty/luajit \
    --with-lua=/usr/local/openresty/luajit/ \
    --lua-suffix=jit \
    --with-lua-include=/usr/local/openresty/luajit/include/luajit-2.1
make
sudo make install
cd ..
rm -rf luarocks-2.0.13 luarocks-2.0.13.tar.gz

# luarocks modules
echo -e "\n--------------------  luarocks modules --------------------\n"
sudo /usr/local/openresty/luajit/bin/luarocks install lua-resty-cookie
sudo /usr/local/openresty/luajit/bin/luarocks install lua-resty-jit-uuid



# listroute 
# see https://github.com/tetsuzawa/listroute
# curl -L -o listroute.tar.gz https://github.com/tetsuzawa/listroute/releases/download/v0.0.5/listroute_0.0.5_linux_amd64.tar.gz
# tar xvf listroute.tar.gz -C /tmp
# sudo install /tmp/listroute /usr/local/bin/
# sudo rm -rf listroute.tar.gz 

echo -e "\n\nall ok\n"
```

各インスタンスで

```shell
bash setup-tools.sh
```

```shell
bash -c '
set -eux
for HOST in $TARGET_HOSTS; do
    rsync -avz setup-tools.sh $ISU_USER@$HOST:/tmp/
    ssh $ISU_USER@$HOST bash /tmp/setup-tools.sh
done'
```


## レポジトリ作成 & 初回push

```shell
git init
git config --global --unset-all core.filemode
git config --unset-all core.filemode
git config core.filemode false
git commit -m "empty" --allow-empty
git remote add origin git@github.com:<user name>/<repo name>.git
git add ...
git push -u origin main
```

## .gitをisu_2, isu_3と共有

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

## サービスの起動設定を確認したいとき

```shell
sudo systemctl cat isucon-xx.service
```

## LISTEN中のポートとプロセス名を確認したいとき

```shell
sudo netstat -ntlp
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
git pull origin main
sudo rm -rf /etc/nginx
sudo ln -s /home/isucon/etc/nginx /etc/nginx
sudo chmod 775 -R /etc/nginx
sudo chown -R root:root /etc/nginx
mkdir -p /home/isucon/log/nginx
sudo nginx -t
sudo systemctl restart nginx
sudo systemctl status nginx
```

### openrestyをgit addしたいとき

aで

```shell
mkdir -p /home/isucon/etc
mkdir -p /home/isucon/log /home/isucon/log/nginx
mkdir -p /home/isucon/backup/etc
cp -r /usr/local/openresty/nginx /home/isucon/backup/etc/nginx
sudo mv /usr/local/openresty/nginx /home/isucon/etc/nginx
sudo ln -s /home/isucon/etc/nginx /usr/local/openresty/nginx
sudo chmod 775 -R /home/isucon/etc/nginx
sudo chmod 775 /home/isucon/log/nginx
sudo chmod 777 -R /home/isucon/log/nginx/*
sudo chmod 777 -R /var/log/nginx
sudo openresty -t
```

```shell
git add /home/isucon/backup /home/isucon/etc
git commit -m "add openresty conf"
git push origin main
```

b, cで

```shell
git pull origin main
sudo rm -rf /usr/local/openresty/nginx
sudo ln -s /home/isucon/etc/nginx /usr/local/openresty/nginx
sudo chmod 775 /usr/local/openresty/nginx
sudo chown -R root:root /usr/local/openresty/nginx
mkdir -p /home/isucon/log/nginx
sudo openresty -t
sudo systemctl restart openresty
sudo systemctl status openresty
```


## 計測前後のスクリプトを置く

[スクリプト](./prepare-analyze)

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
mkdir -p /home/isucon/etc/logrotate.d
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

sudo chown root:root -R /home/isucon/etc/logrotate.d
sudo chmod 644 /home/isucon/etc/logrotate.d/*
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

chown root:root -R /home/isucon/etc/logrotate.d
chmod 644 /home/isucon/etc/logrotate.d/*
```


## github subscribe

```shell
/github subscribe tetsuzawa/isucon-xx-xxx comments:"channel"
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


## アプリケーションの仕様確認

## 初期化の方法確認
