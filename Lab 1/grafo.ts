type Estruturas = "matriz" | "adjascente";

class Grafo {
  private indice: number;
  private name: string;
  protected arestasAdj: Array<Grafo> = new Array<Grafo>();
  protected arestasMat: Array<Array<[Grafo | null, number]>> = new Array<
    Array<[Grafo, number]>
  >();

  constructor(indice: number, name: string) {
    if (indice < 0) {
      throw new Error("Indice não pode ser negativo");
    }
    this.indice = Math.floor(indice);
    this.name = name;

    this.arestasMat = Array.from({ length: indice + 1 }, () =>
      Array.from({ length: indice + 1 }, () => [null, 0])
    );
    this.arestasAdj = new Array<Grafo>();
  }

  public getGrauAdj(): number {
    return this.arestasAdj.length;
  }

  public getGrauMat(): number {
    let grau = 0;
    this.arestasMat.forEach((linha: Array<[Grafo | null, number]>) => {
      linha.forEach((coluna: [Grafo | null, number]) => {
        if (coluna !== null) {
          grau += coluna[1];
        }
      });
    });
    return grau;
  }

  public getGrau(estrutura: Estruturas): number {
    if (estrutura === "matriz") {
      return this.getGrauMat();
    } else {
      return this.getGrauAdj();
    }
  }

  public getArestasMat(): Array<Array<[Grafo | null, number]>> {
    return this.arestasMat;
  }

  public getArestasAdj(): Array<Grafo> {
    return this.arestasAdj;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getIndice(): number {
    return this.indice;
  }

  public setIndice(indice: number): void {
    this.indice = indice;
  }

  private addArestaMatriz(grafo: Grafo): void {
    const aresta = this.arestasMat[this.indice][grafo.getIndice()];
    if (aresta !== null && aresta !== undefined) {
      if (aresta[0] === null) {
        this.arestasMat[this.indice][grafo.getIndice()][0] = grafo;
      }
      this.arestasMat[this.indice][grafo.getIndice()][1] += 1;
      return;
    }
    this.arestasMat[this.indice][grafo.getIndice()] = [grafo, 1];
  }

  private addArestaAdj(grafo: Grafo): void {
    this.arestasAdj.push(grafo);
  }

  public addAresta(grafo: Grafo): void {
    this.addArestaMatriz(grafo);
    this.addArestaAdj(grafo);
  }

  private removeArestaMatriz(grafo: Grafo): void {
    const aresta = this.arestasMat[this.indice][grafo.getIndice()];
    if (aresta !== null && aresta !== undefined) {
      this.arestasMat[this.indice][grafo.getIndice()][1] -= 1;
      if (aresta[1] === 0) {
        this.arestasMat[this.indice][grafo.getIndice()][0] = null;
      }
      return;
    }
  }

  private removeArestaAdj(grafo: Grafo): void {
    const index = this.arestasAdj.indexOf(grafo);
    if (index > -1) {
      this.arestasAdj.splice(index, 1);
    }
  }

  public removeAresta(grafo: Grafo): void {
    this.removeArestaMatriz(grafo);
    this.removeArestaAdj(grafo);
  }

  private hasArestaMatriz(grafo: Grafo): boolean {
    return this.arestasMat[this.indice][grafo.getIndice()][1] !== 0;
  }

  private hasArestaAdj(grafo: Grafo): boolean {
    return this.arestasAdj.includes(grafo);
  }

  public hasAresta(grafo: Grafo): boolean {
    return this.hasArestaMatriz(grafo) && this.hasArestaAdj(grafo);
  }

  public hasArestaUnidirecional(grafo: Grafo): boolean {
    return this.hasAresta(grafo);
  }

  public hasArestaBidirecional(grafo: Grafo): boolean {
    const hasArestaBidirecional: boolean =
      this.hasAresta(grafo) && grafo.hasAresta(this);
    return hasArestaBidirecional;
  }

  public addArestaUnidirecional(grafo: Grafo): void {
    this.addAresta(grafo);
  }

  public addArestaBidirecional(grafo: Grafo): void {
    this.addAresta(grafo);
    grafo.addAresta(this);
  }

  public removeArestaUnidirecional(grafo: Grafo): void {
    this.removeAresta(grafo);
  }

  public removeArestaBidirecional(grafo: Grafo): void {
    this.removeAresta(grafo);
    grafo.removeAresta(this);
  }
}

class Main {
  public addRandomArestas(grafos: Grafo[]): void {
    grafos.forEach((grafo: Grafo) => {
      const randomNumber = Math.random();
      const randomGrafo: Grafo =
        grafos[Math.floor(randomNumber * grafos.length)];
      if (randomNumber > 0.5) {
        grafo.addArestaUnidirecional(randomGrafo);
      } else {
        grafo.addArestaBidirecional(randomGrafo);
      }
    });
  }

