.PHONY: *

nginx/access_log:
	less log/nginx/access.log

nginx/error_log:
	less log/nginx/access.log

SERVICE_NAME := isucondition.go
app/app_journal:
	sudo journalctl -xef -u $(SERVICE_NAME)

alp/result:
	cat result/alp.md

SERVER_IP := 43.206.3.190
APP_PORT := 8080
pprof:
	go tool pprof -list main. -cum -seconds 60 http://$(SERVER_IP):$(APP_PORT)/debug/pprof/profile


openresty/install:
	sudo systemctl disable nginx
	sudo systemctl stop nginx
	sudo apt-get -y install --no-install-recommends wget gnupg ca-certificates
	wget -O - https://openresty.org/package/pubkey.gpg | sudo gpg --dearmor -o /usr/share/keyrings/openresty.gpg
	echo "deb [arch=$(dpkg --print-architecture) signed-by=/usr/share/keyrings/openresty.gpg] http://openresty.org/package/ubuntu $(lsb_release -sc) main" | sudo tee /etc/apt/sources.list.d/openresty.list > /dev/null
	sudo apt-get update
	sudo apt-get -y install openresty
	sudo openresty -c /etc/nginx/nginx.conf -t
	sudo systemctl enable openresty
	sudo systemctl start openresty

redis/install:
	sudo apt install -y lsb-release
	curl -fsSL https://packages.redis.io/gpg | sudo gpg --dearmor -o /usr/share/keyrings/redis-archive-keyring.gpg
	echo "deb [signed-by=/usr/share/keyrings/redis-archive-keyring.gpg] https://packages.redis.io/deb $(lsb_release -cs) main" | sudo tee /etc/apt/sources.list.d/redis.list
	sudo apt update
	sudo apt install -y redis
	sudo systemctl disable redis
	sudo systemctl stop redis