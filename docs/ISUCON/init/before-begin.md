# 競技の前日までにやること

## githubのリポジトリ作成

- isucon-templatesをもとにリポジトリを作成する
- **private** にする

## コラボレーターの追加

## issueを立てておく

- 最初にやること
- ベンチマークスレッド
- 最後にやること

## デプロイキーの作成

```shell
ssh-keygen -t rsa -b 4096 -N "" -f ~/.ssh/isucon-xx-xxxxxx
```

## githubにデプロイキーを登録

allow write accessにチェックを入れる

## isucon-setupのリポジトリ名書き換え

`inventories/production/hosts.yml`
