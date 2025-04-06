import React from 'react';

const BlogCard = ({ title, description, image, author, date, tags = [] }) => {
  return (
    <div className="glass-card p-6">
      <img src={image} alt={title} className="w-full h-48 object-cover mb-4 rounded" />
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-muted-foreground mb-2">{description}</p>
      <p className="text-sm text-muted-foreground mb-2">By {author} on {new Date(date).toLocaleDateString()}</p>
      <div className="flex flex-wrap gap-2">
        {tags.map((tag, index) => (
          <span key={index} className="text-xs bg-gray-200 text-gray-800 px-2 py-1 rounded">
            {tag}
          </span>
        ))}
      </div>
    </div>
  );
};

export default BlogCard;