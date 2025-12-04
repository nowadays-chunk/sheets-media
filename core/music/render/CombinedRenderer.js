// core/music/render/CombinedRenderer.js
import NotationRenderer from "./NotationRenderer";
import TabRenderer from "./TabRenderer";

export default class CombinedRenderer {
  constructor({ container, score, layout }) {
    this.container = container;
    this.score = score;
    this.layout = layout || {};

    this.notationRenderer = new NotationRenderer();
    this.tabRenderer = new TabRenderer();
  }

  render() {
    if (!this.container || !this.score) return;

    this.container.innerHTML = "";

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.gap = "20px";
    wrapper.style.width = "100%";

    this.container.appendChild(wrapper);

    // Notation
    const notationDiv = document.createElement("div");
    wrapper.appendChild(notationDiv);

    // Tab
    const tabDiv = document.createElement("div");
    wrapper.appendChild(tabDiv);

    this.notationRenderer.render(notationDiv, this.score);
    this.tabRenderer.render(tabDiv, this.score);
  }
}
