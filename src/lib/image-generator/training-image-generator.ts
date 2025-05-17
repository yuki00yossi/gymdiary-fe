// トレーニング結果を画像化するユーティリティ関数

import type { TrainingSessionData } from "@/types/myset-training"
import { ImageConfig, defaultConfig } from "./image-config"


// 1枚の画像に表示できる最大種目数
const MAX_WORKOUTS_PER_IMAGE = 3

/**
 * トレーニングセッションデータから画像を生成する
 */
export async function generateTrainingImages(
  sessionData: TrainingSessionData,
  config: Partial<ImageConfig> = {},
): Promise<string[]> {
  // 設定をマージ
  const mergedConfig = { ...defaultConfig, ...config }

  // 画像URLのリスト
  const imageUrls: string[] = []

  // 種目を分割して複数の画像を生成
  const workoutChunks = chunkArray(sessionData.workouts, MAX_WORKOUTS_PER_IMAGE)

  for (let i = 0; i < workoutChunks.length; i++) {
    const workouts = workoutChunks[i]
    const canvas = document.createElement("canvas")
    canvas.width = mergedConfig.width
    canvas.height = mergedConfig.height

    const ctx = canvas.getContext("2d")
    if (!ctx) continue

    // ヘッダーを描画（背景も含む）
    drawHeader(ctx, sessionData, i + 1, workoutChunks.length, mergedConfig)

    // 種目を描画
    drawWorkouts(ctx, workouts, mergedConfig)

    // フッターを描画
    drawFooter(ctx, mergedConfig)

    // 画像URLを生成
    const imageUrl = canvas.toDataURL("image/png")
    imageUrls.push(imageUrl)
  }

  return imageUrls
}

// 日付の文字サイズを大きくし、パディングを追加
function drawHeader(
  ctx: CanvasRenderingContext2D,
  sessionData: TrainingSessionData,
  pageNum: number,
  totalPages: number,
  config: ImageConfig,
) {
  const { width, padding, fontFamily, titleFontSize, smallFontSize } = config

  // 背景グラデーションを設定（全体に適用）
  const gradient = ctx.createLinearGradient(0, 0, 0, config.height)
  gradient.addColorStop(0, "#ff5722") // 上部：オレンジ
  gradient.addColorStop(1, "#d32f2f") // 下部：赤

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, config.height)

  // タイトルを描画（上部のパディングを増やす）
  const topPadding = padding * 1.5
  ctx.fillStyle = "#ffffff"
  ctx.font = `bold ${titleFontSize}px ${fontFamily}`
  ctx.textAlign = "center"
  ctx.fillText(sessionData.name, width / 2, topPadding + titleFontSize)

  // 日付を取得
  const today = new Date().toLocaleDateString("ja-JP", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })

  // 日付を描画（文字サイズを大きくする）
  ctx.font = `${smallFontSize * 1.5}px ${fontFamily}`
  ctx.fillText(today, width / 2, topPadding + titleFontSize + smallFontSize * 1.5 + 10)

  // ページ番号を描画（複数ページの場合）
  if (totalPages > 1) {
    ctx.textAlign = "right"
    ctx.fillText(`${pageNum}/${totalPages}`, width - padding, topPadding + smallFontSize)
    ctx.textAlign = "center"
  }
}

