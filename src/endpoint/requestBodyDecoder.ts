export default interface ReqeuestBodyDecoder<ReqBody> {
  (raw: string): ReqBody,
}
