const apiUrl = import.meta.env.VITE_BACKEND_URL;

async function apiCall<T>(
    route: string,
    method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE' = 'GET',
    data?: unknown,
): Promise<T> {

    const options: RequestInit = {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: data ? JSON.stringify(data) : undefined,
    };

    try {
        const res = await fetch(`${apiUrl}/${route}`, options);
        if (!res.ok) throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        return await res.json() as T;
    } catch (err) {
        console.error(`API call failed (${method} ${route}):`, err);
        throw err;
    }
}

type HealthResponse = {
    message: string,
}

export async function apiHealth(): Promise<HealthResponse> {
    const result = await apiCall<HealthResponse>("game", "GET");

    console.log(result)
    return result;
}

export default apiCall;