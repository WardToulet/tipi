export default interface ReqeuestBodyDecoder<ReqBody> {
  (raw: string, contentType: string): ReqBody,
}
