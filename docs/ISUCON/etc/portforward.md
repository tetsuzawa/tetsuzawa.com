# ポートフォワーディングする

## ssh configに書く

個人的に一番楽





参考: https://qiita.com/mechamogera/items/b1bb9130273deb9426f5

`man ssh`

ローカルから22番でsshできる前提


## aが80でlistenしていて、ローカルのブラウザから8082でアクセスしたい

### ~/.ssh/configに書く場合

```
Host a
    HostName 192.168.0.11
    User ubuntu
    LocalForward 8082 localhost:80
```

### コマンドラインで実行する場合

```shell
ssh -NL 8082:localhost:80 a
```

(ローカルポート:aから見たリモートホスト:aから見たリモートポート)

## aが443でlistenしていて、ローカルのブラウザから8083でアクセスしたい

### ~/.ssh/configに書く場合

```
Host a
    HostName 192.168.0.11
    User ubuntu
    LocalForward 8083 localhost:443
```

### コマンドラインで実行する場合

```shell
ssh -NL 8083:localhost:443 a
```

## b(192.168.0.12) が3306でlistenしていて、a(192.168.0.11)を踏み台にしてmysqlにつなぎたい

### ~/.ssh/configに書く場合

```
Host a
    HostName 192.168.0.11
    User ubuntu
    LocalForward 3306 192.168.0.12:3306
```

### コマンドラインで実行する場合
```shell
ssh -NL 3306:192.168.0.12:3306 a
