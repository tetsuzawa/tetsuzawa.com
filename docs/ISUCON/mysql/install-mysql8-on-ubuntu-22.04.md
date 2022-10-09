# Ubuntu 22.04 でmysql8.0をインストール

clientも入る。

```shell
sudo apt update && sudo apt install -y mysql-server
```

ログイン

※ ポイント

- sudo 無いとログインできない
- パスワードは空

```shell
sudo mysql -uroot -p
```