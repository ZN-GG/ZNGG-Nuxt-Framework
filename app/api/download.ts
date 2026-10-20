import http from '~/api/request';

export const download = {

    getCategories(): Promise<ApiResponse> {
        return http.get("/portal/download_category")
    },

    getList(page: number, size: number, params: Record<string, any> = {}): Promise<ApiResponse> {
        return http.get("/portal/download/" + page + "/" + size, params)
    },

    getDetail(id: string): Promise<ApiResponse> {
        return http.get("/portal/download/" + id)
    },

    getFileUrl(id: string): string {
        return http.baseUrl + "/portal/download/" + id + "/file"
    },
}
