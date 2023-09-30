//src/components/GeneratedContent.jsx
import React from 'react';

function GeneratedContent({ content }) {
  return (
    <div className="my-8">
      <h2 className="text-xl font-semibold">Generated Content</h2>
      <div className="mt-4">
        {content && (
          <div className="bg-white p-4 rounded-lg shadow">
            <p>{content}</p>
          </div>
        )}
      </div>
    </div>
  );
}

export default GeneratedContent;
