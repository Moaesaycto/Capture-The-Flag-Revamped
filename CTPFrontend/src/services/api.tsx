const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function apiCall<T>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    data?: unknown,
    jwt?: string,
): Promise<T> {
    const options: RequestInit = {
        method,
        headers: {
            'Content-Type': 'application/json',
            ...(jwt ? { Authorization: `Bearer ${jwt}` } : {}),
        },
        body: data ? JSON.stringify(data) : undefined,
        credentials: "include",
    };

    console.log(route, options)

    const res = await fetch(`${apiUrl}/${route}`, options);

    if (!res.ok) {
        let msg = `Error ${res.status}: ${res.statusText}`;
        try {
            const body = await res.json();
            if (body.message) msg = body.message;
        } catch { }
        throw new Error(msg);
    }

    return await res.json() as T;

}

type HealthResponse = {
    message: string,
}

export async function apiHealth(): Promise<HealthResponse> {
    const result = await apiCall<HealthResponse>("game", "GET");
    return result;
}

export default apiCall;