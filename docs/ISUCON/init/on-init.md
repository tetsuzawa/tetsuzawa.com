# 競技が開始したらやること

## isucon-setupのansibleの実行

```shell
ansible-playbook sites.yml -vv
```

失敗したら↓でやり直すと良い

```shell
ansible-playbook sites.yml -vv --start-at-task='<task名>'
```

特定のタスクをスキップしたいときはtagsをつけて --skip-tags すればよい

```yaml
- name: want to skip
  ansible.builtin.shell:
    cmd: |
      ...
  tags:
    - onlyvm
```

```shell
ansible-playbook sites.yml -vv --start-at-task='<task名>' --skip-tags 'onlyvm'
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
sudo ss -ntlp
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


### varnishをgit addしたいとき 

aで

```shell
mkdir -p /home/isucon/etc
mkdir -p /home/isucon/backup/etc/varnish
sudo cp -rv /etc/varnish/default.vcl /home/isucon/backup/etc/varnish/defulat.vcl
sudo mv -v /etc/varnish/default.vcl /home/isucon/etc/varnish/default.vcl
sudo ln -s /home/isucon/etc/varnish/default.vcl /etc/varnish/default.vcl
sudo chmod 777 -R /home/isucon/etc/varnish
```

```shell

```


## github subscribe

```shell
/github subscribe tetsuzawa/isucon-xx-xxx comments:"channel"
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