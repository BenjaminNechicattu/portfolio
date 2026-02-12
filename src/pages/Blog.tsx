import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import { BLOG_COUNT_URL, getBlogUrl } from '@/data/blogs/blogs';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import ForestElements from '@/components/ForestElements';
import FlyingInsects from '@/components/FlyingInsects';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BLOG_ID_PARAM } from '@/constants/blog';
import { useCustomTheme } from '@/contexts/CustomThemeContext';

const Blog = () => {
  const { customTheme } = useCustomTheme();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [blogData, setBlogData] = useState<any[]>([]);
  const [totalBlogs, setTotalBlogs] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [blogsPerPage, setBlogsPerPage] = useState(9);
  const [selectedBlogId, setSelectedBlogId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  // Fetch total blog count on mount
  useEffect(() => {
    const fetchTotalCount = async () => {
      const isLocal = window.location.hostname === 'localhost';
      const countUrl = isLocal ? BLOG_COUNT_URL.local : BLOG_COUNT_URL.remote;
      
      try {
        const response = await fetch(countUrl);
        if (!response.ok) {
          throw new Error('Failed to fetch blog count');
        }
        const countText = await response.text();
        const count = parseInt(countText.trim(), 10);
        if (isNaN(count)) {
          throw new Error('Invalid blog count');
        }
        setTotalBlogs(count);
      } catch (error) {
        console.error('Error fetching blog count:', error);
        setError('Failed to load blog count');
      }
    };

    fetchTotalCount();
  }, []);

  // Fetch blogs for current page
  useEffect(() => {
    if (totalBlogs === 0) return;

    const fetchBlogsForPage = async () => {
      setIsLoading(true);
      setError(null);
      const isLocal = window.location.hostname === 'localhost';
      
      try {
        // Calculate which blogs to fetch (newest first, so higher numbers first)
        const startIndex = (currentPage - 1) * blogsPerPage;
        const endIndex = Math.min(startIndex + blogsPerPage, totalBlogs);
        
        // Blog IDs from highest to lowest (newest to oldest)
        const blogIdsToFetch = [];
        for (let i = totalBlogs - startIndex; i > totalBlogs - endIndex; i--) {
          blogIdsToFetch.push(i);
        }
        
        // Fetch blogs in parallel
        const fetchedBlogs = await Promise.all(
          blogIdsToFetch.map(async (blogId) => {
            try {
              const url = getBlogUrl(blogId, isLocal);
              const response = await fetch(url);
              if (!response.ok) {
                console.error(`Failed to fetch blog ${blogId}`);
                return null;
              }
              return await response.json();
            } catch (error) {
              console.error(`Error fetching blog ${blogId}:`, error);
              return null;
            }
          })
        );
        
        // Filter out failed fetches
        const successfulBlogs = fetchedBlogs.filter(blog => blog !== null);
        setBlogData(successfulBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setError('Failed to load blogs');
      } finally {
        setIsLoading(false);
      }
    };

    fetchBlogsForPage();
  }, [totalBlogs, currentPage, blogsPerPage]);

  // Handle URL parameter to open specific blog modal
  useEffect(() => {
    const blogIdParam = searchParams.get(BLOG_ID_PARAM);
    if (blogIdParam && totalBlogs > 0) {
      const blogId = parseInt(blogIdParam, 10);
      if (!isNaN(blogId) && blogId > 0 && blogId <= totalBlogs) {
        setSelectedBlogId(blogId);
        
        // Calculate which page the blog is on (newest first)
        // Blog IDs go from 1 to totalBlogs, newest (highest ID) shows first
        const blogPosition = totalBlogs - blogId; // Position from start (0-indexed)
        const pageNumber = Math.floor(blogPosition / blogsPerPage) + 1;
        setCurrentPage(pageNumber);
      }
    }
  }, [searchParams, totalBlogs, blogsPerPage]);

  const paginate = (pageNumber: number) => {
    const totalPages = Math.ceil(totalBlogs / blogsPerPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleItemsPerPageChange = (value: string) => {
    setBlogsPerPage(Number(value));
    setCurrentPage(1);
  };

  const handleModalClose = () => {
    setSelectedBlogId(null);
    searchParams.delete(BLOG_ID_PARAM);
    setSearchParams(searchParams);
  };

  const totalPages = Math.ceil(totalBlogs / blogsPerPage);

  return (
    <div className="min-h-screen bg-background text-foreground">
      {customTheme === 'nature' && (
        <>
          <ForestElements />
          <FlyingInsects />
        </>
      )}
      <NavBar />
      <div className="section-container">
        <div className="flex items-baseline mb-4 space-x-2">
          <button 
            className="text-3xl text-foreground hover:underline" 
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
        
        {/* Controls */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="text-sm text-muted-foreground">
            Showing {totalBlogs > 0 ? (currentPage - 1) * blogsPerPage + 1 : 0} - {Math.min(currentPage * blogsPerPage, totalBlogs)} of {totalBlogs} blogs
          </div>
          <div className="w-full md:w-40">
            <Select value={blogsPerPage.toString()} onValueChange={handleItemsPerPageChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Items per page" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="6">6 per page</SelectItem>
                <SelectItem value="9">9 per page</SelectItem>
                <SelectItem value="12">12 per page</SelectItem>
                <SelectItem value="18">18 per page</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {error && (
          <div className="mt-8 p-4 bg-destructive/10 text-destructive rounded">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="mt-8 text-center">
            <p className="text-muted-foreground">Loading blogs...</p>
          </div>
        ) : (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {blogData.map((blog) => (
              <BlogCard
                key={blog.id}
                id={blog.id}
                title={blog.title}
                description={blog.description}
                image={blog.image}
                author={blog.author}
                date={blog.date}
                tags={blog.tags}
                content={blog.content}
                isOpen={selectedBlogId === blog.id}
                onClose={handleModalClose}
              />
            ))}
          </div>
        )}
        <div className="flex flex-col items-center mt-8 space-y-4">
          <div className="flex space-x-4">
            <button
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground self-center">
              Page {currentPage} of {totalPages || 1}
            </span>
            <button
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= totalPages}
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