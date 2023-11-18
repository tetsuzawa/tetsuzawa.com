# 集計コマンド

前提としてaccess logは以下の形式とする。

```nginx configuration
log_format json escape=json '{"time":"$time_local",'
                            '"host":"$remote_addr",'
                            '"forwardedfor":"$http_x_forwarded_for",'
                            '"req":"$request",'
                            '"status":"$status",'
                            '"method":"$request_method",'
                            '"uri":"$request_uri",'
                            '"body_bytes":$body_bytes_sent,'
                            '"referer":"$http_referer",'
                            '"ua":"$http_user_agent",'
                            '"accept_encoding":"$http_accept_encoding",'
                            '"request_time":$request_time,'
                            '"cache":"$upstream_http_x_cache",'
                            '"upstream_http_cache_status":"$upstream_http_cache_status",'
                            '"upstream_cache_status":"$upstream_cache_status",'
                            '"runtime":"$upstream_http_x_runtime",'
                            '"response_time":"$upstream_response_time",'
                            '"vhost":"$host",'
                            '"request_id":"$request_id"}';
```

## proxy cacheのキャッシュヒット率集計

```cnsole
isucon@isu_3:~$ cat log/nginx/access.log | grep -P "/api/chair/\d+" | jq -r '.upstream_cache_status' | sort | uniq -c | sort -nr
      4
   4409 HIT
   3504 MISS
```

## accept-encodingの数集計

```cnsole
isucon@isu1:~$ cat log/nginx/access.log | jq -r .accept_encoding | sort | uniq -c | sort -nr
  26482 gzip
     32 gzip, deflate
      2
```


## UserAgentの数集計

```conole
isucon@isu1:~$ cat log/nginx/access.log | jq -r '.ua' | sort | uniq -c | sort -nr
  26482 benchmarker
     30 Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/119.0.0.0 Safari/537.36
      2 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/81.0.4044.129 Safari/537.36
      1 Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/109.0.0.0 Safari/537.36
      1 Expanse, a Palo Alto Networks company, searches across the global IPv4 space multiple times per day to identify customers&#39; presences on the Internet. If you would like to be excluded from our scans, please send IP addresses/domains to: scaninfo@paloaltonetworks.com
```