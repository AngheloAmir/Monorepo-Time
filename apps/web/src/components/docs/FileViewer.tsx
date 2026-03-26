import ReactMarkdown from 'react-markdown';
import type { DocTab } from '../../appstates/docs';
import config from 'config';

export default function FileViewer({ tab }: { tab: DocTab }) {
    const isImage = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'svg'].includes(tab.type.toLowerCase());
    const isPdf = tab.type.toLowerCase() === 'pdf';
    const isMarkdown = tab.type.toLowerCase() === 'md';

    const cleanPath = tab.path.replace(/^\/?docs\//, '');
    const serverBase = config.serverPath.endsWith('/') ? config.serverPath.slice(0, -1) : config.serverPath;
    const staticUrl = `${serverBase}/docs-static/${cleanPath}`;

    if (isMarkdown) {
        return (
            <div className="h-full overflow-y-auto p-8 bg-gray-900 text-gray-200 markdown-body">
                <style>
                    {`
                        .markdown-body {
                            font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Helvetica, Arial, sans-serif;
                            line-height: 1.6;
                            word-wrap: break-word;
                            max-width: 900px;
                            margin: 0 auto;
                        }
                        .markdown-body h1, .markdown-body h2, .markdown-body h3 {
                            margin-top: 24px;
                            margin-bottom: 16px;
                            font-weight: 600;
                            line-height: 1.25;
                            border-bottom: 1px solid #30363d;
                            padding-bottom: 0.3em;
                            color: #fff;
                        }
                        .markdown-body p { margin-bottom: 16px; }
                        .markdown-body code {
                            padding: 0.2em 0.4em;
                            margin: 0;
                            font-size: 85%;
                            background-color: rgba(110, 118, 129, 0.4);
                            border-radius: 6px;
                        }
                        .markdown-body pre {
                            padding: 16px;
                            overflow: auto;
                            font-size: 85%;
                            line-height: 1.45;
                            background-color: #161b22;
                            border-radius: 6px;
                            margin-bottom: 16px;
                        }
                        .markdown-body pre code {
                            background-color: transparent;
                            padding: 0;
                        }
                        .markdown-body ul, .markdown-body ol {
                            padding-left: 2em;
                            margin-bottom: 16px;
                        }
                        .markdown-body a { color: #58a6ff; text-decoration: none; }
                        .markdown-body a:hover { text-decoration: underline; }
                        .markdown-body table {
                            border-spacing: 0;
                            border-collapse: collapse;
                            margin-bottom: 16px;
                            width: 100%;
                        }
                        .markdown-body table th, .markdown-body table td {
                            padding: 6px 13px;
                            border: 1px solid #30363d;
                        }
                        .markdown-body table tr {
                            background-color: #0d1117;
                            border-top: 1px solid #21262d;
                        }
                        .markdown-body blockquote {
                            padding: 0 1em;
                            color: #8b949e;
                            border-left: 0.25em solid #30363d;
                            margin-bottom: 16px;
                        }
                    `}
                </style>
                <ReactMarkdown>{tab.content}</ReactMarkdown>
            </div>
        );
    }

    if (isImage) {
        return (
            <div className="h-full flex flex-col items-center justify-center p-4 bg-black/40">
                <img 
                    src={staticUrl} 
                    alt={tab.title} 
                    className="max-w-full max-h-full object-contain shadow-2xl rounded"
                />
            </div>
        );
    }

    if (isPdf) {
        return (
            <div className="h-full w-full bg-gray-800">
                <iframe 
                    src={staticUrl} 
                    className="w-full h-full border-none"
                    title={tab.title}
                />
            </div>
        );
    }

    return (
        <div className="h-full flex flex-col items-center justify-center gap-4 text-white/40 italic">
            <i className="fa-solid fa-file-circle-exclamation text-4xl mb-2"></i>
            <span>Preview not available for this file type</span>
            <span className="text-xs opacity-50">{tab.path}</span>
        </div>
    );
}
