# isucon userの作成


## 作成


```shell
adduser --disabled-password --gecos "" isucon
usermod -aG sudo isucon
echo 'isucon ALL=(ALL) NOPASSWD:ALL' | sudo tee /etc/sudoers.d/isucon
```

## 削除

```
deluser isucon
rm -rf /home/isucon
```

## 注意点

上記コマンドはdebian系であることを前提としている。

`adduser` は `useradd`のラッパーである。


