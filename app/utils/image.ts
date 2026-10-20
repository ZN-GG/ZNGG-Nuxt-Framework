export async function normalizeImageFile(
    file: File,
    options: { maxSize?: number, outputType?: 'image/jpeg' | 'image/png', quality?: number } = {}
): Promise<File> {
    const { maxSize = 1920, outputType = 'image/jpeg', quality = 0.9 } = options

    if (!file.type.startsWith('image/')) {
        throw new Error('请选择图片文件')
    }

    let bitmap: ImageBitmap
    try {
        bitmap = await createImageBitmap(file)
    } catch {
        throw new Error('不支持该图片格式，请使用 JPG 或 PNG')
    }

    const scale = Math.min(1, maxSize / Math.max(bitmap.width, bitmap.height))
    const canvas = document.createElement('canvas')
    canvas.width = Math.max(1, Math.round(bitmap.width * scale))
    canvas.height = Math.max(1, Math.round(bitmap.height * scale))

    const context = canvas.getContext('2d')
    if (!context) {
        bitmap.close()
        throw new Error('图片处理失败，请重试')
    }

    context.drawImage(bitmap, 0, 0, canvas.width, canvas.height)
    bitmap.close()

    const blob = await new Promise<Blob | null>(resolve => canvas.toBlob(resolve, outputType, quality))
    if (!blob) {
        throw new Error('图片处理失败，请重试')
    }

    const extension = outputType === 'image/png' ? '.png' : '.jpg'
    const name = file.name.replace(/\.[^.]+$/, '') + extension
    return new File([blob], name, { type: outputType })
}
