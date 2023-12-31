import { Aresta } from "./Aresta";
import { Estruturas, Grafo } from "./Grafo";

export class Main {
  public findShortestPath(
    start: Grafo,
    end: Grafo,
    vertices: Grafo[]
  ): {
    nodePath: { node: Grafo; distance: number }[];
    realPath: { node: Grafo; distance: number }[];
  } {
    const nodePath: { node: Grafo; distance: number }[] = [];
    const realPath: { node: Grafo; distance: number }[] = [];

    const distanciaMinima: Record<string, number> = {}; // Usando um objeto simples
    const predecessores: Record<string, Grafo | null> = {}; // Rastreia os predecessores dos vértices

    const visitados = new Set<Grafo>();

    for (const vertice of vertices) {
      distanciaMinima[vertice.getIndice()] = Infinity;
      predecessores[vertice.getIndice()] = null;
    }
    distanciaMinima[start.getIndice()] = 0;

    while (!visitados.has(end)) {
      let verticeAtual: Grafo | null = null;
      let distanciaMinAtual: number = Infinity;

      // Encontra o vértice não visitado com a menor distância mínima.
      for (const vertice of vertices) {
        if (
          !visitados.has(vertice) &&
          distanciaMinima[vertice.getIndice()] < distanciaMinAtual
        ) {
          verticeAtual = vertice;
          distanciaMinAtual = distanciaMinima[vertice.getIndice()];
        }
      }

      if (verticeAtual === null) {
        break; // Não há mais vértices acessíveis
      }

      visitados.add(verticeAtual);
      nodePath.push({ node: verticeAtual, distance: distanciaMinAtual });

      // Atualiza as distâncias mínimas para os vizinhos não visitados.
      for (const aresta of verticeAtual.getArestasAdj()) {
        const vizinho = aresta.getTarget();
        if (!visitados.has(vizinho)) {
          const novaDistancia = distanciaMinAtual + aresta.getPeso();
          if (novaDistancia < distanciaMinima[vizinho.getIndice()]) {
            distanciaMinima[vizinho.getIndice()] = novaDistancia;
            predecessores[vizinho.getIndice()] = verticeAtual;
          }
        }
      }
    }

    // Reconstrua o caminho mínimo.
    let verticeCaminho: Grafo | null = end;
    while (verticeCaminho !== null) {
      realPath.unshift({
        node: verticeCaminho,
        distance: distanciaMinima[verticeCaminho.getIndice()],
      });
      verticeCaminho = predecessores[verticeCaminho.getIndice()];
    }

    let currentDistanceRealPath = 0;
    for (let i = 0; i < realPath.length; i++) {
      realPath[i] = {
        ...realPath[i],
        distance: realPath[i].distance - currentDistanceRealPath,
      };
      currentDistanceRealPath += realPath[i].distance;
    }

    let currentDistanceNodePath = 0;
    for (let i = 0; i < nodePath.length; i++) {
      nodePath[i] = {
        ...nodePath[i],
        distance: nodePath[i].distance - currentDistanceNodePath,
      };
      currentDistanceNodePath += nodePath[i].distance;
    }

    const isNotCaminho =
      !nodePath.map((step) => step.node).includes(start) ||
      !nodePath.map((step) => step.node).includes(end);

    if (isNotCaminho) {
      throw new Error(
        "Não existe um caminho do vértice " +
          start.getName() +
          " ao vértice " +
          end.getName() +
          "!"
      );
    }

    return { nodePath, realPath };
  }

  public getGrauDirecionado(grafos: Grafo[], vertice: Grafo): number {
    const isVerticeInGrafo = grafos.includes(vertice);

    if (!isVerticeInGrafo) {
      throw new Error(
        "O Vertice informado não está no Grafo. Erro ao pegar o Grau"
      );
    }

    let grau: number = vertice.getGrau("adjascente");

    for (const grafo of grafos) {
      if (grafo.hasArestaUnidirecional(vertice)) {
        const arestas = grafo.getArestasMat();

        const aresta = arestas[grafo.getIndice()][vertice.getIndice()];
        if (!aresta[0]) {
          throw new Error(
            "Não foi possível encontrar a aresta. Erro ao pegar o Grau"
          );
        }

        grau += aresta[1];
      }
    }

    return grau;
  }

