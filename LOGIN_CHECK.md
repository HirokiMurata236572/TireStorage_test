# ログインできない場合の確認
1. `config.js`のProject URLとpublishable/anon keyを確認（service_roleは禁止）。
2. GitHub Pages上の`/TireStorage_test/config.js`が404でないことを確認。
3. Supabase > Authentication > ProvidersでEmailを有効化。
4. Authentication > Usersで利用者を作成し、Email Confirmedを確認。
5. Authentication > URL ConfigurationのSite URLを`https://hirokimurata236572.github.io/TireStorage_test/`に設定。
6. `schema.sql`をSQL Editorで実行済みか確認。
7. GitHubへ上書き後、Ctrl+F5で再読み込み。
