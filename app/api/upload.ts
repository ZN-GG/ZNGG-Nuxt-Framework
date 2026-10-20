import http from '~/api/request';

export const upload = {
    uploadImage(params: any): Promise<ApiResponse> {
        return http.post("/user/image", params, { timeout: 60000 })
    },
    uploadImageCover(params: any): Promise<ApiResponse> {
        return http.post("/user/image/cover", params, { timeout: 60000 })
    }
}