import { useState, useEffect } from "react";
import { useNavigate } from 'react-router-dom';
import NavBar from '@/components/NavBar';
import blogs from '@/data/blogs/blogs';
import BlogCard from '@/components/BlogCard';
import Footer from '@/components/Footer';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const Blog = () => {
  const navigate = useNavigate();
  const [blogData, setBlogData] = useState([]);
  const [allBlogData, setAllBlogData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [sortOrder, setSortOrder] = useState("newest");
  const [filteredCount, setFilteredCount] = useState(0);
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

  // Fetch all blogs on component mount
  useEffect(() => {
    const fetchAllBlogs = async () => {
      const isLocal = window.location.hostname === 'localhost';

      try {
        const loadedBlogs = await Promise.all(
          reversedBlogs.map(async (fileName) => {
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
        setAllBlogData(loadedBlogs);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      }
    };

    fetchAllBlogs();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Filter and sort blogs based on search and sort criteria
  useEffect(() => {
    // Helper function to check if a blog matches the search term
    const matchesSearch = (blog) => {
      if (!searchTerm) return true;
      const titleMatch = blog.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const tagsMatch = blog.tags?.some((tag) => 
        tag.toLowerCase().includes(searchTerm.toLowerCase())
      );
      return titleMatch || tagsMatch;
    };

    const filtered = allBlogData.filter(matchesSearch);

    // Apply sorting (create a new sorted array)
    const sorted = [...filtered].sort((a, b) => {
      const dateA = new Date(a.date).getTime();
      const dateB = new Date(b.date).getTime();
      
      if (sortOrder === "newest") {
        return dateB - dateA;
      } else {
        return dateA - dateB;
      }
    });

    // Update filtered count
    setFilteredCount(sorted.length);

    // Apply pagination
    const startIndex = (currentPage - 1) * blogsPerPage;
    const endIndex = startIndex + blogsPerPage;
    setBlogData(sorted.slice(startIndex, endIndex));
  }, [allBlogData, searchTerm, sortOrder, currentPage]);

  const paginate = (pageNumber) => {
    const totalPages = Math.ceil(filteredCount / blogsPerPage);
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
    setCurrentPage(1); // Reset to first page when searching
  };

  const handleSortChange = (value) => {
    setSortOrder(value);
    setCurrentPage(1); // Reset to first page when sorting
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
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
        
        {/* Search and Sort Controls */}
        <div className="mt-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="w-full md:w-96">
            <Input
              type="text"
              placeholder="Search by title or tags..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="w-full"
            />
          </div>
          <div className="w-full md:w-48">
            <Select value={sortOrder} onValueChange={handleSortChange}>
              <SelectTrigger className="w-full">
                <SelectValue placeholder="Sort by date" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="newest">Newest First</SelectItem>
                <SelectItem value="oldest">Oldest First</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

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
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Previous
            </button>
            <span className="text-sm text-muted-foreground self-center">
              Page {currentPage} of {Math.ceil(filteredCount / blogsPerPage) || 1}
            </span>
            <button
              className="px-4 py-2 bg-secondary text-secondary-foreground rounded hover:bg-secondary/80 disabled:opacity-50 disabled:cursor-not-allowed"
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage >= Math.ceil(filteredCount / blogsPerPage)}
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