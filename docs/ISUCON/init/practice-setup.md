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

Host b
    HostName 52.69.120.236
    User isucon
    ServerAliveInterval 60

Host c
    HostName 13.114.137.88
    User isucon
    ServerAliveInterval 60
```


## 3. isuconユーザーでログインできるようにする

インスタンスのIP addressを環境変数に入れておく

https://github.com/tetsuzawa/tfoutput_to_export_snipet を使うと便利

```console
$ pbpaste | tfoutput_to_export_snipet 
export IP_A=35.77.122.102 && \
export IP_B=52.69.120.236 && \
export IP_BENCH=43.206.55.19 && \
export IP_C=13.114.137.88
```

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


Makefileをインスタンスに送る

```
rsync -avz -e "ssh -i ~/.ssh/$KEY_NAME.pem" Makefile ubuntu@$IP_BENCH:~/
rsync -avz -e "ssh -i ~/.ssh/$KEY_NAME.pem" Makefile ubuntu@$IP_A:~/
rsync -avz -e "ssh -i ~/.ssh/$KEY_NAME.pem" Makefile ubuntu@$IP_B:~/
rsync -avz -e "ssh -i ~/.ssh/$KEY_NAME.pem" Makefile ubuntu@$IP_C:~/
```

sshのセットアップをする

```
ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$IP_BENCH sudo make setup/authorized_keys setup/sshd
ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$IP_A sudo make setup/authorized_keys setup/sshd
ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$IP_B sudo make setup/authorized_keys setup/sshd
ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$IP_C sudo make setup/authorized_keys setup/sshd
```

ログインできればOK

```shell
ssh bench
ssh a
ssh b
ssh c
```