import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import blogs from '@/data/blogs/blogs';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';

const Blog = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);

  const navigateToContact = () => {
    const element = document.getElementById('contact');
    if (element) {
      window.scrollTo({
        top: element.offsetTop - 80,
        behavior: 'smooth',
      });
    } else {
      navigate('/');
      setTimeout(() => {
        const contactElement = document.getElementById('contact');
        if (contactElement) {
          window.scrollTo({
            top: contactElement.offsetTop - 80,
            behavior: 'smooth',
          });
        }
      }, 100);
    }
  };

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
        <div className="flex items-baseline mb-4 space-x-2">
          <button 
            className="text-3xl text-black hover:underline" 
            onClick={() => navigate('/')}
          >
            &larr;
          </button>
          <nav className="text-sm text-muted-foreground">
            <span className="hover:underline cursor-pointer" onClick={() => navigate('/')}>Home</span> / <span>Blog</span>
          </nav>
        </div>
        <h1 className="text-4xl font-bold mb-6">Blog</h1>
        <p className="text-lg text-muted-foreground">
          Hi, If you are seeing this, you probably know me, well, I'm Ben_G. This is where I share my journey, experiences, thoughts and insights.
          I always like to write and share my thoughts with the world. Some might be about my life, some might be about my work.
          For sure it might involve aliens, technology, short stories, Ai and some random stuff.
          I hope you enjoy reading them as much as I enjoyed writing them, hope you find something useful here.
          Feel free to find my <a href="https://medium.com/@benjaminnechicattu" className="text-blue-500 hover:underline">medium account</a>.
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
        <div className="mt-20">
            <p className="text-sm text-muted-foreground mt-4">
            If any content in any of the blog is found offensive or hurtful, please feel free to <span className="text-blue-500 hover:underline cursor-pointer" onClick={navigateToContact}>contact me</span>.
            </p>
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Blog;