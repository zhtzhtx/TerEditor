import HtmlGenerate from "./html-generate";
import MTreeWalker from "../tree-walker";

class MarkdownRender {
    render(mnode, htmlGenerate) {
        if (!htmlGenerate) {
            htmlGenerate = new HtmlGenerate();
        }
        const walker = new MTreeWalker(mnode);
        let buffer = '';
        let current;
        console.log(walker)
        while (current = walker.next()) {
            if (htmlGenerate[current.mnode.type]) {
                buffer = htmlGenerate[current.mnode.type](buffer, current.mnode, current.close) || '';
            }
        }
        return buffer;
    }
}

export default MarkdownRender