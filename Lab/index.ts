import { Main } from "./main";
import { Estruturas, Grafo } from "./grafo";

const main: Main = new Main();

console.log('========================')
console.log("= Matriz de Adjacencia =");
console.log('========================')

main.generateKOrderGrafo(5, 4, 'vertice', "matriz")

console.log('\n\n===========================')
console.log("= Estrutura de Adjacencia =");
console.log('===========================')

main.generateKOrderGrafo(4, 3, 'vertice', "matriz")

