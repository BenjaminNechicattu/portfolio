import { useState, useEffect } from "react";
import NavBar from '@/components/NavBar';
import blogs from '@/data/blogs/blogs';
import BlogCard from '@/components/BlogCard';

const Blog = () => {
  const [blogData, setBlogData] = useState([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const loadedBlogs = await Promise.all(
        blogs.map(async (fileName) => {
          const response = await fetch(`/src/data/blogs/${fileName}`);
          return response.json();
        })
      );
      setBlogData(loadedBlogs);
    };

    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <NavBar />
      <div className="section-container">
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Welcome to my blog! Here, I share my thoughts, experiences, and insights on technology, software engineering, and more.
        </p>
        <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {blogData.map((blog, index) => (
            <BlogCard
              key={index}
              id={blog.id}
              title={blog.title}
              description={blog.description}
              image={blog.image}
              author={blog.author}
              date={blog.date}
              tags={blog.tags}
              content={blog.content}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;