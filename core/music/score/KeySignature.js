// core/music/score/KeySignature.js
export default class KeySignature {
  constructor(key = "C") {
    this.key = key; // like "C", "G", "D", "F"
  }

  serialize() {
    return { key: this.key };
  }

  static deserialize(json) {
    return new KeySignature(json.key || "C");
  }

  clone() {
    return new KeySignature(this.key);
  }
}
