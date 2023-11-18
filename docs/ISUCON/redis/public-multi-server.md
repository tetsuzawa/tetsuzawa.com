# 外部公開

複数台構成にするときはredis.confで外部接続を許可する必要がある


```title=/etc/redis/redis.conf
protected-mode no
bind * -::*
port 6379
```

https://self-development.info/redis%E3%81%AE%E5%A4%96%E9%83%A8%E6%8E%A5%E7%B6%9A%E3%82%92%E8%A8%B1%E5%8F%AF%E3%81%99%E3%82%8B%E6%96%B9%E6%B3%95%E3%80%90python%E3%81%A7%E6%8E%A5%E7%B6%9A%E7%A2%BA%E8%AA%8D%E3%80%91/
