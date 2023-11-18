# install

インストール方法

```shell
sudo apt install -y lsb-release

curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg

echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list

sudo apt update
sudo apt install -y redis
```


バージョン確認

```shell
redis-server --version
```


使い方は公式参照

https://github.com/redis/go-redis