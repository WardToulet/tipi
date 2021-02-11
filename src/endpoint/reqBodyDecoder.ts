export default interface ReqBodyDecoder<ReqBody> {
  (raw: string): ReqBody,
}

export const reqBodyDecoder = {
  noBody: (_raw: string) => undefined
}
