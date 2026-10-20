export type ToolCategoryCopy = {
    intro: string
    description: string
}

const toolCategoryCopy: Record<string, ToolCategoryCopy> = {
    视频: {
        intro: '视频相关的在线工具，包含 FLV 直播播放、HLS/m3u8 播放、m3u8 转 mp4 下载和浏览器录屏。适合临时排查流地址、录制屏幕或保存课程视频。',
        description: '在线视频工具，包含 FLV/HLS 播放、m3u8 下载与屏幕录制。',
    },
    图片: {
        intro: '图片处理相关的在线工具，包含图片转 Base64、PNG 转 SVG、头像框生成和社交图片生成。尽量在浏览器本地完成处理，减少文件上传。',
        description: '在线图片处理工具，包含格式转换、头像框与图片生成。',
    },
    文本: {
        intro: '文本处理相关的在线工具，包含去重、大小写转换、Unicode 转换、隐写和词语生成。适合快速清理数据或做编码验证。',
        description: '在线文本处理工具，包含去重、编码转换与文本生成。',
    },
    程序员: {
        intro: '面向开发者的在线工具，包含时间戳转换、Base64 编解码、CSS 渐变、圆角与毛玻璃生成器。打开即可验证效果，复制代码直接使用。',
        description: '开发者在线工具，包含时间戳、Base64 与 CSS 生成器。',
    },
    办公: {
        intro: '办公场景相关的在线工具，包含 Word 转 PDF 等文档处理能力。转换尽量在本地完成，减少文件上传和隐私风险。',
        description: '在线办公工具，包含 Word 转 PDF 等文档处理。',
    },
}

export function getToolCategoryCopy(name?: string): ToolCategoryCopy {
    if (name && toolCategoryCopy[name]) {
        return toolCategoryCopy[name]
    }
    const label = name || '在线工具'
    return {
        intro: `${label}相关的在线工具集合，打开即用，无需安装。持续补充常用的小工具，尽量把常用操作压缩到一次点击。`,
        description: `${label}相关的在线工具集合，打开即用，无需安装。`,
    }
}
