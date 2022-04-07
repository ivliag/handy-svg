import {checkSvgContent} from './utils';

const DEFAULT_TIMEOUT = 4800;
const DEFAULT_RETRY_COUNT = 3;

interface RequestParams extends RequestInit {
    timeout?: number;
    retryCount?: number;
}

async function fetchWithTimeout(url: string, params?: RequestParams) {
    const timeout = params?.timeout || DEFAULT_TIMEOUT;
    const controller = new AbortController();
    const id = setTimeout(() => controller.abort(), timeout);

    return fetch(url, {
        ...params,
        signal: controller.signal
    })
    .then((response) => {
        clearTimeout(id);
        return response;
    })
    .catch((error) => {
        clearTimeout(id);
        throw error;
    })
}


export function fetchSvg(url: string, params?: RequestParams) {
    let retryCount = params?.retryCount === undefined ? DEFAULT_RETRY_COUNT : params?.retryCount;

    return fetchWithTimeout(url, params)
        .then((response) => {
            if (response.ok) {
                return response.text();
            }

            throw new Error(`Unable to load SVG file: ${url}`);
        })
        .catch((error) => {
            if (retryCount > 0) {
                retryCount--;
                return fetchWithTimeout(url, params);
            }

            throw error;
        })
        .then((response) => {
            const svgContent = response as string;
            checkSvgContent(svgContent);
            return svgContent;
        });
}
