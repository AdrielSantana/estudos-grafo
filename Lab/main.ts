import { Estruturas, Grafo } from "./grafo";

export class Main {
  public findCaminho(x: Grafo, v: Grafo): Grafo[] {
    const start = x;
    const end = v;

    const visitedNodes: Grafo[] = [];
    const nodePath: Grafo[] = [];

    const search = (grafo: Grafo) => {
      nodePath.push(grafo);
      const visitedPathIndex = nodePath.indexOf(grafo);
      const isGrafoVisited = visitedNodes.indexOf(grafo) === -1 ? false : true;

      if (!isGrafoVisited) {
        visitedNodes.push(grafo);
      }

      if (grafo === start && visitedPathIndex > 0) {
        nodePath.splice(visitedPathIndex, 1);
      }
      
      const isGrafoEnd = grafo === end;

      if (isGrafoEnd) {
        return;
      }
        
      const edges = grafo.getArestasAdj();

      if (visitedPathIndex === 0) {
        const areEdgesAvaiable: boolean[] = [];
        for (const edge of edges) {
          const isEdgeAvaiable = !visitedNodes.includes(edge);
          areEdgesAvaiable.push(isEdgeAvaiable);
        }

        let everyEdgeIsNotAvaiable = true;

        for (const edge of areEdgesAvaiable) {
          if (edge == true) {
            everyEdgeIsNotAvaiable = false;
            break;
          }
        }

        if (everyEdgeIsNotAvaiable) {
          return;
        }
      }

      const newVisitedIndex = nodePath.indexOf(grafo);

      for (const edge of edges) {
        if (!visitedNodes.includes(edge)) {
          search(edge);
          return;
        }
      }

      nodePath.splice(newVisitedIndex, 1);
      search(nodePath[newVisitedIndex - 1]);
      return;
    };

    search(start);

    const isNotCaminho = !nodePath.includes(start) || !nodePath.includes(end);

    if (isNotCaminho) {
      throw new Error("Não existe um caminho do vértice " + start.getName() + " ao vértice " + end.getName() + "!");
    }

    return nodePath;
  }

  public findPasseio(x: Grafo, v: Grafo): Grafo[] {
    const start = x;
    const end = v;

    const visitedNodes: Grafo[] = [];
    const nodePath: Grafo[] = [];

    const search = (grafo: Grafo) => {
      nodePath.push(grafo);
      const visitedPathIndex = nodePath.indexOf(grafo);
      const isGrafoVisited = visitedNodes.indexOf(grafo) === -1 ? false : true;

      if (!isGrafoVisited) {
        visitedNodes.push(grafo);
      }

      const edges = grafo.getArestasAdj();

      if (visitedPathIndex === 0) {
        const areEdgesAvaiable: boolean[] = [];
        for (const edge of edges) {
          const isEdgeAvaiable = !visitedNodes.includes(edge);
          areEdgesAvaiable.push(isEdgeAvaiable);
        }

        let everyEdgeIsNotAvaiable = true;

        for (const edge of areEdgesAvaiable) {
          if (edge == true) {
            everyEdgeIsNotAvaiable = false;
            break;
          }
        }

        if (everyEdgeIsNotAvaiable) {
          return;
        }
      }

      const newVisitedIndex = nodePath.indexOf(grafo);

      for (const edge of edges) {
        if (!visitedNodes.includes(edge)) {
          search(edge);
          return;
        }
      }

      search(nodePath[newVisitedIndex - 1]);
      return;
    };

    search(start);

    const isNotPasseio = !nodePath.includes(start) || !nodePath.includes(end);

    if (isNotPasseio) {
      throw new Error("Não existe um passeio do vértice " + start.getName() + " ao vértice " + end.getName() + "!");
    }

    const passeioToPrint: Grafo[] = [];

    for (let i = 0; i < nodePath.length; i++) {
      if (nodePath[i] === end) {
        passeioToPrint.push(nodePath[i]);
        break;
      }

      passeioToPrint.push(nodePath[i]);
    }

    return passeioToPrint;
  }

