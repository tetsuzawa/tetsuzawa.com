# 競技の前日までにやること

## githubのリポジトリ作成

- isucon-templatesをもとにリポジトリを作成する
- **private** にする

```shell
gh repo create --template tetsuzawa/isucon-templates --private isucon-xx-xxxxxx
```

## デプロイキーの作成

```shell
ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/isucon-xx-xxxxxx
```


## githubにデプロイキーを登録

allow write accessにチェックを入れる

```shell
gh repo --repo tetsuzawa/isucon-xx-xxxxxx deploy-key add --allow-write ~/
.ssh/isucon-xx-xxxxxx.pub
```

## コラボレーターの追加

## issueを立てておく

- 最初にやること
- ベンチマークスレッド
- 最後にやること


## isucon-setupのリポジトリ名書き換え

`inventories/production/hosts.yml`
