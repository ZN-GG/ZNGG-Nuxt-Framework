import http from '~/api/request';

export const admin = {
    download: {
        getList(page: number, size: number): Promise<ApiResponse> {
            return http.get("/admin/download/" + page + "/" + size)
        },
        getCategories(): Promise<ApiResponse> {
            return http.get("/admin/download/category")
        },
        add(params: any): Promise<ApiResponse> {
            return http.post("/admin/download", params)
        },
        update(params: any): Promise<ApiResponse> {
            return http.put("/admin/download", params)
        },
        remove(id: string): Promise<ApiResponse> {
            return http.del("/admin/download/" + id)
        },
        uploadFile(params: FormData): Promise<ApiResponse> {
            return http.post("/admin/download/file", params, { timeout: 120000 })
        },
    },
    project: {
        getList(page: number, size: number): Promise<ApiResponse> {
            return http.get("/admin/project/" + page + "/" + size)
        },
        getCategories(): Promise<ApiResponse> {
            return http.get("/admin/project/category")
        },
        add(params: any): Promise<ApiResponse> {
            return http.post("/admin/project", params)
        },
        update(params: any): Promise<ApiResponse> {
            return http.put("/admin/project", params)
        },
        remove(id: string): Promise<ApiResponse> {
            return http.del("/admin/project/" + id)
        },
    },
    web: {
        getFriendlyLinks(): Promise<ApiResponse> {
            return http.get("/admin/web/friendlyLinks")
        },
        addFriendlyLink(params: any): Promise<ApiResponse> {
            return http.post("/admin/web/friendlyLink", params)
        },
        updateFriendlyLink(params: any): Promise<ApiResponse> {
            return http.put("/admin/web/friendlyLink", params)
        },
        removeFriendlyLink(id: string): Promise<ApiResponse> {
            return http.del("/admin/web/friendlyLink/" + id)
        },
        getNav(): Promise<ApiResponse> {
            return http.get("/admin/web/nav")
        },
        addNavCategory(params: any): Promise<ApiResponse> {
            return http.post("/admin/web/navCategory", params)
        },
        updateNavCategory(params: any): Promise<ApiResponse> {
            return http.put("/admin/web/navCategory", params)
        },
        removeNavCategory(id: string): Promise<ApiResponse> {
            return http.del("/admin/web/navCategory/" + id)
        },
        addNav(params: any): Promise<ApiResponse> {
            return http.post("/admin/web/nav", params)
        },
        updateNav(params: any): Promise<ApiResponse> {
            return http.put("/admin/web/nav", params)
        },
        removeNav(id: string): Promise<ApiResponse> {
            return http.del("/admin/web/nav/" + id)
        },
    },
}
