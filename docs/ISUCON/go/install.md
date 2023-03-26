# インストール

```shell
curl -sSLo go.tar.gz https://go.dev/dl/go1.20.2.linux-amd64.tar.gz
sudo rm -rf /usr/local/go && sudo tar -C /usr/local -xzf go.tar.gz
sudo rm -rf go.tar.gz
echo 'export PATH=/usr/local/go/bin:$PATH' >> ~/.bash_profile
echo 'export PATH=/usr/local/go/bin:$PATH' >> ~/.bashrc
echo 'export PATH=/home/isucon/go/bin:$PATH' >> ~/.bash_profile
echo 'export PATH=/home/isucon/go/bin:$PATH' >> ~/.bashrc
echo 'export GOROOT=' >> ~/.bash_profile
echo 'export GOROOT=' >> ~/.bashrc
echo 'export GOPATH=/home/isucon/go' >> ~/.bash_profile
echo 'export GOPATH=/home/isucon/go' >> ~/.bashrc
export PATH=/usr/local/go/bin:$PATH
export PATH=/home/isucon/go/bin:$PATH
export GOROOT=
export GOPATH=/home/isucon/go
go version
```