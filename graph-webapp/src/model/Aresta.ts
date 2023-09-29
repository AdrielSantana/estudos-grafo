import { Grafo } from "./Grafo";

export class Aresta {
  private name: string;
  private peso: number;
  private target: Grafo;

  constructor(name: string, peso: number, target: Grafo) {
    this.name = name;
    this.peso = peso;
    this.target = target;
  }

  public clone(): Aresta {
    const cloneObj = new Aresta(this.name, this.peso, this.target);
    return cloneObj;
  }

  public getName(): string {
    return this.name;
  }

  public setName(name: string): void {
    this.name = name;
  }

  public getPeso(): number {
    return this.peso;
  }

  public setPeso(peso: number): void {
    if (peso < 0) {
      throw new Error('Peso precisa ser positivo!')
    }
    this.peso = peso;
  }

  public getTarget(): Grafo {
    return this.target;
  }

  public setTarget(target: Grafo): void {
    this.target = target;
  }
}
