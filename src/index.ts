import { Application, Text, TextStyle } from "pixi.js";

(async () => {
  const app: Application = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: "#c3c3c3",
  });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);

  //text
  const style: TextStyle = new TextStyle({
    dropShadow: true,
    fill: "#ffffff",
    fontFamily: "Courier New",
    fontSize: 42,
    fontVariant: "small-caps",
    fontWeight: "bolder",
    padding: 30,
  });
  const startGameText: Text = new Text({ text: "Start Game", style: style });
  startGameText.x = app.canvas.width / 2 - startGameText.width / 2;
  startGameText.y = app.canvas.height / 2 - startGameText.height / 2;
  startGameText.eventMode = "static";
  startGameText.cursor = "poiner";
  app.stage.addChild(startGameText);
})();
