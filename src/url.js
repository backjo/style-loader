// style-loader/url
/* eslint-disable */
import path from 'path';

import { getOptions, stringifyRequest } from 'loader-utils';
import validateOptions from 'schema-utils';

export default function loader() {}

export function pitch(request) {
  const options = getOptions(this) || {};

  validateOptions(require('./options.json'), options, 'Style Loader (URL)');

  // TODO eventually remove options.hmr in favour of
  // e.g this._module.hot || this.hot
  options.hmr = typeof options.hmr === 'undefined' ? true : options.hmr;

  const hmr = [
    '// Hot Module Replacement',
    'if (module.hot) {',
    `  module.hot.accept(${stringifyRequest(this, `!!${request}`)}, () => {`,
    `    link(require(${stringifyRequest(this, `!!${request}`)}));`,
    '  });',
    '',
    '  module.hot.dispose(() => link());',
    '}',
  ].join('\n');

  return [
    '/** ',
    ' * Style Loader',
    ' *',
    ' * Adds CSS to the DOM by adding a <link> tag',
    ' */',
    `import link from ${stringifyRequest(this, `!${path.join(__dirname, 'lib/url/index.js')}`)};`,
    `import href from ${stringifyRequest(this, `!!${request}`)};`,
    '',
    `link(href, ${JSON.stringify(options)});`,
    '',
    options.hmr ? hmr : '',
  ].join('\n');
}
