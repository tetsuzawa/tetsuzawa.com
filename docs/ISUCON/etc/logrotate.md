# logrotate

```shell
sudo logrotate -f /home/isucon/etc/logrotate.d/<foo>
```

で実行可能

**`/home/isucon/etc/logrotate.d/*` はroot所有・644で作ること。**

- missingok: ログファイルが無くてもOK
- ifempty: ログファイルが無かったら作る

```title="/home/isucon/etc/logrotate.d/nginx"
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
```

```title="/home/isucon/etc/logrotate.d/app"
/home/isucon/log/app/app.log {
  missingok
  ifempty
  nocompress
  copytruncate
  rotate 10
  su isucon isucon
}
```
