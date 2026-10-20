export type ArticleCategoryCopy = {
    intro: string
    description: string
    toolSlugs?: string[]
}

export const toolNames: Record<string, string> = {
    Timestamp: '时间戳转换',
    Base64Convert: 'Base64 转换',
    ImageToBase64: '图片转 Base64',
    UnicodeConvert: 'Unicode 转换',
    TextDistinct: '文本去重',
    EnglistConvert: '大小写转换',
    MakePhrase: '词语生成',
    CSSGradient: 'CSS 渐变生成器',
    FancyBorderRadius: '圆角生成器',
    CssGlassGenerates: '毛玻璃生成器',
    PngToSVG: 'PNG 转 SVG',
    Whois: 'Whois 查询',
}

export const articleCategoryCopy: Record<string, ArticleCategoryCopy> = {
    前端: {
        intro: '前端开发相关的实践与总结，涵盖 HTML、CSS、JavaScript、TypeScript、Vue、Nuxt、性能优化与工程化。这里记录实际项目中的问题、方案和取舍，尽量给出可以直接复用的代码与配置。',
        description: '前端开发技术文章，涵盖 Vue、Nuxt、CSS、JavaScript、性能优化与工程化实践。',
        toolSlugs: ['CSSGradient', 'FancyBorderRadius', 'CssGlassGenerates'],
    },
    后端: {
        intro: '后端开发相关的技术文章，涵盖 Java、Spring Boot、数据库、缓存、接口设计与部署运维。内容以真实项目为背景，记录踩坑过程与可落地的解决方案。',
        description: '后端开发技术文章，涵盖 Java、Spring Boot、数据库、缓存与部署实践。',
        toolSlugs: ['Base64Convert', 'Timestamp', 'Whois'],
    },
    工具: {
        intro: '在线工具的使用说明、实现思路与更新记录。这里的文章会解释工具解决了什么问题、适合什么场景，以及使用时的注意事项。',
        description: '在线工具使用说明、实现思路与更新记录。',
        toolSlugs: ['Timestamp', 'Base64Convert', 'CSSGradient'],
    },
    设计: {
        intro: '设计与视觉相关的内容，包括配色、排版、CSS 视觉效果和界面细节。偏向可以直接在网页里实现的方案，而不是纯理论。',
        description: '设计与视觉相关内容，涵盖配色、排版与 CSS 视觉效果。',
        toolSlugs: ['CSSGradient', 'FancyBorderRadius', 'CssGlassGenerates'],
    },
    AI: {
        intro: '人工智能相关的实践记录，包括模型调用、提示词、本地部署和 AI 辅助开发。重点关注怎么把 AI 真正接进现有项目，而不是停留在演示阶段。',
        description: '人工智能实践文章，涵盖模型调用、提示词、本地部署与 AI 辅助开发。',
        toolSlugs: ['MakePhrase', 'TextDistinct'],
    },
    逆向: {
        intro: '逆向工程与协议分析相关的笔记，涉及抓包、编码还原、混淆分析和安全边界。内容仅用于学习和防御性研究。',
        description: '逆向工程与协议分析笔记，涵盖抓包、编码还原与混淆分析。',
        toolSlugs: ['Base64Convert', 'UnicodeConvert', 'TextSecret'],
    },
    安卓: {
        intro: 'Android 开发与打包相关的记录，包括环境配置、构建流程、常见报错和工具链问题。偏向实际项目中会遇到的坑。',
        description: 'Android 开发与打包实践，涵盖环境配置、构建流程与常见问题。',
        toolSlugs: ['Base64Convert', 'ImageToBase64'],
    },
    运维: {
        intro: '服务器与部署运维相关的内容，包括 Linux、Nginx、Docker、进程管理和线上问题排查。记录真实环境下的配置和排错过程。',
        description: '服务器与部署运维文章，涵盖 Linux、Nginx、Docker 与线上排查。',
        toolSlugs: ['Timestamp', 'Whois'],
    },
    其它: {
        intro: '不属于固定分类的杂项记录，包含一些临时方案、工具技巧和问题备忘。内容较杂，但大多是实际用到过的。',
        description: '杂项技术记录、工具技巧与问题备忘。',
        toolSlugs: ['Timestamp', 'Base64Convert'],
    },
}

export function getArticleCategoryCopy(name?: string): ArticleCategoryCopy {
    if (name && articleCategoryCopy[name]) {
        return articleCategoryCopy[name]
    }
    const label = name || '技术'
    return {
        intro: `${label}相关的技术文章与实践经验，记录实际项目中的问题、方案和取舍，持续更新。`,
        description: `${label}相关的技术文章与实践经验，持续更新。`,
        toolSlugs: [],
    }
}