  public findCaminho(
    x: Grafo,
    v: Grafo
  ): { nodePath: Grafo[]; realPath: Grafo[] } {
    const start = x;
    const end = v;

    const realPath: Grafo[] = [];
    const visitedNodes: Grafo[] = [];
    const nodePath: Grafo[] = [];

    const search = (grafo: Grafo) => {
      nodePath.push(grafo);
      realPath.push(grafo);
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
          const isEdgeAvaiable = !visitedNodes.includes(edge.getTarget());
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
        if (!visitedNodes.includes(edge.getTarget())) {
          search(edge.getTarget());
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
      throw new Error(
        "Não existe um caminho do vértice " +
          start.getName() +
          " ao vértice " +
          end.getName() +
          "!"
      );
    }

    return { nodePath, realPath };
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
          const isEdgeAvaiable = !visitedNodes.includes(edge.getTarget());
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
        if (!visitedNodes.includes(edge.getTarget())) {
          search(edge.getTarget());
          return;
        }
      }

      search(nodePath[newVisitedIndex - 1]);
      return;
    };

    search(start);

    const isNotPasseio = !nodePath.includes(start) || !nodePath.includes(end);

    if (isNotPasseio) {
      throw new Error(
        "Não existe um passeio do vértice " +
          start.getName() +
          " ao vértice " +
          end.getName() +
          "!"
      );
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

  public printPasseio(passeio: Grafo[]): string {
    const isNotPasseio = !this.isPasseio(passeio);
    if (isNotPasseio) {
      throw new Error("A estrutura passada não é um passeio!");
    }

    return passeio
      .map((grafo: Grafo, i) => {
        const nextNode = passeio[i + 1];
        if (!nextNode) {
          return grafo.getName();
        }

        return `${grafo.getName()} (${grafo.getName()}, ${nextNode.getName()})`;
      })
      .join(" -> ");
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
              const aresta = sourceGrafo.getArestasAdj().find((aresta) => {
                aresta.getTarget() === targetGrafo;
              });
              sourceGrafo.removeArestaUnidirecional(aresta as Aresta);
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
                const aresta = arestaAdj.getTarget();
                const arestaAdjClone = aresta.clone();

                if (arestaAdjClone.getIndice() === verticeGrafo.getIndice()) {
                  while (grafo.hasArestaUnidirecional(arestaAdjClone)) {
                    const arestaToRemove = grafo
                      .getArestasAdj()
                      .find((aresta) => {
                        aresta.getTarget() === arestaAdjClone;
                      });
                    grafo.removeArestaUnidirecional(arestaToRemove as Aresta);
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

            sourceGrafoClone.setArestasAdj(new Array<Aresta>());
            targetGrafoClone.setArestasAdj(new Array<Aresta>());

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
                  sourceInSubGrafo.addArestaUnidirecional(
                    new Aresta(
                      `${sourceInSubGrafo.getName()} -> ${targetInSubGrafo.getName()}`,
                      1,
                      targetInSubGrafo
                    )
                  );
                } else {
                  sourceInSubGrafo.addArestaUnidirecional(
                    new Aresta(
                      `${sourceInSubGrafo.getName()} -> ${targetGrafoClone.getName()}`,
                      1,
                      targetGrafoClone
                    )
                  );
                  subGrafo.push(targetGrafoClone);
                }
              } else {
                if (targetInSubGrafo) {
                  sourceGrafoClone.addArestaUnidirecional(
                    new Aresta(
                      `${sourceGrafoClone.getName()} -> ${targetInSubGrafo.getName()}`,
                      1,
                      targetInSubGrafo
                    )
                  );
                  subGrafo.push(sourceGrafoClone);
                } else {
                  sourceGrafoClone.addArestaUnidirecional(
                    new Aresta(
                      `${sourceGrafoClone.getName()} -> ${targetGrafoClone.getName()}`,
                      1,
                      targetGrafoClone
                    )
                  );
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

            verticeClone.setArestasAdj(new Array<Aresta>());
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
              if (vertices.includes(aresta.getTarget().getIndice())) {
                const arestaClone = aresta.getTarget().clone();

                arestaClone.setArestasAdj(new Array<Aresta>());
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
                    verticeInSubGrafo.addArestaUnidirecional(
                      new Aresta(
                        `${verticeInSubGrafo.getName()} -> ${arestaClone.getName()}`,
                        1,
                        arestaClone
                      )
                    );
                  } else {
                    verticeClone.addArestaUnidirecional(
                      new Aresta(
                        `${verticeClone.getName()} -> ${arestaClone.getName()}`,
                        1,
                        arestaClone
                      )
                    );
                    subGrafo.push(arestaClone);
                  }
                } else {
                  if (verticeInSubGrafo) {
                    verticeInSubGrafo.addArestaUnidirecional(
                      new Aresta(
                        `${verticeInSubGrafo.getName()} -> ${arestaClone.getName()}`,
                        1,
                        arestaInSubGrafo
                      )
                    );
                  } else {
                    verticeClone.addArestaUnidirecional(
                      new Aresta(
                        `${verticeClone.getName()} -> ${arestaClone.getName()}`,
                        1,
                        arestaInSubGrafo
                      )
                    );
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

            verticeClone.setArestasAdj(new Array<Aresta>());
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
            sourceGrafo.addArestaUnidirecional(
              new Aresta(
                `${sourceGrafo.getName()} -> ${targetGrafo.getName()}`,
                1,
                targetGrafo
              )
            );
          }
        });

        return subGrafo;
    }
  }

