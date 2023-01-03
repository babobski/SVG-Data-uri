const vscode = acquireVsCodeApi();
let App = {
    externalQuotes: 'single',
    init: () => {
        let singleQoutes = document.getElementById('single_quote');
        let doubleQoutes = document.getElementById('double_quote');

        singleQoutes.addEventListener('click', App.setExternalQoutes);
        doubleQoutes.addEventListener('click', App.setExternalQoutes);

        document.getElementById('input').focus();
        document.getElementById('get_result').addEventListener('click', App.svgToDataUri);
        document.getElementById('input').addEventListener('input', App.svgToDataUri);
    },
    svgToDataUri: () => {
        const input = document.getElementById('input'),
            output = document.getElementById('output'),
            val = input.value.replace(/(\swidth="[^"]*"|\sheight="[^"]*")/g, ' '),
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
    setExternalQoutes: (e) => {
        const quotes = e.target.dataset.quote;
        const singleQoutes = document.getElementById('single_quote');
        const doubleQoutes = document.getElementById('double_quote');
        App.externalQuotes = quotes;

        if (quotes === 'double') {
            singleQoutes.classList.remove('active');
            doubleQoutes.classList.add('active');
        } else {
            singleQoutes.classList.add('active');
            doubleQoutes.classList.remove('active');
        }
    },
    getQuotes: () => {
        const double = `"`;
        const single = `'`;

        return {
            level1: App.externalQuotes === 'double' ? double : single,
            level2: App.externalQuotes === 'double' ? single : double
        };
    },
    encodeSVG: (data) => {

        const symbols = /[\r\n%#()<>?[\\\]^`{|}]/g;
      
        data = App.externalQuotes === 'double' ? data.replace(/"/g, `'`) : data.replace(/'/g, `"`);
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