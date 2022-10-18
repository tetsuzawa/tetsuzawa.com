# prepare と interpolateParams=true

pt-query-digest などで Prepareがボトルネックになってきたらdsnに`interpolateParams=true`を追加すると良い。

毎回Prepareが叩かれなくなる。

```title="pt-query-digestの例"
# Query 2: 2.08k QPS, 0.21x concurrency, ID 0xDA556F9115773A1A99AA0165670CE848 at byte 11797611
# This item is included in the report because it matches --limit.
# Scores: V/M = 0.00
# Time range: 2022-10-15T14:08:42 to 2022-10-15T14:09:44
# Attribute    pct   total     min     max     avg     95%  stddev  median
# ============ === ======= ======= ======= ======= ======= ======= =======
# Count         32  129115
# Exec time     15     13s    14us    88ms   102us   236us   577us    44us
# Lock time      0       0       0       0       0       0       0       0
# Rows sent      0       0       0       0       0       0       0       0
# Rows examine   0       0       0       0       0       0       0       0
# Query size     6   3.69M      30      30      30      30       0      30
# String:
# Databases    isuconp
# Hosts        localhost
# Users        isuconp
# Query_time distribution
#   1us
#  10us  ################################################################
# 100us  #####
#   1ms  #
#  10ms  #
# 100ms
#    1s
#  10s+
administrator command: Prepare\G
```


特徴はrows sentが0でクエリが`administrator command: Prepare\G`


例

```diff
dsn := fmt.Sprintf(
-    "%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&loc=Local",
    user,
    password,
    host,
    port,
    dbname,
)
dsn := fmt.Sprintf(
+    "%s:%s@tcp(%s:%s)/%s?charset=utf8mb4&parseTime=true&loc=Local&interpolateParams=true",
    user,
    password,
    host,
    port,
    dbname,
)
```
