import { initDevtools } from "@pixi/devtools";
import { Application } from "pixi.js";
import { MenuContainer } from "./scenes/MenuContainer";
import { LevelContainer } from "./scenes/LevelContainer";

(async () => {
  //application initialization
  const app: Application = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: "#c3c3c3",
  });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);
  initDevtools({ app });

  //menu scene
  const menuContainer: MenuContainer = new MenuContainer();
  menuContainer.initialize(app);

  menuContainer.addEventListener("click", () => {
    console.log("Hello World!");
  });
  app.stage.addChild(menuContainer);

  const levelScene: LevelContainer = new LevelContainer();
  const updateLevel = await levelScene.initialize();

  app.ticker.add((dt) => {
    updateLevel(dt);
  });

  app.stage.addChild(levelScene);
})();
