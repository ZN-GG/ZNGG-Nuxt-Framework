export function splitUrls(value: unknown): string[] {
    if (!value) return []
    if (Array.isArray(value)) {
        return value.map(item => String(item).trim()).filter(Boolean)
    }
    return String(value)
        .split(/[\n,，]/)
        .map(item => item.trim())
        .filter(Boolean)
}

export function splitTags(value: unknown): string[] {
    if (!value) return []
    if (Array.isArray(value)) {
        return value.map(item => String(item).trim()).filter(Boolean)
    }
    return String(value)
        .split(/[,，]/)
        .map(item => item.trim())
        .filter(Boolean)
}
