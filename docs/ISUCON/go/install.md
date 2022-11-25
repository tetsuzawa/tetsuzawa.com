# インストール

```shell
curl -sSLo go.tar.gz https://go.dev/dl/go1.19.2.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go.tar.gz
sudo rm -rf go.tar.gz
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bash_profile
echo 'export PATH=$PATH:/usr/local/go/bin' >> ~/.bashrc
echo 'export PATH=$PATH:/home/isucon/go/bin' >> ~/.bash_profile
echo 'export PATH=$PATH:/home/isucon/go/bin' >> ~/.bashrc
export PATH=$PATH:/usr/local/go/bin
export PATH=$PATH:/home/isucon/go/bin
go version
```