declare type ApiErrorKind = 'offline' | 'timeout' | 'http' | 'business' | 'network'

declare type ApiResponse = {
    success: boolean
    code: number
    message: string
    data: any
    kind?: ApiErrorKind
    status?: number
}
