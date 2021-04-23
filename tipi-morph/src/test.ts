type Request = {
  pathvariables?: { [key: string]: string },
  query?: { [key: string]: string },
  body?: any,
}
interface HandleFunc<Req extends Request, Res> {
  (req: Req): Promise<Res>,
} 

export const handle: HandleFunc<
  {
    body: string,
  },
  string
> = async ({ body }) => {
  return `Hello World, ${body}`;
}
