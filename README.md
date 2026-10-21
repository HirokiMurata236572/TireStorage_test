# DUNLOP タイヤ電子荷票 本運用版

構成はGitHub Pages（画面）＋Supabase（認証・PostgreSQL共有DB・リアルタイム通知）です。別端末でも最新在庫を参照・更新できます。

## 導入手順
1. Supabaseでプロジェクトを作成。
2. SQL Editorで`schema.sql`を実行。完了条件: `staff`、`tire_tags`、`stock_history`が作成される。
3. Authentication > Usersで利用者を作成。公開登録は有効にしない。
4. Project Settings > APIからProject URLとpublishable/anon keyを取得。
5. `config.example.js`を`config.js`へコピーし、2値を設定。service_role keyは絶対に置かない。
6. `index.html`、`app.js`、`style.css`、`config.js`、`supabase.bundle.js`、`qrcode.min.js`、`.nojekyll`をGitHub Pages公開ブランチ直下へ配置。
7. Supabase Authentication > URL ConfigurationのSite URLへ`https://hirokimurata236572.github.io/TireStorage_test/`を設定。
8. Supabase Database > Replicationで`tire_tags`のRealtimeを有効化。

## 動作確認
- 端末Aでログインし、担当者と電子荷票を作成。
- 端末Bで同じURLにログインし、同じ荷票が見えることを確認。
- 端末Aで入庫し、端末Bへ反映されることを確認。
- 同時更新時はversion不一致で後発更新を止め、再読込を促します。
- QRは`?tag=TAG-XXXXXXXX`を指し、未ログイン時はログイン後に該当荷票を開きます。

## 安全設計
- Row Level Securityにより未認証アクセスを拒否。
- 在庫更新はDB関数内のトランザクションと行ロックで実施。
- 負在庫禁止、担当者無効化後の利用禁止、履歴の直接変更禁止。
- 電子荷票は在庫0本の場合のみ論理削除。
- 担当者無効化後も`staff_name`を履歴に保持。

## 制約
管理者権限の分離は初期版に含めていません。全ログイン利用者が在庫更新・担当者管理を行えます。本番開始前に、必要なら`profiles.role`を追加して管理画面を管理者限定にしてください。
