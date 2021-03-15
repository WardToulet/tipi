export type ResponesBodyMeta = {
  'Content-Type': string,
}

export default interface ResponseBodyEncoder<ResponseBody> {
  (res: ResponseBody): { body: string, headers?: ResponesBodyMeta },
}

export const responseBodyEncoder: { [key: string]: ResponseBodyEncoder<any> } = {
  string: (raw: any) => 
    ({ body: raw.toString(), headers: { 'Content-Type': 'application/json' } }),
  json: (raw: any) => 
    ({ body: JSON.stringify(raw), headers: { 'Content-Type': 'application/text' } }),
}
