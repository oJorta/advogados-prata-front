import cookies from "js-cookie"

export function checkUserAuthenticated() {
    const userToken = cookies.get("accessToken")
    return !!userToken
}