import { initDevtools } from "@pixi/devtools";
import { Application } from "pixi.js";
import { SceneManager } from "./utils/SceneManager";

(async () => {
  const app: Application = new Application();
  await app.init({
    resizeTo: window,
    backgroundColor: "#c3c3c3",
  });
  app.canvas.style.position = "absolute";
  app.canvas.style.top = "0";
  app.canvas.style.left = "0";

  document.body.appendChild(app.canvas);
  initDevtools({ app });

  new SceneManager(app);
})();
