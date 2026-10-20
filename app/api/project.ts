import http from '~/api/request';

export const project = {

    getCategories(): Promise<ApiResponse> {
        return http.get("/portal/project_category")
    },

    getList(page: number, size: number, params: Record<string, any> = {}): Promise<ApiResponse> {
        return http.get("/portal/project/" + page + "/" + size, params)
    },

    getDetail(id: string): Promise<ApiResponse> {
        return http.get("/portal/project/" + id)
    },
}
