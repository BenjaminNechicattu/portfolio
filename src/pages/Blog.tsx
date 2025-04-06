import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import blogs from '@/data/blogs/blogs';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';

const Blog = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const blogsPerPage = 6;

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

  const reversedBlogs = [...blogs].reverse();

  useEffect(() => {
    const fetchBlogs = async () => {
      const isLocal = window.location.hostname === 'localhost';
      const startIndex = (currentPage - 1) * blogsPerPage;
      const endIndex = startIndex + blogsPerPage;
      const blogsToFetch = reversedBlogs.slice(startIndex, endIndex);

      try {
        const loadedBlogs = await Promise.all(
          blogsToFetch.map(async (fileName) => {
            const url = isLocal 
              ? `/src/data/blogs/${fileName}` 
              : `https://raw.githubusercontent.com/BenjaminNechicattu/portfolio/main/src/data/blogs/${fileName}`;
            const response = await fetch(url);
            if (!response.ok) {
              throw new Error(`Failed to fetch blog: ${fileName}`);
            }
            return response.json();
          })
        );
        setBlogData(loadedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchBlogs();
  }, [currentPage]);

  const paginate = (pageNumber) => {
    if (pageNumber > 0 && pageNumber <= Math.ceil(blogs.length / blogsPerPage)) {
      setCurrentPage(pageNumber);
    }
  };

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
        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground self-center">
              Page {currentPage} of {Math.ceil(blogs.length / blogsPerPage)}
            </span>
            <button
              className="px-4 py-2 bg-gray-200 rounded hover:bg-gray-300"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= Math.ceil(blogs.length / blogsPerPage)}
            >
              Next
            </button>
          </div>
        </div>
        <div className="mt-20 text-center">
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