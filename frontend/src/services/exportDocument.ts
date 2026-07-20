import TurndownService from "turndown";

const turndownService = new TurndownService({
    headingStyle: "atx",
    codeBlockStyle: "fenced",
    bulletListMarker: "-",
    emDelimiter: "*",
});

turndownService.addRule("taskListItem", {
    filter: (node: Node): boolean =>
        node.nodeName === "LI" &&
        (node.parentElement as HTMLElement | null)?.getAttribute("data-type") === "taskItem",
    replacement: (content: string, node: Node): string => {
        const checked = (node as HTMLElement).getAttribute("data-checked") === "true";
        return `- [${checked ? "x" : " "}] ${content.trim()}\n`;
    },
});

export function htmlToMarkdown(html: string): string {
    return turndownService.turndown(html);
}

export function createMarkdownFile(html: string, title: string): File {
    const markdown = htmlToMarkdown(html);
    const safeName = title.replace(/[^a-zA-Z0-9]/g, "_") || "document";
    return new File([markdown], `${safeName}.md`, { type: "text/markdown" });
}