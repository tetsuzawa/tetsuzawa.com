# セットアップ後脳死でできるチューニング

## カーネルパラメータの調整

[カーネルパラメータのチューニング](../etc/kernel-parameter.md) を参考にやる。


## nginxのチューニング

[NGINXのチューニング](../nginx/template-tuning.md) を参考にやる。


## 静的ファイル配信

- アプリケーションで書いているところを特定
- TODO: nginxのconfを調整する

## 余計なサービスを止める

- TODO: 止めていいサービスって何？っていうのを調べる


// Q: 以下はあるubuntuサーバーのsystemd service一覧です。それぞれのサービスについて詳しく説明し、停止しても問題ないものについては教えて下さい。

```
sudo systemctl list-units --type=service
UNIT                                           LOAD   ACTIVE SUB     DESCRIPTION                                    >
accounts-daemon.service                        loaded active running Accounts Service                               >
acpid.service                                  loaded active running ACPI event daemon                              >
apparmor.service                               loaded active exited  Load AppArmor profiles                         >
apport.service                                 loaded active exited  LSB: automatic crash report generation         >
atd.service                                    loaded active running Deferred execution scheduler                   >
blk-availability.service                       loaded active exited  Availability of block devices                  >
cloud-config.service                           loaded active exited  Apply the settings specified in cloud-config   >
cloud-final.service                            loaded active exited  Execute cloud user/final scripts               >
cloud-init-local.service                       loaded active exited  Initial cloud-init job (pre-networking)        >
cloud-init.service                             loaded active exited  Initial cloud-init job (metadata service crawle>
console-setup.service                          loaded active exited  Set console font and keymap                    >
cron.service                                   loaded active running Regular background program processing daemon   >
dbus.service                                   loaded active running D-Bus System Message Bus                       >
envoy.service                                  loaded active running Envoy Proxy                                    >
finalrd.service                                loaded active exited  Create final runtime dir for shutdown pivot roo>
getty@tty1.service                             loaded active running Getty on tty1                                  >
grub-common.service                            loaded active exited  LSB: Record successful boot for GRUB           >
irqbalance.service                             loaded active running irqbalance daemon                              >
isucon-env-ensure-benchmark-server.service     loaded active exited  set environment variable for xsuportal         >
keyboard-setup.service                         loaded active exited  Set the console keyboard layout                >
kmod-static-nodes.service                      loaded active exited  Create list of static device nodes for the curr>
lvm2-monitor.service                           loaded active exited  Monitoring of LVM2 mirrors, snapshots etc. usin>
multipathd.service                             loaded active running Device-Mapper Multipath Device Controller      >
mysql.service                                  loaded active running MySQL Community Server                         >
networkd-dispatcher.service                    loaded active running Dispatcher daemon for systemd-networkd         >
polkit.service                                 loaded active running Authorization Manager                          >
prometheus-node-exporter.service               loaded active running Prometheus exporter for machine metrics        >
rsyslog.service                                loaded active running System Logging Service                         >
serial-getty@ttyS0.service                     loaded active running Serial Getty on ttyS0                          >
setvtrgb.service                               loaded active exited  Set console scheme                             >
smartmontools.service                          loaded active running Self Monitoring and Reporting Technology (SMART>
snap.amazon-ssm-agent.amazon-ssm-agent.service loaded active running Service for snap application amazon-ssm-agent.a>
snapd.apparmor.service                         loaded active exited  Load AppArmor profiles managed internally by sn>
snapd.seeded.service                           loaded active exited  Wait until snapd is fully seeded               >
snapd.service                                  loaded active running Snap Daemon                                    >
ssh.service                                    loaded active running OpenBSD Secure Shell server                    >
systemd-fsck-root.service                      loaded active exited  File System Check on Root Device               >
systemd-journal-flush.service                  loaded active exited  Flush Journal to Persistent Storage            >
systemd-journald.service                       loaded active running Journal Service                                >
systemd-logind.service                         loaded active running Login Service                                  >
systemd-modules-load.service                   loaded active exited  Load Kernel Modules                            >
systemd-networkd-wait-online.service           loaded active exited  Wait for Network to be Configured              >
systemd-networkd.service                       loaded active running Network Service                                >
systemd-random-seed.service                    loaded active exited  Load/Save Random Seed                          >
systemd-remount-fs.service                     loaded active exited  Remount Root and Kernel File Systems           >
systemd-resolved.service                       loaded active running Network Name Resolution                        >
systemd-sysctl.service                         loaded active exited  Apply Kernel Variables                         >
systemd-sysusers.service                       loaded active exited  Create System Users                            >
systemd-timesyncd.service                      loaded active running Network Time Synchronization                   >
systemd-tmpfiles-setup-dev.service             loaded active exited  Create Static Device Nodes in /dev             >
systemd-tmpfiles-setup.service                 loaded active exited  Create Volatile Files and Directories          >
systemd-udev-settle.service                    loaded active exited  udev Wait for Complete Device Initialization   >
systemd-udev-trigger.service                   loaded active exited  udev Coldplug all Devices                      >
systemd-udevd.service                          loaded active running udev Kernel Device Manager                     >
systemd-update-utmp.service                    loaded active exited  Update UTMP about System Boot/Shutdown         >
systemd-user-sessions.service                  loaded active exited  Permit User Sessions                           >
ufw.service                                    loaded active exited  Uncomplicated firewall                         >
unattended-upgrades.service                    loaded active running Unattended Upgrades Shutdown                   >
user-runtime-dir@1100.service                  loaded active exited  User Runtime Directory /run/user/1100          >
user@1100.service                              loaded active running User Manager for UID 1100                      >
xsuportal-api-golang.service                   loaded active running xsuportal-api-golang                           >
xsuportal-web-golang.service                   loaded active running xsuportal-web-golang
```
