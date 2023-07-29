# openresty

https://openresty.org/en/linux-packages.html

## install

ubuntu 22.04 amd64

```shell
sudo systemctl disable nginx
sudo systemctl stop nginx
sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates
wget -O - https://openresty.org/package/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/openresty.gpg
echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/ubuntu $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/openresty.list > /dev/null
sudo apt-get update
sudo apt-get -y install openresty
```

luarocks

```
wget http://luarocks.org/releases/luarocks-2.0.13.tar.gz
tar -xzvf luarocks-2.0.13.tar.gz
cd luarocks-2.0.13/
./configure --prefix=/usr/local/openresty/luajit \
    --with-lua=/usr/local/openresty/luajit/ \
    --lua-suffix=jit \
    --with-lua-include=/usr/local/openresty/luajit/include/luajit-2.1
make
sudo make install
```

## nginx confをopenrestyにも反映させるには

systemdのExecStartでもともとのnginx confを読むように指定させれば良い

/lib/systemd/system/openresty.service

```diff title="/lib/systemd/system/openresty.service"
@@ -18,9 +18,9 @@
 [Service]
 Type=forking
-PIDFile=/usr/local/openresty/nginx/logs/nginx.pid
-ExecStartPre=/usr/local/openresty/nginx/sbin/nginx -t -q -g 'daemon on; master_process on;'
-ExecStart=/usr/local/openresty/nginx/sbin/nginx -g 'daemon on; master_process on;'
-ExecReload=/usr/local/openresty/nginx/sbin/nginx -g 'daemon on; master_process on;' -s reload
+PIDFile=/var/run/nginx.pid
+ExecStartPre=/usr/local/openresty/nginx/sbin/nginx -c /etc/nginx/nginx.conf -t -q -g 'daemon on; master_process on;'
+ExecStart=/usr/local/openresty/nginx/sbin/nginx -c /etc/nginx/nginx.conf -g 'daemon on; master_process on;'
+ExecReload=/usr/local/openresty/nginx/sbin/nginx -c /etc/nginx/nginx.conf -g 'daemon on; master_process on;' -s reload
 ExecStop=-/sbin/start-stop-daemon --quiet --stop --retry QUIT/5 --pidfile /usr/local/openresty/nginx/logs/nginx.pid
 TimeoutStopSec=5
 KillMode=mixed
```


## 有効化

```
sudo systemctl daemon-reload
sudo systemctl enable openresty
sudo systemctl start openresty
sudo systemctl status openresty
```

```diff title="prepare.sh"
-sudo nginx -t
-sudo systemctl restart nginx
+sudo openresty -c /etc/nginx/nginx.conf -t
+sudo systemctl restart openresty
```


## path上のIDからリクエストを分散して振り分ける

https://github.com/tetsuzawa/isucon12-final-suburi-20230701/pull/6/files


```lua titile=/etc/nginx/lua/routing_logic.lua
local uri = ngx.var.uri
local id = string.match(uri, "/user/(%d+)")
if id then
    local backend_id = 1
    --local backend_id = (id % 5) + 1
    ngx.var.backend_id = backend_id
    ngx.var.backend = "backend" .. tostring(backend_id)
    print(ngx.var.backend)
    ngx.exec("@proxy")
else
    local backend_id = 1
    ngx.var.backend_id = backend_id
    ngx.var.backend = "backend" .. tostring(backend_id)
    print(ngx.var.backend)
    ngx.exec("@proxy")
end
```

```shell
# sharding
upstream backend1 {
  server 192.168.0.11:8080;
}
upstream backend2 {
  server 192.168.0.12:8080;
}
upstream backend3 {
  server 192.168.0.13:8080;
}
upstream backend4 {
  server 192.168.0.14:8080;
}
upstream backend5 {
  server 192.168.0.15:8080;
}

server {
  set $backend "";
  set $backend_id "";
  location @proxy {
      proxy_pass http://$backend;
      proxy_set_header X-Backend-ID $backend_id;
  }


  root /home/isucon/isucon12-final/webapp/public;
  listen 80 default_server;
  listen [::]:80 default_server;

  location /user {
    proxy_set_header Host $host;

    content_by_lua_file /etc/nginx/lua/routing_logic.lua;
  }
}
```