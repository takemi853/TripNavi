# TripNavi
240905〜


```
/tripnavi-app
│
├── /app
│   ├── /api
│   │   ├── /get-route
│   │   │   └── route.ts  // ChatGPT API を使用してルートを生成するAPIエンドポイント
│   │   └── /get-tourist-spots
│   │       └── route.ts  // 観光地情報を取得するAPIエンドポイント
│   ├── /components
│   │   └── MapComponent.tsx  // 地図を表示するコンポーネント
│   ├── /selected
│   │   └── page.tsx  // 選択された観光地を表示するページ
│   └── /route-search
│       └── page.tsx  // ルート検索ページ
│
├── /public
│   ├── /marker-icon-red.png  // マーカーアイコン
│   ├── /marker-icon-2x-red.png  // マーカーアイコン（2倍サイズ）
│   └── /marker-shadow.png  // マーカーの影
│
├── /styles
│   └── globals.css  // グローバルCSSスタイル
│
├── .env.local  // OpenAI APIキーを保存する環境変数ファイル
├── .gitignore  // バージョン管理から除外するファイルリスト
├── next.config.js  // Next.js の設定ファイル
├── package.json  // パッケージ情報と依存関係
└── tsconfig.json  // TypeScriptの設定ファイル
```

### 主なフォルダとファイル

1. **`/app/api/get-route`**: ルートを生成するAPIエンドポイントのコードが入っています。
2. **`/app/api/get-tourist-spots`**: 観光地情報を取得するAPIエンドポイント。
3. **`/app/route-search`**: ユーザーが訪れる場所を入力し、ルートを生成するページのコードが入っています。
4. **`/app/components/MapComponent.tsx`**: 地図を表示し、マーカーを配置するためのコンポーネント。
5. **`/public`**: 静的なファイル（画像など）を配置するディレクトリ。ここには地図のマーカーアイコンを保存しています。
6. **`.env.local`**: OpenAIのAPIキーを設定します（バージョン管理には含めません）。
7. **`.gitignore`**: `node_modules` や `.env.local` など、バージョン管理に含めたくないファイルを指定します。

この構成で、ルート検索機能を含む観光案内アプリが構築されます。