  public isPasseio(passeio: Grafo[]): boolean {
    if (passeio.length < 1) {
      return false;
    }

    for (let i = 0; i < passeio.length - 1; i++) {
      const grafo = passeio[i];
      const nextGrafo = passeio[i + 1];

      if (!grafo.hasArestaUnidirecional(nextGrafo)) {
        return false;
      }
    }

    return true;
  }

  public printReversePasseio(passeio: Grafo[]): void {
    const reversedPasseio = passeio.reverse();

    this.printPasseio(reversedPasseio);
  }

  public printPasseioSegment(passeio: Grafo[], i: number, j: number) {
    const passeioSegment = passeio.slice(i, j + 1);

    this.printPasseio(passeioSegment);
  }

  public printPasseio(passeio: Grafo[]): void {
    const isNotPasseio = !this.isPasseio(passeio);
    if (isNotPasseio) {
      throw new Error("A estrutura passada não é um passeio!");
    }

    console.log(
      passeio
        .map((grafo: Grafo, i) => {
          const nextNode = passeio[i + 1];
          if (!nextNode) {
            return grafo.getName();
          }

          return `${grafo.getName()} (${grafo.getName()}, ${nextNode.getName()})`;
        })
        .join(" -> ")
    );
  }

  public getSubtractGrafo(
    {
      grafos,
      arestas,
      vertices,
    }: {
      grafos: Grafo[];
      arestas: [source: number, target: number][];
      vertices: number[];
    },
    inducao: "aresta" | "vertice"
  ): Grafo[] {
    const subGrafo: Grafo[] = [];

    switch (inducao) {
      case "aresta":
        for (const grafo of grafos) {
          const grafoClone = grafo.clone();
          subGrafo.push(grafoClone);
        }

        arestas.forEach(([source, target]) => {
          const sourceGrafo = grafos.find(
            (grafo) => grafo.getIndice() === source
          );
          const targetGrafo = grafos.find(
            (grafo) => grafo.getIndice() === target
          );

          if (sourceGrafo && targetGrafo) {
            if (sourceGrafo.hasArestaUnidirecional(targetGrafo)) {
              sourceGrafo.removeArestaUnidirecional(targetGrafo);
            }
          }
        });

        return subGrafo;
      case "vertice":
        for (const grafo of grafos) {
          const grafoClone = grafo.clone();
          subGrafo.push(grafoClone);
        }

        vertices.forEach((vertice) => {
          const verticeGrafo = grafos.find(
            (grafo) => grafo.getIndice() === vertice
          );

          if (verticeGrafo) {
            subGrafo.forEach((grafo) => {
              const arestasAdj = grafo.getArestasAdj();

              arestasAdj.forEach((arestaAdj) => {
                const arestaAdjClone = arestaAdj.clone();

                if (arestaAdjClone.getIndice() === verticeGrafo.getIndice()) {
                  while (grafo.hasArestaUnidirecional(arestaAdjClone)) {
                    grafo.removeArestaUnidirecional(arestaAdjClone);
                  }
                }
              });
            });

            const verticeToBeRemoved = subGrafo.find(
              (grafo) => grafo.getIndice() === verticeGrafo.getIndice()
            );

            if (verticeToBeRemoved) {
              subGrafo.splice(subGrafo.indexOf(verticeToBeRemoved), 1);
            }
          }
        });

        return subGrafo;
      default:
        return subGrafo;
    }
  }

