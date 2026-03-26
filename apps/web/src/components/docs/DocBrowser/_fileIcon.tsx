
export default function FileIcon({ name }: { name: string }) {
    const ext = name.split('.').pop()?.toLowerCase();
    let iconClass = "fa-solid fa-file text-white/40";

    switch (ext) {
        case 'ts':
        case 'tsx':
            iconClass = "fa-solid fa-file-code text-blue-400";
            break;
        case 'js':
        case 'jsx':
            iconClass = "fa-brands fa-js text-yellow-400";
            break;
        case 'json':
            iconClass = "fa-solid fa-file-code text-yellow-200";
            break;
        case 'css':
        case 'scss':
            iconClass = "fa-brands fa-css3 text-blue-300";
            break;
        case 'html':
            iconClass = "fa-brands fa-html5 text-orange-400";
            break;
        case 'md':
            iconClass = "fa-brands fa-markdown text-white/60";
            break;
        case 'png':
        case 'jpg':
        case 'jpeg':
        case 'svg':
            iconClass = "fa-solid fa-image text-purple-400";
            break;
    }

    return <i className={`${iconClass} w-4 text-center`} />;
};
