// core/music/render/CombinedRenderer.js
import NotationRenderer from "./NotationRenderer";
import TabRenderer from "./TabRenderer";

export default class CombinedRenderer {
  constructor({ container, score }) {
    this.container = container;
    this.score = score;

    this.staffDiv = container.querySelector(".notation");
    this.tabDiv   = container.querySelector(".tablature");

    this.notation = new NotationRenderer({
      container: this.staffDiv,
      score
    });

    this.tab = new TabRenderer({
      container: this.tabDiv,
      score
    });
  }

  render() {
    this.notation.render();
    this.tab.render();
  }
}