  public getSubGrafo(
    {
      grafos,
      arestas,
      vertices,
    }: {
      grafos: Grafo[];
      arestas: [source: number, target: number][];
      vertices: number[];
    },
    inducao?: "aresta" | "vertice"
  ): Grafo[] {
    const subGrafo: Grafo[] = [];

    switch (inducao) {
      case "aresta":
        arestas.forEach(([source, target]) => {
          const sourceGrafo = grafos.find(
            (grafo) => grafo.getIndice() === source
          );
          const targetGrafo = grafos.find(
            (grafo) => grafo.getIndice() === target
          );

          if (sourceGrafo && targetGrafo) {
            const sourceGrafoClone = sourceGrafo.clone();
            const targetGrafoClone = targetGrafo.clone();

            sourceGrafoClone.setArestasAdj(new Array<Grafo>());
            targetGrafoClone.setArestasAdj(new Array<Grafo>());

            sourceGrafoClone.setArestasMat(
              Array.from({ length: sourceGrafoClone.getIndice() + 1 }, () =>
                Array.from({ length: sourceGrafoClone.getIndice() + 1 }, () => [
                  null,
                  0,
                ])
              )
            );
            targetGrafoClone.setArestasMat(
              Array.from({ length: targetGrafoClone.getIndice() + 1 }, () =>
                Array.from({ length: targetGrafoClone.getIndice() + 1 }, () => [
                  null,
                  0,
                ])
              )
            );

            if (sourceGrafo.hasArestaUnidirecional(targetGrafo)) {
              const sourceInSubGrafo = subGrafo.find(
                (grafo) => grafo.getIndice() === sourceGrafoClone.getIndice()
              );

              const targetInSubGrafo = subGrafo.find(
                (grafo) => grafo.getIndice() === targetGrafoClone.getIndice()
              );

              if (sourceInSubGrafo) {
                if (targetInSubGrafo) {
                  sourceInSubGrafo.addArestaUnidirecional(targetInSubGrafo);
                } else {
                  sourceInSubGrafo.addArestaUnidirecional(targetGrafoClone);
                  subGrafo.push(targetGrafoClone);
                }
              } else {
                if (targetInSubGrafo) {
                  sourceGrafoClone.addArestaUnidirecional(targetInSubGrafo);
                  subGrafo.push(sourceGrafoClone);
                } else {
                  sourceGrafoClone.addArestaUnidirecional(targetGrafoClone);
                  subGrafo.push(sourceGrafoClone);
                  subGrafo.push(targetGrafoClone);
                }
              }
            }
          }
        });

        return subGrafo;
      case "vertice":
        vertices.forEach((indice) => {
          const vertice = grafos.find((grafo) => grafo.getIndice() === indice);

          if (vertice) {
            const verticeClone = vertice.clone();

            const arestas = vertice.getArestasAdj();

            verticeClone.setArestasAdj(new Array<Grafo>());
            verticeClone.setArestasMat(
              Array.from({ length: verticeClone.getIndice() + 1 }, () =>
                Array.from({ length: verticeClone.getIndice() + 1 }, () => [
                  null,
                  0,
                ])
              )
            );

            const verticeInSubGrafo = subGrafo.find(
              (grafo) => grafo.getIndice() === verticeClone.getIndice()
            );

            arestas.forEach((aresta) => {
              if (vertices.includes(aresta.getIndice())) {
                const arestaClone = aresta.clone();

                arestaClone.setArestasAdj(new Array<Grafo>());
                arestaClone.setArestasMat(
                  Array.from({ length: arestaClone.getIndice() + 1 }, () =>
                    Array.from({ length: arestaClone.getIndice() + 1 }, () => [
                      null,
                      0,
                    ])
                  )
                );

                const arestaInSubGrafo = subGrafo.find(
                  (grafo) => grafo.getIndice() === arestaClone.getIndice()
                );

                if (!arestaInSubGrafo) {
                  if (verticeInSubGrafo) {
                    verticeInSubGrafo.addArestaUnidirecional(arestaClone);
                  } else {
                    verticeClone.addArestaUnidirecional(arestaClone);
                    subGrafo.push(arestaClone);
                  }
                } else {
                  if (verticeInSubGrafo) {
                    verticeInSubGrafo.addArestaUnidirecional(arestaInSubGrafo);
                  } else {
                    verticeClone.addArestaUnidirecional(arestaInSubGrafo);
                  }
                }
              }
            });

            if (!verticeInSubGrafo) {
              subGrafo.push(verticeClone);
            }
          }
        });

        return subGrafo;
      default:
        vertices.forEach((indice) => {
          const vertice = grafos.find((grafo) => grafo.getIndice() === indice);

          if (vertice) {
            const verticeClone = vertice.clone();

            verticeClone.setArestasAdj(new Array<Grafo>());
            verticeClone.setArestasMat(
              Array.from({ length: verticeClone.getIndice() + 1 }, () =>
                Array.from({ length: verticeClone.getIndice() + 1 }, () => [
                  null,
                  0,
                ])
              )
            );

            const verticeInSubGrafo = subGrafo.find(
              (grafo) => grafo.getIndice() === verticeClone.getIndice()
            );

            if (!verticeInSubGrafo) {
              subGrafo.push(verticeClone);
            }
          }
        });

        arestas.forEach(([source, target]) => {
          const sourceGrafo = subGrafo.find(
            (grafo) => grafo.getIndice() === source
          );

          const targetGrafo = subGrafo.find(
            (grafo) => grafo.getIndice() === target
          );

          if (sourceGrafo && targetGrafo) {
            sourceGrafo.addArestaUnidirecional(targetGrafo);
          }
        });

        return subGrafo;
    }
  }

