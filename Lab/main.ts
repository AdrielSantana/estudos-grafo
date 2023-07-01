import { Estruturas, Grafo } from "./grafo";

export class Main {
    private grafos: Grafo[] = new Array<Grafo>();
  
    public getGrafos(): Grafo[] {
      return this.grafos;
    }
  
    public generateCompleteGrafo(qtd: number, name: string): void {
      const arrayFrom = Array.from(Array(qtd).keys());
  
      const grafos: Grafo[] = arrayFrom.map((index: number) => {
        return new Grafo(index, name + index);
      });
  
      grafos.forEach((grafo: Grafo) => {
        grafos.forEach((grafo2: Grafo) => {
          if (grafo !== grafo2 && !grafo.hasArestaBidirecional(grafo2)) {
            grafo.addArestaBidirecional(grafo2);
          }
        });
      })
  
      this.grafos = grafos;
    }
  
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