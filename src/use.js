// style-loader/use
/* eslint-disable */
import path from 'path';

import { getOptions, stringifyRequest } from 'loader-utils';
import validateOptions from 'schema-utils';

export default function loader() {}

export function pitch(request) {
  const options = getOptions(this) || {};

  validateOptions(require('./options.json'), options, 'Style Loader (Useable)');

  // TODO eventually remove options.hmr in favour of
  // e.g this._module.hot || this.hot
  options.hmr = typeof options.hmr === 'undefined' ? true : options.hmr;

  const hmr = [
    '// Hot Module Replacement',
    'if (module.hot) {',
    '  let lastRefs = module.hot.data && module.hot.data.refs || 0;',
    '',
    '  if (lastRefs) {',
    '    // exports.ref();',
    '    use();',
    '',
    '    if (!content.locals) {',
    '      refs = lastRefs;',
    '    }',
    '  }',
    '',
    '  if (!content.locals) {',
    '    module.hot.accept();',
    '  }',
    '',
    '  module.hot.dispose(function(data) {',
    '    data.refs = content.locals ? 0 : refs;',
    '',
    '    if (dispose) {',
    '      dispose();',
    '    }',
    '  });',
    '}',
  ].join('\n');

  return [
    `import css from ${stringifyRequest(this, `!!${request}`)}`,
    `import runtime from ${stringifyRequest(this, `!${path.join(__dirname, 'lib/index.js')}`)}`,
    '',
    'let refs = 0;',
    'let dispose;',
    '',
    'let content = css',
    '',
    'if (typeof content === "string") content = [[module.id, content, ""]];',
    '// TODO update for css-loader v1.0.0',
    'export const locals = content.locals ? content.locals : null',
    '',
    'export function use () {',
    '  if(!(refs++)) {',
    `    dispose = runtime(content, ${JSON.stringify(options)});`,
    '  }',
    '// return exports;',
    '  return dispose;',
    '};',
    '',
    'export function unuse () {',
    '  if(refs > 0 && !(--refs)) {',
    '    dispose();',
    '',
    '    dispose = null;',
    '  }',
    '};',
    '',
    options.hmr ? hmr : ''
  ].join('\n');
}