  public isBiPartido(conjuntoX: Grafo[], conjuntoY: Grafo[]): boolean {
    const checkConjunto = (conjunto: Grafo[]) => {
      for (const grafo of conjunto) {
        for (const aresta of grafo.getArestasAdj()) {
          if (conjunto.includes(aresta)) {
            return false;
          }
        }
      }
      return true;
    };

    const isConjuntoX = checkConjunto(conjuntoX);
    const isConjuntoY = checkConjunto(conjuntoY);

    return isConjuntoX && isConjuntoY;
  }

  public generateKOrderGrafo(
    qtdVertices: number,
    grau: number,
    name: string
  ): Grafo[] {
    const arrayFrom = Array.from(Array(qtdVertices).keys());

    const grafos: Grafo[] = arrayFrom.map((index: number) => {
      return new Grafo(index, name + index);
    });

    if (grau % 2 === 0) {
      grafos.forEach((grafo) => {
        for (let i = 0; i < grau / 2; i++) {
          grafo.addArestaBidirecional(grafo);
        }
      });
    } else if (grau % 2 !== 0 && grafos.length % 2 === 0) {
      for (let i = 0; i < grafos.length; i++) {
        const grafo = grafos[i];

        for (let j = 0; j < grau / 2 - 1; j++) {
          grafo.addArestaBidirecional(grafo);
        }

        if (i < grafos.length / 2) {
          grafo.addArestaBidirecional(grafos[i + grafos.length / 2]);
        }
      }
    } else {
      throw new Error(
        `⚠️ Não é possível criar um grafo K-Regular com ${qtdVertices} vertices com valor K = ${grau}⚠️`
      );
    }

    return grafos;
  }

