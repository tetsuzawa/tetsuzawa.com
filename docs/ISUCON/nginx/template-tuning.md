# テンプレチューニング

## tuning, access log, trace_id, request_id
```nginx configuration title=/etc/nginx/nginx.conf

worker_processes auto;

events {
    worker_connections 16384;
    multi_accept on;
    use epoll;
    # https://qiita.com/cubicdaiya/items/235777dc401ec419b14e#accept_mutex_delay
    accept_mutex_delay 100ms;
}


http {
    include       /etc/nginx/mime.types;
    default_type  application/octet-stream;

    server_tokens off;
    sendfile on;
    tcp_nopush on;
    tcp_nodelay on;
    keepalive_timeout 120;
    client_max_body_size 10m;

    open_file_cache max=200000 inactive=20s;
    open_file_cache_valid 30s;
    open_file_cache_min_uses 2;
    open_file_cache_errors on;

    gzip  on;
    gzip_types text/css text/javascript application/javascript application/x-javascript application/json;
    gzip_min_length 1k;
    gzip_comp_level 6;
    gzip_static on;
    gzip_vary on;

    # access_log /var/log/nginx/access.log;
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
                                '"request_time":$request_time,'
                                '"cache":"$upstream_http_x_cache",'
                                '"runtime":"$upstream_http_x_runtime",'
                                '"response_time":"$upstream_response_time",'
                                '"vhost":"$host",'
                                '"request_id":"$request_id",'
                                '"cache_status":"$upstream_cache_status"}';

    access_log  /home/isucon/log/nginx/access.log json;
    error_log  /home/isucon/log/nginx/error.log;

    # TLS configuration
    ssl_protocols TLSv1.2;
    ssl_prefer_server_ciphers on;
    ssl_ciphers 'ECDHE-ECDSA-AES128-GCM-SHA256:ECDHE-RSA-AES128-GCM-SHA256:ECDHE-ECDSA-AES256-GCM-SHA384:ECDHE-RSA-AES256-GCM-SHA384:ECDHE-ECDSA-CHACHA20-POLY1305:ECDHE-RSA-CHACHA20-POLY1305:DHE-RSA-AES128-GCM-SHA256:DHE-RSA-AES256-GCM-SHA384';

    include conf.d/*.conf;
    include sites-enabled/*.conf;
}
```

### trace_id
```nginx configuration title=/etc/nginx/sites-enabled/isucon.conf
lua_package_path "/path/to/lua-resty-cookie/lib/?.lua;;";

server {
    # ===================================== trace_id =====================================
    set $trace_id '';
    access_by_lua_block {
        local cookie = require "resty.cookie"
        local uuid = require "resty.jit-uuid"

        local ck = cookie:new()
        local trace_id, err = ck:get("trace_id")

        if not (trace_id) or (trace_id == "") then
            trace_id = uuid.generate_v4()
            local ok, err = ck:set({
                key = "trace_id",
                value = trace_id,
                path = "/",
                httponly = true,
                secure = false, -- set to true if you want to enforce HTTPS
                max_age = 3600 -- cookie expiration in seconds, adjust as you see fit
            })

            if not ok then
                ngx.log(ngx.ERR, err)
                return
            end
        end

        ngx.var.trace_id = trace_id
    }
}
```
