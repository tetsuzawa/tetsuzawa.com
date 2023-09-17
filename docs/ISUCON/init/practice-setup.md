# 素振りの準備

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
printenv | sort | grep -E '^isu_.+=' | bash -c 'while IFS="=" read -r host ip; do echo -e "Host $host\n    HostName $ip\n    User isucon\n    IdentityFile ~/.ssh/id_rsa\n    ServerAliveInterval 60\n    StrictHostKeyChecking no\n"; done'
```