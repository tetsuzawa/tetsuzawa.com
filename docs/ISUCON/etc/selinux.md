# SELinux

## 無効化


```diff title="/etc/selinux/config"
- SELINUX=enforcing
+ SELINUX=disabled
```

再起動

```shell
sudo shutdown -r now
```