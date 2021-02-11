export default interface ResBodyEncoder<ResBody> {
  (res: ResBody): string,
}

export const resBodyEncoder = {
  string: (raw: any) => raw.toString(),
  json: (raw: any) => JSON.stringify(raw),
}
