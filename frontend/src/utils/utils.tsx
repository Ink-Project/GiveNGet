export const basicFetchOptions: RequestInit = {
  method: 'GET',
  credentials: 'include',
};

export const deleteOptions: RequestInit = {
  method: 'DELETE',
  credentials: 'include',
};

export const getPostOptions = (body: any): RequestInit => ({
  method: 'POST',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const getPatchOptions = (body: any): RequestInit => ({
  method: 'PATCH',
  credentials: 'include',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(body),
});

export const fetchHandler = async (url: string, options: RequestInit = {}): Promise<[any, Error | null]> => {
  try {
    const response = await fetch(url, options);
    const { ok, status, headers } = response;
    if (!ok) throw new Error(`Fetch failed with status - ${status}`);

    const isJson = (headers.get('content-type') || '').includes('application/json');
    const responseData = await (isJson ? response.json() : response.text());
    console.log(responseData)
    return [responseData, null];
  } catch (error) {
    console.warn(error);
    return [null, error as Error];
  }
};

export const imageUrl = import.meta.env.PROD
  ? (img: string) => img
  : (img: string) => window.location.origin + img;