// 種目を描画する関数も更新して、縦のパディングを増やす
function drawWorkouts(ctx: CanvasRenderingContext2D, workouts: any[], config: ImageConfig) {
  const { width, padding, textColor, fontFamily, subtitleFontSize, normalFontSize, smallFontSize } = config

  // ヘッダー下の開始Y位置（パディングを増やす）
  let y = padding * 2 + config.titleFontSize + smallFontSize * 1.5 + 60

  workouts.forEach((workout, index) => {
    // 種目背景（半透明の白）
    const workoutHeight = 100 + workout.sets.length * 70 + (workout.sets.some((s: any) => s.memo) ? 50 : 0)
    ctx.fillStyle = "rgba(255, 255, 255, 0.1)"
    ctx.fillRect(padding, y - 30, width - padding * 2, workoutHeight)
    ctx.strokeStyle = "rgba(255, 255, 255, 0.3)"
    ctx.lineWidth = 2
    ctx.strokeRect(padding, y - 30, width - padding * 2, workoutHeight)

    // 種目名を描画
    ctx.fillStyle = textColor
    ctx.font = `bold ${subtitleFontSize}px ${fontFamily}`
    ctx.textAlign = "center"
    ctx.fillText(`第${index + 1}種目`, width / 2, y)

    y += subtitleFontSize

    ctx.fillText(workout.menu, width / 2, y)

    y += subtitleFontSize + 30

    // セットを描画（セット間の余白を増やす）
    workout.sets.forEach((set: any, setIndex: number) => {
      // セット背景（半透明の黄色）
      ctx.fillStyle = "rgba(255, 235, 59, 0.1)"
      ctx.fillRect(padding + 20, y - 25, width - padding * 2 - 40, 60)

      // セット番号
      ctx.fillStyle = "#ffffff"
      ctx.font = `bold ${normalFontSize}px ${fontFamily}`
      ctx.textAlign = "left"
      ctx.fillText(`${setIndex + 1}セット目`, padding + 40, y + 5)

      // 重量/距離と回数/時間
      ctx.fillStyle = "#ffffff"
      ctx.font = `${normalFontSize}px ${fontFamily}`
      ctx.textAlign = "right"

      let detailText = ""
      if (workout.type === "weight") {
        detailText = `${set.weight || 0} ${workout.unit} × ${set.reps || 0} 回`
      } else {
        detailText = `${set.distance || 0} ${workout.unit} / ${set.time || "00:00"}`
      }

      ctx.fillText(detailText, width - padding - 40, y + 5)

      y += normalFontSize + 35

      // メモがあれば表示
      if (set.memo) {
        ctx.fillStyle = "rgba(255, 255, 255, 0.7)" // 半透明の白
        ctx.font = `italic ${smallFontSize * 1.2}px ${fontFamily}`
        ctx.textAlign = "center"

        // メモが長い場合は省略
        const maxMemoLength = 50
        const memoText = set.memo.length > maxMemoLength ? set.memo.substring(0, maxMemoLength) + "..." : set.memo

        ctx.fillText(`"${memoText}"`, width / 2, y)
        y += smallFontSize * 1.2 + 20
      }
    })

    // 種目間の余白を増やす
    y += 50
  })
}

// フッター関数を更新して、ロゴの読み込みを同期的に処理し、「Powered by Gym Diary」テキストを確実に表示するように修正します
function drawFooter(ctx: CanvasRenderingContext2D, config: ImageConfig) {
  const { width, height, padding, fontFamily, smallFontSize } = config

  // "Powered by Gym Diary" テキストを先に描画
  ctx.fillStyle = "#ffffff"
  ctx.font = `bold ${smallFontSize * 1.2}px ${fontFamily}`
  ctx.textAlign = "center"
  ctx.fillText("Powered by Gym Diary", width / 2 + 60, height - padding)

  // ロゴを読み込んで描画（非同期処理の問題を回避するため、画像は事前にロードしておくことが望ましい）
  const logo = new Image()
  logo.crossOrigin = "anonymous"
  logo.src = "/images/logo_color.png"

  // ロゴのサイズを計算（高さ60pxに合わせる）
  const logoHeight = 60
  const logoWidth = 60 // 正方形と仮定

  // ロゴを描画（中央下部）
  ctx.drawImage(logo, width / 2 - logoWidth - 70, height - padding - logoHeight / 2, logoWidth, logoHeight)
}

/**
 * 配列を指定サイズのチャンクに分割する
 */
function chunkArray<T>(array: T[], chunkSize: number): T[][] {
  const chunks: T[][] = []
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize))
  }
  return chunks
}

/**
 * 画像をダウンロードする
 */
export function downloadImage(dataUrl: string, filename: string) {
  const link = document.createElement("a")
  link.href = dataUrl
  link.download = filename
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

/**
 * Web Share APIを使って画像をシェアする
 * 注: モバイルデバイスでのみ動作
 */
export async function shareImage(dataUrl: string, title: string): Promise<boolean> {
  if (!navigator.share) {
    return false
  }

  try {
    // Data URLからBlobを作成
    const response = await fetch(dataUrl)
    const blob = await response.blob()

    // ファイル名を設定
    const file = new File([blob], "training-result.png", { type: "image/png" })

    // シェア
    await navigator.share({
      title: title,
      text: "トレーニング記録をシェアします",
      files: [file],
    })

    return true
  } catch (error) {
    console.error("シェアに失敗しました:", error)
    return false
  }
}