  public generateCompleteGrafo(qtdVertices: number, name: string): Grafo[] {
    const arrayFrom = Array.from(Array(qtdVertices).keys());

    const grafos: Grafo[] = arrayFrom.map((index: number) => {
      return new Grafo(index, name + index);
    });

    grafos.forEach((grafo: Grafo) => {
      grafos.forEach((grafo2: Grafo) => {
        if (grafo !== grafo2 && !grafo.hasArestaBidirecional(grafo2)) {
          grafo.addArestaBidirecional(grafo2);
        }
      });
    });

    return grafos;
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
    const grafosImpares = grafos.filter((grafo: Grafo) => {
      return grafo.getGrau(estrutura) % 2 !== 0;
    });

    const grafosPares = grafos.filter((grafo: Grafo) => {
      return grafo.getGrau(estrutura) % 2 === 0;
    });

    console.log("\nVertices Impares:");
    grafosImpares.forEach((grafo: Grafo) => {
      console.log("\nIndice: ", grafo.getIndice());
      console.log("Nome: ", grafo.getName());
      console.log("Grau: ", grafo.getGrau(estrutura));
      console.log("");
    });
    console.log("\nVertices Pares:");
    grafosPares.forEach((grafo: Grafo) => {
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

  public depthSearch(root: Grafo): Grafo[] {
    const visitedNodes: Grafo[] = [];
    const nodePath: Grafo[] = [];

    const returnEdges: [Grafo, Grafo][] = [];
    const treeEdges: [Grafo, Grafo][] = [];

    let PECounter = 1;
    let PSCounter = 1;
    const PE: [Grafo, number][] = [];
    const PS: [Grafo, number][] = [];

    const search = (grafo: Grafo) => {
      nodePath.push(grafo);
      const visitedPathIndex = nodePath.indexOf(grafo);
      const isGrafoVisited = visitedNodes.indexOf(grafo) === -1 ? false : true;

      if (!isGrafoVisited) {
        visitedNodes.push(grafo);
        PE.push([grafo, PECounter++]);
      }

      const edges = grafo.getArestasAdj();

      if (visitedPathIndex === 0) {
        const areEdgesAvaiable: boolean[] = [];
        for (const edge of edges) {
          const isEdgeAvaiable = !visitedNodes.includes(edge);
          areEdgesAvaiable.push(isEdgeAvaiable);
        }

        let everyEdgeIsNotAvaiable = true;

        for (const edge of areEdgesAvaiable) {
          if (edge == true) {
            everyEdgeIsNotAvaiable = false;
            break;
          }
        }

        if (everyEdgeIsNotAvaiable) {
          return;
        }
      }

      const newVisitedIndex = nodePath.indexOf(grafo);

      for (const edge of edges) {
        if (!visitedNodes.includes(edge)) {
          treeEdges.push([grafo, edge]);
          search(edge);
          return;
        } else if (
          visitedNodes.includes(edge) &&
          newVisitedIndex - nodePath.indexOf(edge) > 1 &&
          nodePath[newVisitedIndex - 1] !== edge
        ) {
          returnEdges.push([grafo, edge]);
        }
      }

      PS.push([grafo, PSCounter++]);
      search(nodePath[newVisitedIndex - 1]);
      return;
    };

    search(root);

    console.log(
      "Caminho: ",
      nodePath
        .map((node) => {
          return node.getName();
        })
        .join(" -> ")
    );

    console.log(
      "\n\nArestas de RETORNO:\n",
      returnEdges
        .map(([source, target]) => {
          return `${source.getName()} -> ${target.getName()}`;
        })
        .join("\n")
    );

    console.log(
      "\n\nArestas de ARVORE:\n",
      treeEdges
        .map(([source, target]) => {
          return `${source.getName()} -> ${target.getName()}`;
        })
        .join("\n")
    );

    console.log(
      "\n\nPE:\n",
      PE.map(([grafo, valor]) => {
        return `${grafo.getName()} = ${valor}`;
      }).join("\n")
    );

    console.log(
      "\n\nPS:\n",
      PS.map(([grafo, valor]) => {
        return `${grafo.getName()} = ${valor}`;
      }).join("\n")
    );

    return visitedNodes;
  }

  public completeRemoveNodeFromGraph(
    nodeToRemove: Grafo,
    grafos: Grafo[]
  ): Grafo[] {
    const verticeId = grafos.indexOf(nodeToRemove);
    grafos.splice(verticeId, 1);
    for (const grafo of grafos) {
      if (grafo.hasArestaUnidirecional(nodeToRemove)) {
        const arestas = [...grafo.getArestasAdj()];
        console.log(arestas);
        for (const aresta of arestas) {
          if (aresta == nodeToRemove) {
            grafo.removeArestaUnidirecional(nodeToRemove);
          }
        }
      }
    }

    return grafos;
  }
}
