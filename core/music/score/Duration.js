export default class Duration {
  constructor(symbol = "q") {
    this.symbol = symbol; // "w","h","q","8","16","32"
  }

  // 🎯 Add a total-beats getter (required by MidiMapper)
  get total() {
    switch (this.symbol) {
      case "w":  return 4;   // whole note
      case "h":  return 2;   // half note
      case "q":  return 1;   // quarter note
      case "8":  return 0.5; // eighth note
      case "16": return 0.25;
      case "32": return 0.125;
      default:   return 1;   // fallback = quarter
    }
  }

  serialize() {
    return { symbol: this.symbol };
  }

  static deserialize(json) {
    if (!json) return new Duration("q");
    return new Duration(json.symbol);
  }

  clone() {
    return new Duration(this.symbol);
  }
}
