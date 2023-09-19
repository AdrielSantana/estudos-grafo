export const HELP_DATA: IHelpData[] = [
  {
    title: "Exibição",
    description:
      "Utilize o Menu acima para escolher qual forma quer exibir o Grafo",
  },
  {
    title: "Manipulação",
    description:
      "Clique com o botão direito em cima do Vértice, Aresta ou Plano para exibir as opções.",
  },
];

export interface IHelpData {
  title: string;
  description: string;
}
