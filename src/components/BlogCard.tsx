import React, { useState } from 'react';
import Modal from './Modal';
import ReactMarkdown from 'react-markdown';

const BlogCard = ({ id, title, description, image, author, date, tags = [], content }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isImageExpanded, setIsImageExpanded] = useState(false);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);
  const toggleImageExpand = () => setIsImageExpanded(!isImageExpanded);

  return (
    <>
      <div className="glass-card p-6 cursor-pointer" onClick={openModal}>
        <img           src={image}           alt={title}           className="w-full h-auto max-h-48 object-cover mb-4 rounded"         />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-2">{description}</p>
        <p className="text-sm text-muted-foreground mb-2">{author} on {new Date(date).toLocaleDateString()}</p>
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
            <img 
              src={image} 
              alt={title} 
              className={`w-full h-auto ${isImageExpanded ? 'max-h-screen' : 'max-h-80'} object-cover mb-4 rounded cursor-pointer`} 
              onClick={toggleImageExpand} 
            />
            <hr className="my-4" />
            <p><strong>Date:</strong> {new Date(date).toLocaleDateString()}</p>
            <p><strong>Summary:</strong> {description}</p>
            <hr className="my-4" />
            
            <ReactMarkdown>{content}</ReactMarkdown>
            <hr className="my-4" />
            <p>{author}</p>
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