  public removeRandomArestas(grafos: Grafo[]): void {
    grafos.forEach((grafo: Grafo) => {
      const randomNumber = Math.random();
      const randomGrafo: Grafo =
        grafos[Math.floor(randomNumber * grafos.length)];
      grafo.removeArestaUnidirecional(randomGrafo);
    });
  }

  public printGrauTotal(estrutura: Estruturas, grafos: Grafo[]): void {
    let grauTotal: number = 0;

    grafos.forEach((grafo: Grafo) => {
      grauTotal += grafo.getGrau(estrutura);
    });

    console.log(`Grau total: ${grauTotal}`);
  }

  public printGrafo(estrutura: Estruturas, grafos: Array<Grafo>): void {
    console.log("Vertices:");
    grafos.forEach((grafo: Grafo) => {
      console.log("\nIndice: ", grafo.getIndice());
      console.log("Nome: ", grafo.getName());
      console.log("Grau: ", grafo.getGrau(estrutura));
      console.log("");
    });
    console.log("Total de Vertices: ", grafos.length);
    this.printTotalArestas(estrutura, grafos);
    this.printGrauTotal(estrutura, grafos);
    this.printAllArestas(estrutura, grafos);
  }

  private printTotalArestas(estrutura: Estruturas, grafos: Grafo[]) {
    let totalArestas: number;
    if (estrutura === "matriz") {
      totalArestas = this.getTotalArestasMat(grafos);
    } else {
      totalArestas = this.getTotalArestasAdj(grafos);
    }
    console.log("Total de Arestas: ", totalArestas);
  }

  private getTotalArestasAdj(grafos: Grafo[]): number {
    let totalArestas = 0;
    grafos.forEach((grafo) => {
      grafo.getArestasAdj().forEach((aresta) => {
        if (aresta.hasArestaUnidirecional(grafo)) {
          totalArestas += 1 / 2;
        } else {
          totalArestas += 1;
        }
      });
    });

    return totalArestas;
  }

  private getTotalArestasMat(grafos: Grafo[]): number {
    let totalArestas = 0;
    grafos.forEach((grafo) => {
      grafo.getArestasMat().forEach((row) => {
        row.forEach((aresta) => {
          if (aresta[0] !== null) {
            for (let i = 0; i < aresta[1]; i++) {
              if (aresta[0].hasArestaUnidirecional(grafo)) {
                totalArestas += 1 / 2;
              } else {
                totalArestas += 1;
              }
            }
          }
        });
      });
    });

    return totalArestas;
  }

  public printArestas(estrutura: Estruturas, grafo: Grafo): void {
    if (estrutura === "matriz") {
      this.printArestasMat(grafo);
    } else {
      this.printArestasAdj(grafo);
    }
  }

  private printArestasAdj(grafo: Grafo): void {
    grafo
      .getArestasAdj()
      .forEach((aresta: Grafo) =>
        console.log(grafo.getName(), " -> ", aresta.getName())
      );
  }

  private printArestasMat(grafo: Grafo): void {
    const matrix: Array<Array<[Grafo | null, number]>> = grafo
      .getArestasMat()
      .map((linha: Array<[Grafo | null, number]>) => {
        return linha.map((coluna: [Grafo | null, number]) => {
          if (coluna[1] !== 0) {
            return coluna;
          }
          return [null, 0];
        });
      });
    console.log(matrix);
  }

