export type Estruturas = "matriz" | "adjascente";

export class Grafo {
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

  public setArestasMat(arestasMat: Array<Array<[Grafo | null, number]>>): void {
    this.arestasMat = arestasMat;
  }

  public setArestasAdj(arestasAdj: Array<Grafo>): void {
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
    if (this.arestasMat[this.indice][grafo.getIndice()] !== undefined) {
      return this.arestasMat[this.indice][grafo.getIndice()][0] === grafo;
    }
    return false
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
