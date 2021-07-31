var Text;

import FontJSON from "../../../lib/css/font/three/helvetiker_regular.typeface.json";

import {
  TextBufferGeometry,
  MeshBasicMaterial,
  Mesh,
  Font
} from 'three';

Text = class Text {
  constructor(main, texts1 = []) {
    this.main = main;
    this.texts = texts1;
    this.klass = this.constructor.name;
    this.font = new Font(FontJSON);
    this.main.log(this.klass + '()');
  }

  drawText(string, size, position, rotation, color, group) {
    var material, textGeom, textMesh;
    textGeom = new TextBufferGeometry(string, {
      font: this.font,
      size: size,
      height: size * 0.5,
      bevelEnabled: false
    });
    // bevelThickness: bevelThickness
    // bevelSize: bevelSize,
    textGeom.computeBoundingBox();
    material = new MeshBasicMaterial({
      color: color
    });
    textMesh = new Mesh(textGeom, material);
    textMesh.position.x = position[0];
    textMesh.position.y = position[1];
    textMesh.position.z = position[2];
    textMesh.rotation.x = rotation[0];
    textMesh.rotation.y = rotation[1];
    textMesh.rotation.z = rotation[2];
    group.add(textMesh);
    return textMesh;
  }

  // Need to remember what this was coded for
  drawTexts(texts, group) {
    var i, len, size, text, textMesh, textMeshs;
    textMeshs = [];
    for (i = 0, len = texts.length; i < len; i++) {
      text = texts[i];
      size = text.size != null ? text.size : 100;
      textMesh = this.drawText(text.string, size, text.position, text.rotation, text.color, group);
      textMeshs.push(textMesh);
    }
    return textMeshs;
  }

};

export default Text;

//# sourceMappingURL=Text.js.map
