# too many open files

ファイルディスクリプタの制限に引っかかっている。

シェルから実行するようなものは `/etc/security/limits.conf` に↓を追記する

```title="/etc/security/limits.conf"
* soft nofile 16383
* hard nofile 16383
```

一旦ログアウトして `ulimit -n` or `ulimit -a` で確認する。

```console
$ ulimit -a
core file size          (blocks, -c) 0
data seg size           (kbytes, -d) unlimited
scheduling priority             (-e) 0
file size               (blocks, -f) unlimited
pending signals                 (-i) 31176
max locked memory       (kbytes, -l) 65536
max memory size         (kbytes, -m) unlimited
open files                      (-n) 16383
pipe size            (512 bytes, -p) 8
POSIX message queues     (bytes, -q) 819200
real-time priority              (-r) 0
stack size              (kbytes, -s) 8192
cpu time               (seconds, -t) unlimited
max user processes              (-u) 31176
virtual memory          (kbytes, -v) unlimited
file locks                      (-x) unlimited
```


```console
$ ulimit -n
16383
```
`



