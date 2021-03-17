// import { DecodedRequest, Endpoint, Request, Response } from "@simonbackx/simple-endpoints";
// import { KeychainedResponse, KeychainItem as KeychainItemStruct, Organization as OrganizationStruct  } from "@stamhoofd/structures";

import { HandleFunc } from "tipi";

// import { KeychainItem } from '../models/KeychainItem';
// import { Token } from '../models/Token';
// type Params = {};
// type Query = undefined;
// type Body = undefined
// type ResponseBody = KeychainedResponse<OrganizationStruct>;

// /**
//  * One endpoint to create, patch and delete groups. Usefull because on organization setup, we need to create multiple groups at once. Also, sometimes we need to link values and update multiple groups at once
//  */

// export class GetOrganizationEndpoint extends Endpoint<Params, Query, Body, ResponseBody> {
//     protected doesMatch(request: Request): [true, Params] | [false] {
//         if (request.method != "GET") {
//             return [false];
//         }

//         const params = Endpoint.parseParameters(request.url, "/organization", {});

//         if (params) {
//             return [true, params as Params];
//         }
//         return [false];
//     }

//     async handle(request: DecodedRequest<Params, Query, Body>) {
//         const token = await Token.authenticate(request);
//         const user = token.user

//         let keychainItems: KeychainItem[] = []

//         // If the user has permission, we'll also search if he has access to the organization's key
//         if (user.permissions !== null) {
//             keychainItems = await KeychainItem.where({
//                 userId: user.id,
//                 publicKey: user.organization.publicKey
//             })
//         }
//         return new Response(new KeychainedResponse({
//             data: await user.getOrganizatonStructure(user.organization),
//             keychainItems: keychainItems.map(m => KeychainItemStruct.create(m))
//         }));
//     }
// }
export const method = 'GET';
export const path = '/organization';

export const auth = true;

export const handle: HandleFunc<undefined, undefined, undefined, undefined, string> = async () => {
    return 'Hello world';
}
