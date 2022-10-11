# innodb_buffer_pool に関連するパラメータたち

```mysql
mysql> SHOW VARIABLES LIKE 'innodb_buffer_pool%';
+-----------------------------------+--------------+
|Variable_name                      |Value         |
+-----------------------------------+--------------+
|innodb_buffer_pool_chunk_size      |134217728     |
|innodb_buffer_pool_dump_at_shutdown|ON            |
|innodb_buffer_pool_dump_now        |OFF           |
|innodb_buffer_pool_dump_pct        |25            |
|innodb_buffer_pool_filename        |ib_buffer_pool|
|innodb_buffer_pool_in_core_file    |ON            |
|innodb_buffer_pool_instances       |1             |
|innodb_buffer_pool_load_abort      |OFF           |
|innodb_buffer_pool_load_at_startup |OFF           |
|innodb_buffer_pool_load_now        |OFF           |
|innodb_buffer_pool_size            |134217728     |
+-----------------------------------+--------------+
```

## `innodb_buffer_pool_chunk_size`

デフォルト: 128 MB

innodb_buffer_pool_size = innodb_buffer_pool_chunk_size * innodb_buffer_pool_instances


## `innodb_buffer_pool_dump_at_shutdown` と `innodb_buffer_pool_load_at_startup`

innodb_buffer_pool_dump_at_shutdown はサーバーのシャットダウン時にinnodb_buffer_pool をダンブしておくオプション

innodb_buffer_pool_load_at_startup はサーバーの起動時にinnodb_buffer_pool をロードするオプション

**デフォルトでON**

**mysqlのrestart時にもダンプされる**

## `innodb_buffer_pool_dump_pct`

ダンプする最後に使用されたバッファープールページの割合を%で指定できる

## `innodb_buffer_pool_dump_now`, `innodb_buffer_pool_load_abort`, `innodb_buffer_pool_load_now`

`SET GRLOBAL innodb_buffer_pool_dump_now = ON` で即時にダンプしたり
`SET GRLOBAL innodb_buffer_pool_load_now = ON` で即時に読み込んだりしてくれる。
`SET GRLOBAL innodb_buffer_pool_load_abort = ON` で読み込み中止できる。

## `innodb_buffer_pool_filename`

デフォルトはib_buffer_pool。
データディレクトリ（`/var/lib/mysql/`）配下に吐かれる。

中身はこんな感じでポインタとページが書かれている。

```console
$ sudo head /var/lib/mysql/ib_buffer_pool
4294967293,131
4294967293,130
4294967293,129
```


## `innodb_buffer_pool_size`

デフォルト: 128 MB
推奨：システムメモリの 7~8割
