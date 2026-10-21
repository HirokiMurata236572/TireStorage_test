# DUNLOP タイヤ電子荷票 GitHub Pages版

公開先: `https://hirokimurata236572.github.io/TireStorage_test/`

## 配置ファイル
- `index.html`
- `style.css`
- `app.js`
- `.nojekyll`

上記4ファイルをリポジトリの公開ブランチ直下へ配置してください。

## QRコードの仕様
QRには次の固定形式のURLが入ります。

`https://hirokimurata236572.github.io/TireStorage_test/?tag=TAG-A7F3C9`

プロジェクト名をコードへ固定せず、現在の公開ディレクトリを自動判定します。このため、リポジトリ名を維持する限りそのまま利用できます。

## QR表示と印刷
1. 公開ページを開く
2. 電子荷票一覧から対象を選ぶ
3. 電子荷票右上にQRが表示される
4. 「QR識別票を印刷」を押す
5. A6縦・倍率100%で印刷する

QRが表示されない場合は、ブラウザーの開発者ツールで `cdn.jsdelivr.net` がブロックされていないか確認してください。

## GitHub Pages版の重要な制約
GitHub Pagesは静的サイトです。電子荷票・担当者・在庫はブラウザーの`localStorage`へ保存されるため、PCで新規作成した荷票は別のスマートフォンへ自動共有されません。初期サンプル `TAG-A7F3C9` はどの端末でも表示できますが、実際の複数端末共有にはMicrosoft Lists、Dataverse、Azure Functions等の共有データ保存先が必要です。

本番QRを印刷する前に、スマートフォンで公開URLを開き、対象荷票が表示できることを確認してください。
