export type ThemeColors = {
  background: string;
  text: string;
  card: string;
  cardText: string;
  gradient: [string, string];
};

export type Theme = {
  name: string;
  colors: ThemeColors;
  icon: string;
}; 