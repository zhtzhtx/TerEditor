import TerEditor from "./src/editor.js";
import { withUndoRedo } from "./src/plugins/undo-redo";
import "./src/styles/index.css";

withUndoRedo(new TerEditor("#root"));
