// core/music/render/CombinedRenderer.js
import NotationRenderer from "./NotationRenderer.js";
import TabRenderer from "./TabRenderer.js";

export default class CombinedRenderer {
  constructor({ container, score, layout }) {
    this.container = container;
    this.score = score;
    this.layout = layout;
  }

  render() {
    if (!this.container) return;        // ✅ FIX: prevent null access

    const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.width = "100%";

    this.container.innerHTML = "";
    this.container.appendChild(wrapper);

    const notationDiv = document.createElement("div");
    wrapper.appendChild(notationDiv);

    const tabDiv = document.createElement("div");
    wrapper.appendChild(tabDiv);

    this.renderNotation(notationDiv);
    this.renderTab(tabDiv);
  }
}
