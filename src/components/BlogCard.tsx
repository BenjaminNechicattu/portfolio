import React, { useState } from 'react';
import Modal from './Modal';

const BlogCard = ({ id, title, description, image, author, date, tags = [], content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  return (
    <>
      <div className="glass-card p-6 cursor-pointer" onClick={openModal}>
        <img src={image} alt={title} className="w-full h-48 object-cover mb-4 rounded" />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-2">{description}</p>
        <p className="text-sm text-muted-foreground mb-2">By {author} on {new Date(date).toLocaleDateString()}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-blue-100 text-gray-800 px-3 py-1 rounded shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="overflow-y-auto max-h-[80vh] text-justify p-4">
            <h2 className="text-2xl font-bold mb-4">#{id}</h2>
            <h2 className="text-2xl font-bold mb-4">{title}</h2>
            <img src={image} alt={title} className="w-full h-64 object-cover mb-4 rounded" />
            <hr className="my-4" />
            <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
            <p><strong>Summary:</strong> {description}</p>
            <hr className="my-4" />
            <p><strong>Content:</strong> {content}</p>
            <hr className="my-4" />
            <p><strong>Author:</strong> {author}</p>
            <br></br>
            <div className="flex flex-wrap gap-2 mb-4">
              {tags.map((tag, index) => (
                <span key={index} className="text-xs bg-blue-100 text-gray-800 px-3 py-1 rounded shadow-sm">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </Modal>
      )}
    </>
  );
};

export default BlogCard;