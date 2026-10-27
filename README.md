# jiangzhang.ca

Jiang Zhang 的个人网站，采用无需构建的静态架构：React CDN、Babel Standalone 与普通 CSS。

## 修改内容

个人资料、技能、项目、文章与链接都集中在 `data.jsx`。通常只需编辑这一个文件。

## 本地预览

不能直接双击 `index.html`，请在本目录启动一个静态文件服务器，例如：

```powershell
python -m http.server 8000
```

然后访问 `http://localhost:8000`。

## 发布

把本目录文件推送至 GitHub Pages 仓库的 `main` 分支，并在仓库的 `Settings → Pages` 中选择从 `main` 分支根目录发布。
