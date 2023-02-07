import parse from "html-dom-parser";
import {jsx} from "slate-hyperscript";
import AWS from 'aws-sdk'

// cannot use AWS_ACCESS_KEY_ID or AWS_SECRET_KEY with vercel
const s3 = new AWS.S3({
    accessKeyId: process.env.S3_ACCESS_KEY_ID,
    secretAccessKey: process.env.S3_SECRET_ACCESS_KEY
})

const {Text} = require("slate");
const escapeHtml = require("escape-html");

/**
 * Configures values for better presentation. 
 * Example, 1000.123 can be formatted to 1,000.12
 * 
 * @param val - The number to format
 * @param roundBy - How many digits to round by. Default is 0 (i.e., no decimals)
 * @param dollar - Whether value is US dollars or not (adds $ to value).
 * 
 * @return string representing formatted value.
 */
 export const formatValue = (val: number, roundBy: number = 0, dollar: boolean = false) => {
    // Split dollar and change into two seperate arrays.
    const x = (val.toFixed(roundBy) + '').split('.');
    // Combine and return result.
    return (dollar ? '$' : '') + `${x[0]}`.replace(/\d{1,3}(?=(\d{3})+$)/g, (s) => `${s},`) + (x.length > 1 ? '.' + x[1] : '');
}

/**
 * Finds the year from a date and returns it.
 * E.g., 2020-12-31 becomes 2020
 * 
 * @param {string} str - Date string to be passed
 * @returns - Four digit year as string (e.g., 2020)
 */
export const extractYear = (str: string) => {
    const reg = /^(?:19|20)\d{2}$/
    if (reg.test(str.split('-')[0])) {
        return str.split('-')[0]
    } else if (reg.test(str.split('/')[2])) {
        return str.split('/')[2]
    } else if (reg.test(str.split('/')[1])) {
        return str.split('/')[1]
    }
}

export const getQuarterFromDate = (date?: Date) => {
    if (!date) {
        date = new Date()
    }
    return Math.floor((date.getMonth() + 3) / 3)
}

const deserializeReducer = (acc = [], node: any) => {
    const annotations =
        node.attribs &&
        node.attribs.class &&
        node.attribs.class.split(" ").reduce((classNames: any, className: any) => {
            const [, align] = /align-(left|center|right)/.exec(className) || [];
            if (align) {
                return {...classNames, align};
            }

            const [, indent] = /indent-(\d+)/.exec(className) || [];
            if (indent) {
                return {...classNames, indent: parseInt(indent, 10)};
            }

            const [, lineHeight] = /line-height-(.+)/.exec(className) || [];
            if (lineHeight) {
                return {...classNames, lineHeight: lineHeight.replace("_", ".")};
            }

            const [, fontSize] = /font-size-(\d+)/.exec(className) || [];
            if (fontSize) {
                return {...classNames, fontSize: parseInt(fontSize, 10)};
            }

            if (["bold", "italic", "underline"].includes(className)) {
                return {...classNames, [className]: true};
            }

            return {
                ...classNames,
                annotations: {
                    ...classNames.annotations,
                    [className]: true
                }
            };
        }, {});

    if (!node.name && node.type === "text") {
        return [...acc, {text: node.data.trim()}];
    }

    const children =
        node.children && node.children.length
            ? node.children.reduce(deserializeReducer, [])
            : [{text: ""}];

    switch (node.name) {
        case "html":
        case "body":
        case "div":
            return [...acc, ...children];
        case "ol":
        case "ul":
            return [
                ...acc,
                jsx(
                    "element",
                    {...annotations, type: "bulleted-list"},
                    children.filter((child: any) => child.text !== "")
                )
            ];
        case "li":
            return [
                ...acc,
                jsx("element", {...annotations, type: "list-item"}, children)
            ];
        case "hr":
            return [...acc, jsx("element", {...annotations, type: "hr"}, children)];
        case "a":
            return [
                ...acc,
                jsx(
                    "element",
                    {...annotations, type: "link", url: node.attribs.href},
                    children
                )
            ];
        case "span":
            return [
                ...acc,
                jsx(
                    "fragment",
                    {...annotations},
                    children.map((child: any) => ({...annotations, ...child}))
                )
            ];
        case "h1":
        case "h2":
        case "h3":
        case "h4":
        case "h5":
        case "th":
        case "td":
        case "blockquote":
        case "p":
            return [
                ...acc,
                jsx("element", {...annotations, type: "paragraph"}, children)
            ];
        default:
            return acc;
    }
};

