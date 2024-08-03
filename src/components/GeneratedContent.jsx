import React from 'react';
import Markdown from 'markdown-to-jsx'
function GeneratedContent({ content }) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold">Generated Content</h2>
      <div className="mt-4">
        {content ? (
          <div className="bg-white p-4 rounded-lg shadow">
           <Markdown>{content}</Markdown>
          </div>
        ) : (
          <p>No content generated yet.</p>
        )}
      </div>
    </div>
  );
}

export default GeneratedContent;
