# access logをalpに対応する

```
log_format ltsv "time:$time_local"
            "\thost:$remote_addr"
            "\tforwardedfor:$http_x_forwarded_for"
            "\treq:$request"
            "\tstatus:$status"
            "\tmethod:$request_method"
            "\turi:$request_uri"
            "\tsize:$body_bytes_sent"
            "\treferer:$http_referer"
            "\tua:$http_user_agent"
            "\trequest_time:$request_time"
            "\tcache:$upstream_http_x_cache"
            "\truntime:$upstream_http_x_runtime"
            "\tapptime:$upstream_response_time"
            "\tsession_name:$cookie__isucondition_go"
            "\tvhost:$host"
            "\trequest_id:$request_id"
            "\tcache_status:$upstream_cache_status";
access_log  /var/log/nginx/access_log.ltsv ltsv;
```