const deserializeHtml = (html = "") => {
    const nodes = parse(html.replace(/\r?\n|\r/g, ""));
    // @ts-ignore
    const deserializedHtml = nodes.reduce(deserializeReducer, []);

    // @ts-ignore
    const patchDeserializedHtml = deserializedHtml.reduce((acc: any, node: any) => {
        // Remove empty text nodes.
        if (!node.type && node.text && !node.text.trim()) {
            return acc;
        }

        // Handle span tags outside of paragraphs.
        if (Array.isArray(node)) {
            // eslint-disable-next-line prefer-destructuring, no-param-reassign
            node = node[0];
        }

        // Handle text outside of paragraphs.
        if (!node.type && typeof node.text !== "undefined") {
            const lastNode = acc[acc.length - 1];
            // Combine node with previous, patched paragraph.
            if (lastNode && lastNode.type === "paragraph" && lastNode.isPatch) {
                return [
                    ...acc.slice(0, -1),
                    {
                        ...lastNode,
                        children: [...lastNode.children, node]
                    }
                ];
            }

            // Create a new patch node by placing it in a paragraph.
            return [...acc, {type: "paragraph", isPatch: true, children: [node]}];
        }

        return [...acc, node];
    }, []);

    return patchDeserializedHtml;
};

export const getSignedUrl = (url: string) => {
    if (!url.includes('litico')) return ''
    let params = { Bucket: 'litico', Key: url.split('.com/')[1], Expires: 300 };
    let signedUrl = s3.getSignedUrl('getObject', params);
    return signedUrl;
};

const serializeReducer = (acc = [], node: any) => {
    const className = Object.entries(node).reduce((classNames: any, [prop, value]: any) => {
        switch (prop) {
            case "align":
                return [...classNames, `align-${value}`];
            case "indent":
                return [...classNames, `indent-${value}`];
            case "lineHeight":
                return [
                    ...classNames,
                    `line-height-${String(value).replace(".", "_")}`
                ];
            case "fontSize":
                return [...classNames, `font-size-${value}`];
            case "bold":
            case "italic":
            case "underline":
                return [...classNames, prop];
            default:
                return classNames;
        }
    }, []);

    const classAttribute = className.length
        ? ` class="${className.join(" ")}"`
        : "";

    if (Text.isText(node)) {
        return classAttribute
            ? `${acc}<span${classAttribute}>${escapeHtml(node.text)}</span>`
            : `${acc}${escapeHtml(node.text)}`;
    }

    const children = node.children.reduce(serializeReducer, "");

    switch (node.type) {
        case "italic":
            return `${acc}<i${classAttribute}>${children}</i>`;
        case "bulleted-list":
            return `${acc}<ul${classAttribute}>${children}</ul>`;
        case "list-item":
            return `${acc}<li${classAttribute}>${children}</li>`;
        case "hr":
            return `${acc}<hr />`;
        case "paragraph":
            return `${acc}<p${classAttribute}>${children}</p>`;
        case "link":
            return `${acc}<a href="${escapeHtml(
                node.url
            )}"${classAttribute}>${children}</a>`;
        default:
            return `${acc}${children}`;
    }
};

const serializeHtml = (nodes: any) => {
    const serializedHtml = nodes.reduce(serializeReducer, "");
    return <div dangerouslySetInnerHTML={{__html: serializedHtml}}></div>;
};

export {deserializeHtml, serializeHtml};
