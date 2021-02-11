// HTTP status codes as defined by https://www.ietf.org/assignments/http-status-codes/http-status-codes.txt
// on 11/2/2021
export type HTTPStatusInformational =
	100 | 101 | 102 | 103;

export type HTTPStatusSuccess = 
	200 | 201 | 202 | 203 | 204 | 205 | 206 | 207 | 208 | 226;

export type HTTPStatusRedirection = 
	300 | 301 | 302 | 303 | 304 | 305 | 306 | 307 | 308;

export type HTTPClientError =
	400 | 401 | 402 | 403 | 404 | 405 | 406 | 407 | 408 | 409 | 410 | 411 | 412 |
	413 | 414 | 415 | 416 | 417 | 421 | 422 | 423 | 424 | 425 | 426 | 428 | 429 | 
	431 | 451;

export type HTTPServerError = 
	500 | 501 |	502 |	503 |	504 |	505 |	506 |	507 |	508 | 510 |511;

export type HTTPStatusCode
	= HTTPStatusInformational
	| HTTPStatusSuccess
	| HTTPStatusRedirection
	| HTTPClientError
	| HTTPServerError;

export const httpStatusCode: { [key: string]: HTTPStatusCode } = {
	'Continue': 100,	
	'SwitchingProtocols': 101,	
	'Processing': 102,	
	'EarlyHints': 103,	
	
	'OK': 200,	
	'Created': 201,	
	'Accepted': 202,	
	'Non-AuthoritativeInformation': 203,	
	'NoContent': 204,	
	'ResetContent': 205,	
	'PartialContent': 206,	
	'Multi-Status': 207,	
	'AlreadyReported': 208,	
	
	'IMUsed': 226,	
	
	'MultipleChoices': 300,	
	'MovedPermanently': 301,	
	'Found': 302,	
	'SeeOther': 303,	
	'NotModified': 304,	
	'UseProxy': 305,	
	'(Unused)': 306,	
	'TemporaryRedirect': 307,	
	'PermanentRedirect': 308,	
	
	'BadRequest': 400,	
	'Unauthorized': 401,	
	'PaymentRequired': 402,	
	'Forbidden': 403,	
	'NotFound': 404,	
	'MethodNotAllowed': 405,	
	'NotAcceptable': 406,	
	'ProxyAuthenticationRequired': 407,	
	'RequestTimeout': 408,	
	'Conflict': 409,	
	'Gone': 410,	
	'LengthRequired': 411,	
	'PreconditionFailed': 412,	
	'PayloadTooLarge': 413,	
	'URI TooLong': 414,	
	'UnsupportedMediaType': 415,	
	'RangeNotSatisfiable': 416,	
	'ExpectationFailed': 417,	
	
	'MisdirectedRequest': 421,	
	'UnprocessableEntity': 422,	
	'Locked': 423,	
	'FailedDependency': 424,	
	'TooEarly': 425,	
	'UpgradeRequired': 426,	
	
	'PreconditionRequired': 428,	
	'TooManyRequests': 429,	
	
	'RequestHeaderFieldsTooLarge': 431,	
	
	'UnavailableForLegalReasons': 451,	
	
	'InternalServerError': 500,	
	'NotImplemented': 501,	
	'BadGateway': 502,	
	'ServiceUnavailable': 503,	
	'GatewayTimeout': 504,	
	'HTTP VersionNotSupported': 505,	
	'VariantAlsoNegotiates': 506,	
	'InsufficientStorage': 507,	
	'LoopDetected': 508,	
	
	'NotExtended': 510,	
	'NetworkAuthenticationRequired': 511,	
};
