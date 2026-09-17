YA Explorer PWA v1.0.0
=======================

Work Hub v1.0.2のYA Explorerだけを、iPhone/Android/PCで使えるPWAとして分離したものです。
取得後にコピーされるinfoのJSONは、Work Hub v1.0.2と同じ構造・キー順です。

【1. YA Explorer専用Apps Scriptを公開】
1) https://script.google.com/ を開き「新しいプロジェクト」
2) Code_YA_Explorer_PWA.gs の内容を貼り付けて保存
3) 右上「デプロイ」→「新しいデプロイ」
4) 種類は「ウェブアプリ」
5) 次のユーザーとして実行：自分
6) アクセスできるユーザー：全員
7) 「デプロイ」を押して /exec で終わるウェブアプリURLをコピー

※既存のWork Hub用Apps Scriptは変更しません。必ず別プロジェクトとして作成してください。

【2. PWAを公開】
このフォルダ内のファイルをすべて、GitHub PagesなどのHTTPSサーバーへアップロードします。
index.htmlだけでなく、画像・JavaScript・CSS等も同じ階層へ置いてください。

【3. 初回設定と使い方】
1) 公開したPWAを開く
2) 「初回設定」を開き、手順1のApps Script URLを保存
3) Yahoo!オークションの商品URLを貼り付け
4) 「JSONを取得してコピー」を押す

iPhoneではSafariの共有ボタン→「ホーム画面に追加」でアプリとして使えます。

【注意】
- 対象URLは https://auctions.yahoo.co.jp/jp/auction/ で始まる商品ページです。
- Yahoo!オークション側のページ構造が変わると、取得処理の調整が必要になる場合があります。
- Apps Scriptの公開範囲が「全員」以外だと、PWAから取得できません。
