# 素振りの最初にやること


## 1. リソースを作る

https://github.com/tetsuzawa/isucon-provisioning を使う

```shell
make -C stacks KEY_NAME=<AWS上で作成したssh key名> TFSTATE_BUCKET=<tfstateを置くs3 bucket> SCOPE=<ISUCONの回> apply
```

## 2. ssh config書き換える

tf outputがこんな感じで出てくるのでssh configを書き換えておく

```
IP_A = "35.77.122.102"
IP_B = "52.69.120.236"
IP_BENCH = "43.206.55.19"
IP_C = "13.114.137.88"
```

https://github.com/tetsuzawa/tfoutput_to_ssh_config を使うと便利

`pbpaste | grep -E -o  '([0-9.]+)' | xargs echo -n ' '`

```console
$ pbpaste | tfoutput_to_ssh_config
Host bench
    HostName 43.206.55.19
    User isucon
    ServerAliveInterval 60
    ForwardAgent yes

Host a
    HostName 35.77.122.102
    User isucon
    ServerAliveInterval 60
    ForwardAgent yes

Host b
    HostName 52.69.120.236
    User isucon
    ServerAliveInterval 60
    ForwardAgent yes

Host c
    HostName 13.114.137.88
    User isucon
    ServerAliveInterval 60
    ForwardAgent yes
```


## 3. isuconユーザーでログインできるようにする


KEY_NAMEも環境変数に入れておく

```shell
export KEY_NAME=<AWS上で作成したssh key名>
```


### ubuntuの場合

Makefileを使う

```makefile title="Makefile"
USER := ubuntu

.PHONY: *
setup/authorized_keys:
	mkdir -p /home/isucon/.ssh/
	touch /home/isucon/.ssh/authorized_keys
	curl https://github.com/tetsuzawa.keys >> /home/isucon/.ssh/authorized_keys
	chown -R isucon:isucon /home/isucon/.ssh

setup/sshd:
	sed -i -r -e "s/.*PubkeyAuthentication\s(yes|no)/PubkeyAuthentication yes/" /etc/ssh/sshd_config
	echo "AuthorizedKeysFile /home/isucon/.ssh/authorized_keys /home/$(USER)/.ssh/authorized_keys" >> /etc/ssh/sshd_config
	systemctl restart sshd
```

```shell
export TARGET_HOSTS=(pbpaste | grep -E -o  '([0-9.]+)' | xargs echo -n ' ')
```

```shell
echo $TARGET_HOSTS
```


Makefileをインスタンスに送る


```shell
bash -c 'for HOST in $TARGET_HOSTS; do rsync -avz -e "ssh -i ~/.ssh/$KEY_NAME.pem -oStrictHostKeyChecking=no" Makefile ubuntu@$HOST:~/; done'
```

sshのセットアップをする

```
bash -c 'for HOST in $TARGET_HOSTS; do ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$HOST sudo make setup/authorized_keys setup/sshd; done'
```

ログインできればOK

```shell
ssh bench
ssh a
ssh b
ssh c
```