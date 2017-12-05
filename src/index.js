/* eslint-disable */
import path from 'path';

import { getOptions, stringifyRequest } from 'loader-utils';
import validateOptions from 'schema-utils';

export default function loader() {}

export function pitch(request) {
  const options = getOptions(this) || {};

  validateOptions(require('./options.json'), options, 'Style Loader');

  // TODO eventually remove options.hmr in favour of
  // e.g this._module.hot || this.hot
  options.hmr = typeof options.hmr === 'undefined' ? true : options.hmr;

  const hmr = [
    '// Hot Module Replacement',
    'if (module.hot) {',
    '  // When the styles change, update the <style> tags',
    '  if (!locals) {',
    `    module.hot.accept(${stringifyRequest(this, `!!${request}`)}, () => {`,
    '      // TODO update to ESM',
    `      let hot = require(${stringifyRequest(this, `!!${request}`)});`,
    '',
    '      if (typeof hot === "string") {',
    '        hot = [[module.id, hot, ""]];',
    '      }',
    '',
    '      style(hot);',
    '    });',
    '  }',
    '',
    '  // When the module is disposed, remove the <style> tags',
    '  module.hot.dispose(() => style());',
    '}',
  ].join('\n');

  return [
    '/** ',
    ' * Style Loader',
    ' *',
    ' * Adds CSS to the DOM by adding a <style> tag',
    ' */',
    `import css from ${stringifyRequest(this, `!!${request}`)};`,
    `import style from ${stringifyRequest(this, `!${path.join(__dirname, 'lib/index.js')}`)};`,
    options.transform
      ? `import transform from ${stringifyRequest(this, `!${path.resolve(options.transform)}`)};`
      : '',
    '',
    '// Apply CSS',
    'let content = css',
    '// Export CSS Modules',
    '// TODO update for css-loader v1.0.0',
    'export const locals = css.locals ? css.locals : {}',
    '',
    '// Convert CSS',
    'if (typeof content === "string") content = [[module.id, css, ""]];',
    '',
    '// Loader Options',
    `const options = ${JSON.stringify(options)}`,
    '',
    options.transform ? 'options.transform = transform' : '',
    '',
    '// Add Styles (DOM)',
    'const styles = style(content, options);',
    '',
    options.hmr ? hmr : '',
  ].join('\n');
}
