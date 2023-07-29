# 素振りの最初にやること


## 1. リソースを作る

https://github.com/tetsuzawa/isucon-provisioning を使う

KEY_NAMEも環境変数に入れておく

```shell
export KEY_NAME=<AWS上で作成したssh key名>
```

```shell
make -C stacks TFSTATE_BUCKET=<tfstateを置くs3 bucket> SCOPE=<ISUCONの回> apply
```

## 2. ssh config書き換える

インスタンスの`Name=IPAddress`の形式で環境変数を設定

```shell
export (aws ec2 describe-instances --filters "Name=instance-state-name,Values=running" --query 'Reservations[*].Instances[?Tags[?Key==`Name` && starts_with(Value, `isu_`)]].[Tags[?Key==`Name`]|[0].Value, PublicIpAddress]' --output text | awk '{print $1 "=" $2}')
```

```shell
printenv | sort | grep -E '^isu_.+='
```

```shell
printenv | sort | grep -E '^isu_.+=' |bash -c 'while IFS="=" read -r host ip; do echo -e "Host $host\n    HostName $ip\n    User isucon\n    IdentityFile ~/.ssh/id_rsa\n    ServerAliveInterval 60\n    StrictHostKeyChecking no\n"; done'
```


## 3. isuconユーザーでログインできるようにする


### ubuntuの場合

Makefileを使う

```makefile title="Makefile"
USER := ubuntu

.PHONY: *
setup/authorized_keys:
	mkdir -p /home/isucon/.ssh/
	touch /home/isucon/.ssh/authorized_keys
	chown -R isucon:isucon /home/isucon/.ssh

setup/sshd:
	sed -i -r -e "s/.*PubkeyAuthentication\s(yes|no)/PubkeyAuthentication yes/" /etc/ssh/sshd_config
	echo "AuthorizedKeysFile /home/isucon/.ssh/authorized_keys /home/$(USER)/.ssh/authorized_keys" >> /etc/ssh/sshd_config
	systemctl restart sshd
```

```shell
export TARGET_HOSTS=(printenv | grep -oE '(^isu_(\d+|bench))'  | sort | tr '\n' ' ')
```

```shell
echo $TARGET_HOSTS
```


Makefileをインスタンスに送る


```shell
bash -c 'for HOST in $TARGET_HOSTS; do rsync -avz -e "ssh -i ~/.ssh/$KEY_NAME.pem -oStrictHostKeyChecking=no" Makefile ubuntu@$HOST:~/; done'
```

sshのセットアップをする

```shell
bash -c 'for HOST in $TARGET_HOSTS; do ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$HOST sudo make setup/authorized_keys setup/sshd; done'
```

参加者の公開鍵をgithubから取得

```shell
export TARGET_GITHUB_USERS="tetsuzawa soudai mackee"
```

```shell
bash -c 'for HOST in $TARGET_HOSTS; do for GITHUB_USER in $TARGET_GITHUB_USERS; do ssh -i ~/.ssh/$KEY_NAME.pem ubuntu@$HOST sudo "bash -c \"curl https://github.com/$GITHUB_USER.keys >> /home/isucon/.ssh/authorized_keys\""; done; done'
```

ログインできればOK

```shell
ssh isu_bench
ssh isu_1
ssh isu_2
ssh isu_3
```