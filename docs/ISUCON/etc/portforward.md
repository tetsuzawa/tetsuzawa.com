# ポートフォワーディングする

参考: https://qiita.com/mechamogera/items/b1bb9130273deb9426f5

`man ssh`

```shell
-N      Do not execute a remote command.  This is useful for just forwarding ports.

# 
-L [bind_address:]port:host:hostport
-L [bind_address:]port:remote_socket
-L local_socket:host:hostport
-L local_socket:remote_socket
     Specifies that connections to the given TCP port or Unix socket on the local (client) host are to
     be forwarded to the given host and port, or Unix socket, on the remote side.  This works by
     allocating a socket to listen to either a TCP port on the local side, optionally bound to the
     specified bind_address, or to a Unix socket.  Whenever a connection is made to the local port or
     socket, the connection is forwarded over the secure channel, and a connection is made to either
     host port hostport, or the Unix socket remote_socket, from the remote machine.

```

ローカルから22番でsshできる前提


### aが80でlistenしていて、ローカルのブラウザから8082でアクセスしたい

```shell
ssh -NL 8082:localhost:80 a
```

### aが443でlistenしていて、ローカルのブラウザから8083でアクセスしたい

```shell
ssh -NL 8083:localhost:443 a
```

### b(aと同じサブネットで192.168.0.12) が3306でlistenしていて、aを踏み台にしてmysqlをつなぎたい

```shell
ssh -NL 3306:192.168.0.12:3306 a
