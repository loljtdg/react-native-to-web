const fs = require('fs');
const parser = require('@babel/parser');
const traverse = require('@babel/traverse').default;
const generate = require('@babel/generator').default;
const t = require('@babel/types');

const rn2webMap = {
    "View": "div",
    "ScrollView": "div",
    "TouchableHighlight": 'div',
    "TouchableOpacity": 'div',
    "TouchableWithoutFeedback": 'div',
    "Text": "span",
    "Button": 'button',
    "Image": 'img',
    "TextInput": 'input',
}


const handleFile = async (filePath, outputPath) => {
    const source = fs.readFileSync(filePath, 'utf8')

    let ast = parser.parse(source, {
        sourceType: 'module',
        plugins: [
            // enable jsx and flow syntax
            "jsx",
            "typescript"
            // "flow"
        ]
    })

    let rnLocal2webMap = {};
    let styledComponentsName = '';

    traverse(ast, {
        enter(path) {
            if (path.isImportDeclaration()) {
                // t.isImportDeclaration(path,{source: t.node()})
                // react-native
                if (path.node && path.node.source.value == 'react-native') {

                    const newSpecifiers = path.node.specifiers.filter((specifier) => {
                        const specifierName = specifier && specifier.imported && specifier.imported.name;
                        if (specifier.type == 'ImportSpecifier' && specifierName && rn2webMap[specifierName]) {
                            const rnLocalName = specifier.local.name;
                            rnLocal2webMap[rnLocalName] = rn2webMap[specifierName];
                            return false;
                        }
                        return true;
                    })
                    path.node.specifiers = newSpecifiers
                    // path.remove()
                }

                // styled-components/native
                if (path.node && path.node.source.value == 'styled-components/native') {
                    path.node.source.value = 'styled-components';
                    path.node.specifiers.forEach(specifier => {
                        if (specifier && specifier.type == 'ImportDefaultSpecifier') {
                            styledComponentsName = specifier.local.name;
                        }
                    })
                }
            }
        }
    });
    // console.log('rnNamesArray', rnNamesArray)
    // console.log('styledComponentsName', styledComponentsName)
    traverse(ast, {
        enter(path) {
            if (path.isJSXIdentifier()) {
                const name = path.node.name;
                if (rnLocal2webMap[name]) {
                    path.node.name = rnLocal2webMap[name];
                }
            }

            if (path.isMemberExpression()) {
                if (styledComponentsName && path.node.object && path.node.object && path.node.object.name == styledComponentsName) {
                    const name = path.node.property && path.node.property.name;
                    if (rn2webMap[name]) {
                        path.node.property.name = rn2webMap[name];
                    }
                }
            }
        }
    });

    const output = generate(ast, { /* options */ }, '');


    const writeFileErr = await fs.writeFileSync(outputPath, output.code);
    if (writeFileErr) {
        console.log('output to path:' + outputPath + ' error ', writeFileErr)
    } else {
        console.log('output to path:' + outputPath + ' success')
    }
}

module.exports = {
    handleFile
}