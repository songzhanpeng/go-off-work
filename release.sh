#!/bin/bash

echo "🏷️ 打tag中..."
npm run patch

current_tag=$(git describe --tags --abbrev=0)
echo "✨ 当前tag版本: $current_tag"

echo "📡 推送当前tag版本..."
git push

# Build the extension package
echo "📦 打包当前插件..."
vsce package

# Publish the extension
read -p "是否要发布插件？ (y/n): " publish_choice
if [ "$publish_choice" = "y" ]; then
    echo "🚀 发布中..."
    vsce publish
else
    echo "🛑 取消发布"
fi

echo "✅ 完成"
