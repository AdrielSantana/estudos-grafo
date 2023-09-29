import { Aresta } from "./Aresta";

export type Estruturas = "matriz" | "adjascente";

export class Grafo {
  private indice: number;
  private name: string;
  protected arestasAdj: Array<Aresta> = new Array<Aresta>();
  protected arestasMat: Array<Array<[Aresta | null, number]>> = new Array<
    Array<[Aresta, number]>
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
    this.arestasAdj = new Array<Aresta>();
  }

  public setArestasMat(
    arestasMat: Array<Array<[Aresta | null, number]>>
  ): void {
    this.arestasMat = arestasMat;
  }

  public setArestasAdj(arestasAdj: Array<Aresta>): void {
    this.arestasAdj = arestasAdj;
  }

  public clone(): Grafo {
    const grafo = new Grafo(this.indice, this.name);
    grafo.arestasAdj = this.arestasAdj;
    grafo.arestasMat = this.arestasMat;
    return grafo;
  }

  public getGrauAdj(): number {
    return this.arestasAdj.length;
  }

  public getGrauMat(): number {
    let grau = 0;
    this.arestasMat.forEach((linha: Array<[Aresta | null, number]>) => {
      linha.forEach((coluna: [Aresta | null, number]) => {
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

  public getArestasMat(): Array<Array<[Aresta | null, number]>> {
    return this.arestasMat;
  }

  public getArestasAdj(): Array<Aresta> {
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

  private addArestaMatriz(aresta: Aresta): void {
    const arestaMat =
      this.arestasMat[this.indice][aresta.getTarget().getIndice()];
    if (arestaMat !== null && arestaMat !== undefined) {
      if (arestaMat[0] === null) {
        this.arestasMat[this.indice][aresta.getTarget().getIndice()][0] =
          aresta;
      }
      this.arestasMat[this.indice][aresta.getTarget().getIndice()][1] += 1;
      return;
    }
    this.arestasMat[this.indice][aresta.getTarget().getIndice()] = [aresta, 1];
  }

  private addArestaAdj(aresta: Aresta): void {
    this.arestasAdj.push(aresta);
  }

  public addAresta(aresta: Aresta): void {
    this.addArestaMatriz(aresta);
    this.addArestaAdj(aresta);
  }

  private removeArestaMatriz(aresta: Aresta): void {
    const arestaMat =
      this.arestasMat[this.indice][aresta.getTarget().getIndice()];
    if (arestaMat !== null && arestaMat !== undefined) {
      this.arestasMat[this.indice][aresta.getTarget().getIndice()][1] -= 1;
      if (arestaMat[1] === 0) {
        this.arestasMat[this.indice][aresta.getTarget().getIndice()][0] = null;
      }
      return;
    }
  }

  private removeArestaAdj(aresta: Aresta): void {
    const index = this.arestasAdj.indexOf(aresta);
    if (index > -1) {
      this.arestasAdj.splice(index, 1);
    }
  }

  public removeAresta(aresta: Aresta): void {
    this.removeArestaMatriz(aresta);
    this.removeArestaAdj(aresta);
  }

  private hasArestaMatriz(grafo: Grafo): boolean {
    if (this.arestasMat[this.indice][grafo.getIndice()] !== undefined) {
      return (
        this.arestasMat[this.indice][grafo.getIndice()][0]?.getTarget().getIndice() ===
        grafo.getIndice()
      );
    }
    return false;
  }

  private hasArestaAdj(grafo: Grafo): boolean {
    const foundAresta = this.arestasAdj.find((aresta) => {
      return aresta.getTarget().getIndice() === grafo.getIndice();
    });

    return !!foundAresta;
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

  public addArestaUnidirecional(aresta: Aresta): void {
    this.addAresta(aresta);
  }

  public addArestaBidirecional(aresta: Aresta): void {
    const arestaReturn = aresta.clone();
    arestaReturn.setTarget(this);
    this.addAresta(aresta);
    aresta.getTarget().addAresta(arestaReturn);
  }

  public removeArestaUnidirecional(aresta: Aresta): void {
    this.removeAresta(aresta);
  }

  public removeArestaBidirecional(aresta: Aresta): void {
    this.removeAresta(aresta);

    const arestaReturn = aresta
      .getTarget()
      .getArestasAdj()
      .find((aresta) => {
        aresta.getTarget() === this
      });

    if (arestaReturn) {
      aresta.getTarget().removeAresta(arestaReturn);
    }
  }
}
