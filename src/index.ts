import { Application } from "pixi.js";
import { MenuContainer } from "./scenes/MenuContainer";

(async () => {
  //application initialization
  const app: Application = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: "#c3c3c3",
  });
  app.canvas.style.position = "absolute";
  document.body.appendChild(app.canvas);

  //menu scene
  const menuContainer: MenuContainer = new MenuContainer();
  menuContainer.initialize(app);

  menuContainer.addEventListener("click", () => {
    console.log("Hello World!");
  });

  app.stage.addChild(menuContainer);
})();
