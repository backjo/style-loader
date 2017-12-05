/* eslint-disable */
import path from 'path';
import webpack from '../helpers/compiler';

describe('Options', () => {
  describe('sourceMap', () => {
    test('{Boolean}', async () => {
      const config = {
        rules: [
          {
            test: /\.css$/,
            use: [
              {
                loader: path.resolve(__dirname, '../../src'),
                options: {
                  sourceMap: true
                }
              },
              {
                loader: 'css-loader',
                options: {
                  sourceMap: true
                }
              }
            ]
          }
        ]
      };

      const stats = await webpack('fixture.js', config);
      let { source } = stats.toJson().modules[3];

      source = source.replace(process.cwd(), '');
      console.log(source);

      expect(source).toMatchSnapshot();
    });
  });
});
