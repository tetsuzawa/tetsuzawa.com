# 再起動試験対策

redisはデフォルトでデータをローカルに永続化する。
restart時にデータを消したければ↓を設定に追加する

```diff title="/etc/redis/redis.conf"
+ save ""
```

またはアプリケーションのinitializeでデータを消す
