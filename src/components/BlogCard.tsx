import React, { useState, useEffect, useRef } from 'react';
import Modal from './Modal';
import ReactMarkdown from 'react-markdown';
import { Share2, Copy, Check } from 'lucide-react';

const COPY_FEEDBACK_DURATION = 2000;

const BlogCard = ({ id, title, description, image, author, date, tags = [], content, isOpen = false, onClose }) => {
  const [isModalOpen, setIsModalOpen] = useState(isOpen);
  const [isImageExpanded, setIsImageExpanded] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const copyTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Sync internal state with external prop
  useEffect(() => {
    setIsModalOpen(isOpen);
  }, [isOpen]);

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => {
    setIsModalOpen(false);
    if (onClose) {
      onClose();
    }
  };
  const toggleImageExpand = () => setIsImageExpanded(!isImageExpanded);

  useEffect(() => {
    return () => {
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
    };
  }, []);

  const getBlogUrl = () => {
    const baseUrl = window.location.origin;
    return `${baseUrl}/blog?id=${id}`;
  };

  const handleShare = async () => {
    const blogUrl = getBlogUrl();
    
    if (navigator.share) {
      try {
        await navigator.share({
          title: title,
          text: description,
          url: blogUrl,
        });
      } catch (err) {
        console.error('Error sharing:', err);
      }
    } else {
      // Fallback to copy to clipboard
      handleCopy();
    }
  };

  const handleCopy = async () => {
    const blogUrl = getBlogUrl();
    if (!navigator.clipboard) {
      console.error('Clipboard API not available');
      return;
    }
    
    try {
      await navigator.clipboard.writeText(blogUrl);
      setIsCopied(true);
      if (copyTimeoutRef.current) {
        clearTimeout(copyTimeoutRef.current);
      }
      copyTimeoutRef.current = setTimeout(() => setIsCopied(false), COPY_FEEDBACK_DURATION);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

  return (
    <>
      <div className="glass-card p-6 cursor-pointer" onClick={openModal}>
        <img           src={image}           alt={title}           className="w-full h-auto max-h-48 object-cover mb-4 rounded"         />
        <h2 className="text-xl font-semibold mb-2">{title}</h2>
        <p className="text-muted-foreground mb-2">{description}</p>
        <p className="text-sm text-muted-foreground mb-2">{author} on {new Date(date).toLocaleDateString()}</p>
        <div className="flex flex-wrap gap-2">
          {tags.map((tag, index) => (
            <span key={index} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded shadow-sm">
              {tag}
            </span>
          ))}
        </div>
      </div>

      {isModalOpen && (
        <Modal onClose={closeModal}>
          <div className="overflow-y-auto max-h-[80vh] text-justify p-4">
            <div className="flex justify-between items-start mb-4">
              <h2 className="text-2xl font-bold">#{id}</h2>
              <div className="flex gap-2">
                <button
                  onClick={handleShare}
                  className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                  title="Share blog"
                  aria-label="Share blog"
                >
                  <Share2 className="h-4 w-4" />
                </button>
                <button
                  onClick={handleCopy}
                  className="p-2 rounded-md bg-secondary hover:bg-secondary/80 transition-colors"
                  title={isCopied ? "Copied!" : "Copy link"}
                  aria-label="Copy link"
                >
                  {isCopied ? <Check className="h-4 w-4 text-green-500" /> : <Copy className="h-4 w-4" />}
                </button>
              </div>
            </div>
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
                <span key={index} className="text-xs bg-primary/10 text-primary px-3 py-1 rounded shadow-sm">
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