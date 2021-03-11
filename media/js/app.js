const vscode = acquireVsCodeApi();
var App = {
    init: () => {
        document.getElementById('input').focus();
        document.getElementById('get_result').addEventListener('click', App.svgToDataUri);
        document.getElementById('input').addEventListener('input', App.svgToDataUri);
    },
    svgToDataUri: () => {
        var input = document.getElementById('input'),
            output = document.getElementById('output'),
            val = input.value;

        if (val.length > 0) {
            var result = val.replace(/(width="[^"]*"|height="[^"]*"|class="[^"]*"|style="enable-background:new[\s0-9\.]+;"|id="[^"]*"|\sx="[^"]*"|\sy="[^"]*"|version="[^"]*"|xmlns:xlink="[^"]*"|xml:space="[^"]*"|<g>|\<\/g\>|\n|\r)/gi, '');
            result = result.replace(/(\s{2,})/g, ' ');
            result = result.replace(/\>\s+\</g, '><');
            result = result.replace(/#/g, '%23');
            result = result.replace(/"/g, '\'');
            result = result.replace(/%/g, '%25');
            result = result.replace(/; }/g, ';}');
            result = result.replace(/; }/g, ';}');
            result = result.replace(/</g, '%3c');
            result = result.replace(/>/g, '%3e');
            result = result.replace(/\{/g, '%7b');
            result = result.replace(/\}/g, '%7d');
            result = result.replace(/\|/g, '%7c');
            result = result.replace(/\^/g, '%5e');
            result = result.replace(/`/g, '%60');
            result = result.replace(/@/g, '%40');
                
            result = '"data:image/svg+xml,' + result + '"';

            output.value = result;

            vscode.postMessage({
                command: 'copy_result',
                text: result
            });
        }
    }
};

window.addEventListener('DOMContentLoaded', App.init);