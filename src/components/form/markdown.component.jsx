import React from 'react';
import ReactMarkdown from 'react-markdown';
const htmlParser = require('react-markdown/plugins/html-parser')

const parseHtml = htmlParser({
  isValidNode: node => node.type !== 'script',
  processingInstructions: [/* ... */]
});

const Markdown = ({ data }) => {
  return <ReactMarkdown
    source={data}
    escapeHtml={false}
    astPlugins={[parseHtml]}
    className="markdown-view"
  />
}

export default Markdown;