import ts from 'typescript';

/**
 * Configuration for tipi-transformer
 */
interface Config {
  endpoints: {
    /**
     * The path relative to the project root of the directory containing the endpoint modules/files.
     * If the paths starts with ./ this will be trimmed of.
     */
    dir: string,
  }
}

/**
 * Check and transforms the config object.
 *
 * @param {Config} config
 * @throws when the config is incorect
 * @returns {Config}
 */
function checkConfig(config?: Config): Config {
  // Check if the config object is set
  if(!config) {
    throw new Error('tipi-transform: Empty config object');
  }

  // Trim the path if necessary
  if(config.endpoints.dir.startsWith('./')) {
    config.endpoints.dir = config.endpoints.dir.slice(2); 
  }

  return config;
}

/**
 * Transformer that checks all the endpoint modules and adds meta data.
 *
 * Config
 * - endpoint.dir: the path relative to the project root containing the endoints
 *
 * @param {ts.Program} program
 * @param {Config} config - The config object that
 */
function transformer(program: ts.Program, _config?: Config) {
  // Check the config provided by the user.
  const config = checkConfig(_config);

  // Extract the base url for the program.
  const baseUrl = program.getCompilerOptions().baseUrl;

  const transformerFactory: ts.TransformerFactory<ts.SourceFile> = context => {
    return (sourceFile) => {
      // Check if the file is an endpoint, by checking it's location
      // TODO: add support for matching on the filename by adding a match in the config type
      if(sourceFile.fileName.startsWith(`${baseUrl}/${config?.endpoints.dir || ''}`)) {
        // Transform the endpoint
        const endpoint = new Endpoint(context);
        const node =  ts.visitNode(sourceFile, endpoint.visitSourceFile.bind(endpoint));

        console.log('Output');
        console.log(node.getText());

        return node;
      } else {
        // Do not transform this file
        return sourceFile;
      }
    };
  };

  return transformerFactory;
};


export default transformer;
