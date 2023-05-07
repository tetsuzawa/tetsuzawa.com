# 計測前後のスクリプト

## 計測前

```shell title="prepare.sh"
#!/usr/bin/env bash

set -eux
cd `dirname $0`

################################################################################
echo "# Prepare"
################################################################################

# ====== env ======
cat > /tmp/prepared_env <<EOF
prepared_time="`date +'%Y-%m-%d %H:%M:%S'`"
app_log="/home/isucon/log/app/app.log"
nginx_access_log="/home/isucon/log/nginx/access.log"
nginx_error_log="/home/isucon/log/nginx/error.log"
mysql_slow_log="/var/log/mysql/mysqld-slow.log"
mysql_error_log="/var/log/mysql/error.log"
result_dir="/home/isucon/result"
EOF

# read env
# 計測用自作env
. /tmp/prepared_env

# isucon serviceで使うenv
. ./env.sh

# ====== go ======
cd /home/isucon/webapp/golang
make all
mkdir -p /home/isucon/log/app
#sudo logrotate -f /home/isucon/etc/logrotate.d/app
sudo systemctl restart xsuportal-api-golang.service
sudo systemctl restart xsuportal-web-golang.service

# ====== nginx ======
mkdir -p /home/isucon/log/nginx
sudo touch ${nginx_access_log} ${nginx_error_log}
sudo logrotate -f /home/isucon/etc/logrotate.d/nginx
sudo cp ${nginx_access_log} ${nginx_access_log}.prev
sudo truncate -s 0 ${nginx_access_log}
sudo cp ${nginx_error_log} ${nginx_error_log}.prev
sudo truncate -s 0 ${nginx_error_log}
sudo nginx -t
# sudo systemctl restart nginx

# ====== mysql ======
# sudo touch ${mysql_slow_log} ${mysql_error_log}
# # sudo logrotate /home/isucon/etc/logrotate.d/mysql
# sudo chown mysql:mysql ${mysql_slow_log} ${mysql_error_log}
# sudo cp ${mysql_slow_log} ${mysql_slow_log}.prev
# sudo truncate -s 0 ${mysql_slow_log}
# sudo cp ${mysql_error_log} ${mysql_error_log}.prev
# sudo truncate -s 0 ${mysql_error_log}
# sudo systemctl restart mysql

# ====== redis ======
# sudo systemctl restart redis-server

# slow log
# MYSQL="mysql -h${DB_HOST} -P${DB_PORT} -u${DB_USER} -p${DB_PASS} ${DB_DATABASE}"
# ${MYSQL} -e "set global slow_query_log_file = '${mysql_slow_log}'; set global long_query_time = 0; set global slow_query_log = ON;"

echo "OK"
```

## 計測後

```shell title="analyze.sh"
#!/usr/bin/env bash

set -eux
cd `dirname $0`

################################################################################
echo "# Analyze"
################################################################################

# read env
# 計測用自作env
. /tmp/prepared_env

# isucon serviceで使うenv
. ./env.sh

result_dir=$HOME/result
mkdir -p ${result_dir}

#sudo journalctl --since="${prepared_time}" | gzip -9c > "${data_dir}/journal.log.gz"

# alp
# ALPM="/int/\d+,/uuid/[A-Za-z0-9_]+,/6digits/[a-z0-9]{6}"
#ALPM="/@.+,/posts/\d+,/image/\d+.(jpg|png|gif),/posts?max_created_at.*$"
#ALPM="/api/courses/[a-zA-Z0-9]+$,/api/courses/[a-zA-Z0-9]+/status,/api/courses/[a-zA-Z0-9]+/classes,/api/courses/[a-zA-Z0-9]+/classes/[a-zA-Z0-9]+/assignments,/api/courses/[a-zA-Z0-9]+/classes/[a-zA-Z0-9]+/assignments/scores,/api/courses/[a-zA-Z0-9]+/classes/[a-zA-Z0-9]+/assignments/export,/api/announcements/[a-zA-Z0-9]+$"
ALPM="/initialize,/api/admin/clarifications,/api/admin/clarifications/\d,/api/session,/api/audience/teams,/api/audience/dashboard,/api/registration/session,/api/registration/team,/api/registration/contestant,/api/registration,/api/registration,/api/contestant/benchmark_jobs,/api/contestant/benchmark_jobs/\d,/api/contestant/clarifications,/api/contestant/clarifications,/api/contestant/dashboard,/api/contestant/notifications,/api/contestant/push_subscriptions,/api/contestant/push_subscriptions,/api/signup,/api/login,/api/logout"

OUTFORMT=count,1xx,2xx,3xx,4xx,5xx,method,uri,min,max,sum,avg,p95,min_body,max_body,avg_body
touch ${result_dir}/alp.md
cp ${result_dir}/alp.md ${result_dir}/alp.md.prev
alp json --file=${nginx_access_log} \
  --nosave-pos \
  --sort sum \
  --reverse \
  --output ${OUTFORMT} \
  --format markdown \
  --matching-groups ${ALPM}  \
  > ${result_dir}/alp.md

# mysqlowquery
# sudo mysqldumpslow -s t ${mysql_slow_log} > ${result_dir}/mysqld-slow.txt

# touch ${result_dir}/pt-query-digest.txt
# cp ${result_dir}/pt-query-digest.txt ${result_dir}/pt-query-digest.txt.prev
# pt-query-digest --explain "h=${DB_HOST},u=${DB_USER},p=${DB_PASS},D=${DB_DATABASE}" ${mysql_slow_log} \
#   > ${result_dir}/pt-query-digest.txt
# pt-query-digest ${mysql_slow_log} > ${result_dir}/pt-query-digest.txt
```