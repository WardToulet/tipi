export default interface ResponseBodyEncoder<ResponseBody> {
  (res: ResponseBody): string,
}

export const responseBodyEncoder = {
  string: (raw: any) => raw.toString(),
  json: (raw: any) => JSON.stringify(raw),
}