  public printAllArestas(estrutura: Estruturas, grafos: Array<Grafo>): void {
    console.log("Arestas: ");
    if (estrutura === "matriz") {
      this.printAllArestasMat(grafos);
    } else {
      this.printAllArestasAdj(grafos);
    }
  }

  private printAllArestasAdj(grafos: Array<Grafo>): void {
    grafos.forEach((grafo: Grafo) => {
      this.printArestasAdj(grafo);
    });
  }

  private printAllArestasMat(grafos: Array<Grafo>): void {
    const mergedMatrix = this.mergeMatrices(grafos);
    const castTupleToNumberMatrix = mergedMatrix.map((row) => {
      return row.map((tuple) => {
        return tuple[1];
      });
    });

    console.log(castTupleToNumberMatrix);
  }

  private mergeMatrices(
    grafos: Array<Grafo>
  ): Array<Array<[Grafo | null, number]>> {
    const mergedMatrix: Array<Array<[Grafo | null, number]>> = [];

    const max = Math.max(
      ...Array.from(grafos).map((grafo: Grafo) => grafo.getIndice())
    );

    for (let i = 0; i <= max; i++) {
      mergedMatrix.push(Array.from({ length: max + 1 }, () => [null, 0]));
    }

    grafos.forEach((grafo: Grafo) => {
      grafo
        .getArestasMat()
        .forEach((linha: Array<[Grafo | null, number]>, rowIndex: number) => {
          linha.forEach((coluna: [Grafo | null, number], colIndex: number) => {
            if (coluna[1] !== 0) {
              mergedMatrix[rowIndex][colIndex] = coluna;
            }
          });
        });
    });

    return mergedMatrix;
  }
}

const main: Main = new Main();

// main.gerarGrafo("matriz");

// main.addRandomArestas();

// main.printAllGrafos();

// main.printGrauTotal();

// main.changeGrafosEstrutura("adjascente");

// main.printAllGrafos();

// main.printGrauTotal();

// main.removeRandomArestas();

// main.changeGrafosEstrutura("matriz");

// main.printAllGrafos();

// main.printGrauTotal();

const v1: Grafo = new Grafo(0, "v1");
const v2: Grafo = new Grafo(1, "v2");
const v3: Grafo = new Grafo(2, "v3");
const v4: Grafo = new Grafo(3, "v4");
const v5: Grafo = new Grafo(4, "v5");

const e1: Grafo = new Grafo(0, "e1");
const e2: Grafo = new Grafo(1, "e2");
const e3: Grafo = new Grafo(2, "e3");
const e4: Grafo = new Grafo(3, "e4");
const e5: Grafo = new Grafo(4, "e5");

v1.addArestaBidirecional(v2);
v2.addArestaBidirecional(v3);
v2.addArestaBidirecional(v4);
v2.addArestaBidirecional(v5);
v2.addArestaBidirecional(v5);
v3.addArestaBidirecional(v3);
v3.addArestaBidirecional(v4);
v4.addArestaBidirecional(v5);

console.log("=====================================");
console.log("======         GRAFO 1         ======");
console.log("=====================================");

main.printGrafo("matriz", new Array(v1, v2, v3, v4, v5));

// e1.addArestaBidirecional(e2);
// e1.addArestaBidirecional(e3);
// e1.addArestaBidirecional(e4);
// e1.addArestaBidirecional(e5);
// e2.addArestaBidirecional(e3);
// e2.addArestaBidirecional(e4);
// e2.addArestaBidirecional(e5);
// e3.addArestaBidirecional(e4);
// e3.addArestaBidirecional(e5);
// e4.addArestaBidirecional(e5);

// console.log("\n=====================================");
// console.log("======         GRAFO 2         ======");
// console.log("=====================================");

// main.printGrafo("adjascente", new Array(e1, e2, e3, e4, e5));
