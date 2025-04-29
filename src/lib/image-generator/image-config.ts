// 画像生成のための設定
export interface ImageConfig {
  width: number
  height: number
  padding: number
  backgroundColor: string
  textColor: string
  accentColor: string
  fontFamily: string
  titleFontSize: number
  subtitleFontSize: number
  normalFontSize: number
  smallFontSize: number
}

// デフォルト設定を更新
export const defaultConfig: ImageConfig = {
  width: 1080, // 正方形の画像サイズ
  height: 1080,
  padding: 40,
  backgroundColor: "#ff5722", // オレンジ/赤のベース色
  textColor: "#ffffff",
  accentColor: "#ffeb3b", // 黄色のアクセント
  fontFamily: "'Montserrat', system-ui, -apple-system, sans-serif",
  titleFontSize: 48,
  subtitleFontSize: 32,
  normalFontSize: 24,
  smallFontSize: 18,
}
