# trdsql

## インストール

```shell
curl -sSLO https://github.com/noborus/trdsql/releases/download/v0.10.1/trdsql_v0.10.1_linux_amd64.zip
unzip trdsql_v0.10.1_linux_amd64.zip
sudo install trdsql_v0.10.1_linux_amd64/trdsql /usr/local/bin/trdsql
rm -rf trdsql_v0.10.1_linux_amd64*
trdsql -version
```

## nginxのアクセスログからステータスコード5xxのログを抽出

```shell
cat log/nginx/access.log | trdsql -ijson -oat -onowrap "select * from - where status like '4%'"
```

```
+--------------+---------+----------------------------------+--------------+-------------------------------------------------------+------------+---------------+----------------------------+--------------+--------+---------+-----------------------------------------------------------------------------------------------------------------------------------------+-------+--------------+--------+------------------------------------------+-------------------+
| request_time | runtime |           trequest_id            | cache_status |                          req                          | body_bytes | response_time |            time            | forwardedfor | method | referer |                                                                   ua                                                                    | cache |     host     | status |                   uri                    |       vhost       |
+--------------+---------+----------------------------------+--------------+-------------------------------------------------------+------------+---------------+----------------------------+--------------+--------+---------+-----------------------------------------------------------------------------------------------------------------------------------------+-------+--------------+--------+------------------------------------------+-------------------+
|        0.002 |         | 87229f155e69facb796d2e9ea831401d |              | POST /api/registration/team HTTP/1.1                  |         91 |         0.000 | 22/Apr/2023:07:51:38 +0000 |              | POST   |         | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36                     |       | 10.160.1.104 |    403 | /api/registration/team                   | isu1.t.isucon.dev |
|        0.002 |         | 156b299b45e326405f28c99da9883dde |              | POST /api/registration/contestant HTTP/1.1            |         97 |         0.000 | 22/Apr/2023:07:51:41 +0000 |              | POST   |         | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36                     |       | 10.160.1.104 |    400 | /api/registration/contestant             | isu1.t.isucon.dev |
|        0.002 |         | 63e429404c9c7891a739e6b6bc5acd09 |              | POST /api/registration/contestant HTTP/1.1            |         55 |         0.000 | 22/Apr/2023:07:51:41 +0000 |              | POST   |         | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36                     |       | 10.160.1.104 |    400 | /api/registration/contestant             | isu1.t.isucon.dev |
|        0.001 |         | ecdf6c04ead4196ba5cfcecf16048de1 |              | POST /api/signup HTTP/1.1                             |         77 |         0.004 | 22/Apr/2023:07:51:41 +0000 |              | POST   |         | Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/85.0.4183.102 Safari/537.36                     |       | 10.160.1.104 |    400 | /api/signup                              | isu1.t.isucon.dev |
|        0.002 |         | aa13287f95299d254f0d3832abd81d84 |              | POST /api/contestant/benchmark_jobs HTTP/1.1          |        127 |         0.000 | 22/Apr/2023:07:51:41 +0000 |              | POST   |         | Mozilla/5.0 (Macintosh; Intel Mac OS X 10.12) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/74.0.3729.169 Safari/537.36 Edg/83.0.522.52 |       | 10.160.1.104 |    403 | /api/contestant/benchmark_jobs           | isu1.t.isucon.dev |
```

## nginxのアクセスログからステータスコード5xxのログを抽出

```shell
cat log/nginx/access.log | trdsql -ijson -oat -onowrap "select * from - where status like '5%'"
```

## nginxのアクセスログからUAごとのリクエスト数を抽出

```shell
cat log/nginx/access.log | trdsql -ijson -oat -onowrap "select ua, count(ua) as ua_cnt, status, count(status) as status_cnt, sum(size) as sum_size, avg(reqtime) as avg_reqtime from - group by ua, status order by ua_cnt desc"
```

```
+-----------------------------------------------------------------------------------------------------------------------------------------+-----------+
|                                                                   ua                                                                    | count(ua) |
+-----------------------------------------------------------------------------------------------------------------------------------------+-----------+
| JIA-Members-Client/1.2                                                                                                                  |     70049 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36                  |         8 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/67.0.3396.99 Safari/537.36 Edg/81.0.522.52  |         1 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36                 |         1 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/69.0.3497.100 Safari/537.36 Edg/85.0.564.44 |         1 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/72.0.3626.121 Safari/537.36                 |         1 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.138 Safari/537.36                 |         8 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/83.0.4103.116 Safari/537.36 Edg/79.0.522.52 |         1 |
| Mozilla/5.0 (Macintosh; Intel Mac OS X 10.11) Gecko/20100101 Firefox/70.0                                                               |        10 |
```