  public isBiPartido(conjuntoX: Grafo[], conjuntoY: Grafo[]): boolean {
    const checkConjunto = (conjunto: Grafo[]) => {
      for (const grafo of conjunto) {
        for (const aresta of grafo.getArestasAdj()) {
          if (conjunto.includes(aresta.getTarget())) {
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
          grafo.addArestaBidirecional(
            new Aresta(`${grafo.getName()} -> ${grafo.getName()}`, 1, grafo)
          );
        }
      });
    } else if (grau % 2 !== 0 && grafos.length % 2 === 0) {
      for (let i = 0; i < grafos.length; i++) {
        const grafo = grafos[i];

        for (let j = 0; j < grau / 2 - 1; j++) {
          grafo.addArestaBidirecional(
            new Aresta(`${grafo.getName()} -> ${grafo.getName()}`, 1, grafo)
          );
        }

        if (i < grafos.length / 2) {
          grafo.addArestaBidirecional(
            new Aresta(
              `${grafo.getName()} -> ${grafos[
                i + grafos.length / 2
              ].getName()}`,
              1,
              grafos[i + grafos.length / 2]
            )
          );
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
          grafo.addArestaBidirecional(
            new Aresta(`${grafo.getName()} -> ${grafo2.getName()}`, 1, grafo2)
          );
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
        grafo.addArestaUnidirecional(
          new Aresta(
            `${grafo.getName()} -> ${randomGrafo.getName()}`,
            Math.floor(Math.random() * 100),
            randomGrafo
          )
        );
      } else {
        grafo.addArestaBidirecional(
          new Aresta(
            `${grafo.getName()} -> ${randomGrafo.getName()}`,
            Math.floor(Math.random() * 100),
            randomGrafo
          )
        );
      }
    });
  }

  public removeRandomArestas(grafos: Grafo[]): void {
    grafos.forEach((grafo: Grafo) => {
      const randomNumber = Math.random();
      const randomGrafo: Grafo =
        grafos[Math.floor(randomNumber * grafos.length)];
      const randomAresta = grafo.getArestasAdj().find((aresta) => {
        aresta.getTarget() === randomGrafo;
      });
      if (randomAresta) {
        grafo.removeArestaUnidirecional(randomAresta);
      }
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
        if (aresta.getTarget().hasArestaUnidirecional(grafo)) {
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
              if (aresta[0].getTarget().hasArestaUnidirecional(grafo)) {
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
      .forEach((aresta: Aresta) =>
        console.log(grafo.getName(), " -> ", aresta.getTarget().getName())
      );
  }

  private printArestasMat(grafo: Grafo): void {
    const matrix: Array<Array<[Aresta | null, number]>> = grafo
      .getArestasMat()
      .map((linha: Array<[Aresta | null, number]>) => {
        return linha.map((coluna: [Aresta | null, number]) => {
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
  ): Array<Array<[Aresta | null, number]>> {
    const mergedMatrix: Array<Array<[Aresta | null, number]>> = [];

    const max = Math.max(
      ...Array.from(grafos).map((grafo: Grafo) => grafo.getIndice())
    );

    for (let i = 0; i <= max; i++) {
      mergedMatrix.push(Array.from({ length: max + 1 }, () => [null, 0]));
    }

    grafos.forEach((grafo: Grafo) => {
      grafo
        .getArestasMat()
        .forEach((linha: Array<[Aresta | null, number]>, rowIndex: number) => {
          linha.forEach((coluna: [Aresta | null, number], colIndex: number) => {
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
          const isEdgeAvaiable = !visitedNodes.includes(edge.getTarget());
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
        if (!visitedNodes.includes(edge.getTarget())) {
          treeEdges.push([grafo, edge.getTarget()]);
          search(edge.getTarget());
          return;
        } else if (
          visitedNodes.includes(edge.getTarget()) &&
          newVisitedIndex - nodePath.indexOf(edge.getTarget()) > 1 &&
          nodePath[newVisitedIndex - 1] !== edge.getTarget()
        ) {
          returnEdges.push([grafo, edge.getTarget()]);
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
          if (aresta.getTarget() == nodeToRemove) {
            grafo.removeArestaUnidirecional(aresta);
          }
        }
      }
    }

    return grafos;
  }
}
