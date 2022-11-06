const vscode = acquireVsCodeApi();
const App = {
    init: () => {
        document.getElementById('input').focus();
        document.getElementById('get_result').addEventListener('click', App.svgToDataUri);
        document.getElementById('input').addEventListener('input', App.svgToDataUri);
    },
    svgToDataUri: () => {
        const input = document.getElementById('input'),
            output = document.getElementById('output'),
            val = input.value.replace(/(\swidth="[^"]*"|\sheight="[^"]*")/, ' '),
            quotes = App.getQuotes(),
            namespaced = App.addNameSpace(val),
            escaped = App.encodeSVG(namespaced),
            result = `${quotes.level1}data:image/svg+xml,${escaped}${quotes.level1}`;

        output.value = result;

        vscode.postMessage({
            command: 'copy_result',
            text: result
        });
    },
    getQuotes: () => {
        const double = `"`;
        const single = `'`;

        return {
            level1: single,
            level2: double
        };
    },
    encodeSVG: (data) => {

        const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;
      
        data = data.replace(/'/g, `"`);
        data = data.replace(/>\s{1,}</g, `><`);
        data = data.replace(/\s{2,}/g, ` `);

        return data.replace(symbols, encodeURIComponent);
    },
    addNameSpace: (data) => {
        if (data.indexOf(`http://www.w3.org/2000/svg`) < 0) {
            data = data.replace(/<svg/g, `<svg xmlns=${quotes.level2}http://www.w3.org/2000/svg${quotes.level2}`);
        }

        return data;
    }
};

window.addEventListener('DOMContentLoaded', App.init);