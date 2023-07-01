import { Main } from "./main";
import { Estruturas, Grafo } from "./grafo";

const main: Main = new Main();

main.generateCompleteGrafo(4, 'vertice')

console.log('========================')
console.log("= Matriz de Adjacencia =");
console.log('========================')

main.printGrafo("matriz", main.getGrafos());

console.log('\n\n===========================')
console.log("= Estrutura de Adjacencia =");
console.log('===========================')

main.printGrafo("adjascente", main.getGrafos());