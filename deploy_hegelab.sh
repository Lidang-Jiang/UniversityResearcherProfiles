#!/bin/bash
# 脚本: deploy_hegelab.sh

# 前台系统解压
 unzip ~/dev/dist-pc.zip -d /var/www/hegelab/pc

# 后台系统解压
 unzip ~/dev/dist-platforms.zip -d /var/www/hegelab/admin

# 检查 Nginx 配置是否正确
 nginx -t

# 如果配置正确，重新加载 Nginx
 systemctl reload nginx
# 或者
#  service nginx reload
# 打印执行完毕的消息
echo "部署完成，前台和后台系统已解压并重新加载 Nginx。"