import NotationRenderer from "./NotationRenderer";
import TabRenderer from "./TabRenderer";

export default class CombinedRenderer {
  constructor({ notationContainer, tabContainer, score, selection }) {
    this.notationContainer = notationContainer;
    this.tabContainer = tabContainer;
    this.score = score;
    this.selection = selection;
  }

  render() {
    if (!this.score) return;

    this.notationContainer.innerHTML = "";
    this.tabContainer.innerHTML = "";

    new NotationRenderer({
      container: this.notationContainer,
      score: this.score,
      selection: this.selection,
    }).render();

    new TabRenderer({
      container: this.tabContainer,
      score: this.score,
      selection: this.selection,
    }).render();
  }
}
