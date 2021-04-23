// import ts from 'typescript';

// export interface TransformerOptions {}

// // FIXME: replace any type argument with the proper type
// function transformer(program: ts.Program, _opts?: TransformerOptions): ts.TransformerFactory<any> {
//   // Extract the rootdir from the tsconfg
//   const rootDir = program.getCompilerOptions().rootDir;
//   if(!rootDir) {
//     throw 'A rootdir has to be defined in tsconfig for tipi to work';
//   }

//   /**
//    * Gets a path to a ts file and determines if it is an http endpoint
//    */
//   const isEndpointModule = ({ fileName }: ts.SourceFile) => fileName.startsWith(rootDir)
//     // Filename should end with *.endpoint.ts 
//     && fileName.endsWith('endpoint.ts');

//   return (_context: ts.TransformationContext) => (sourceFile: ts.SourceFile) => 
//     // Only visit sourceFile if it is determined to be an endoint using the isEndopintModule function
//     isEndpointModule(sourceFile)
//       ? ts.visitNode(sourceFile, visitEndpointSourceFile)
//       : sourceFile;
// };

// function visitEndpointSourceFile(node: ts.Node): ts.VisitResult<ts.Node> {
//   console.log(node.getSourceFile().fileName);

//   return ts.visitNodes(node.getChildren(), (node: ts.Node) => {
//     }
//   });
// }

// export default transformer;
