import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";

function Home() {
  const [posts, setPosts] = useState([]);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const apiUrl = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await axios.get(`${apiUrl}/api/posts`);
        setPosts(res.data.posts);
      } catch (error) {
        console.error("Error fetching posts:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, []);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error("Error parsing user data from localStorage:", error);
      }
    }
  }, []);

  const handleDelete = async (postId) => {
    if (window.confirm("Are you sure you want to delete this post?")) {
      try {
        const token = localStorage.getItem("token");
        await axios.delete(`${apiUrl}/api/posts/${postId}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setPosts(posts.filter((post) => post._id !== postId));
        alert("Post deleted successfully");
      } catch (error) {
        console.error("Error deleting post:", error);
      }
    }
  };

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Hero Section */}
      <header className="bg-gradient-to-r from-teal-500 via-blue-500 to-indigo-500 text-white py-20 text-center">
        <h1 className="text-6xl font-bold mb-4">Welcome to BlogZone</h1>
        <p className="text-lg">Discover, Create, and Share Amazing Stories</p>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-10">
        {loading ? (
          <div className="text-center mt-20">
            <div className="loader border-t-4 border-teal-600 rounded-full w-16 h-16 mx-auto animate-spin"></div>
            <p className="text-gray-700 mt-4">Loading posts...</p>
          </div>
        ) : posts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {posts.map((post) => (
              <div
                key={post._id}
                className="bg-white shadow-lg rounded-lg overflow-hidden transform hover:scale-105 transition-transform duration-300"
              >
                {post.image && (
                  <img
                    src={`${apiUrl}${post.image}`}
                    alt={post.title}
                    className="w-full h-56 object-cover"
                  />
                )}
                <div className="p-6">
                  <h3 className="text-xl font-semibold text-gray-800">{post.title}</h3>
                  <p className="text-gray-600 mt-2 text-sm">
                    {post.content.substring(0, 120)}...
                  </p>
                  <p className="text-gray-500 text-xs mt-2">
                    Published: {new Date(post.createdAt).toLocaleDateString()}
                  </p>
                  <div className="mt-4 flex justify-between items-center">
                    <Link
                      to={`/posts/${post._id}`}
                      className="text-teal-500 hover:text-teal-700 font-medium"
                    >
                      Read More
                    </Link>
                    {user && user.id === post.author._id && (
                      <div className="flex space-x-4">
                        <Link
                          to={`/edit/${post._id}`}
                          className="text-green-500 hover:text-green-700 font-medium"
                        >
                          Edit
                        </Link>
                        <button
                          onClick={() => handleDelete(post._id)}
                          className="text-red-500 hover:text-red-700 font-medium"
                        >
                          Delete
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center mt-20">
            <img
              src="/images/empty-state.svg"
              alt="No posts available"
              className="w-48 mx-auto"
            />
            <p className="text-gray-700 text-lg mt-4">
              {user
                ? "No posts yet! Create your first post now."
                : "No posts available. Please log in to create posts!"}
            </p>
            {user && (
              <Link
                to="/create-post"
                className="mt-6 inline-block bg-teal-500 text-white px-5 py-3 rounded-full shadow hover:bg-teal-600 transition duration-300"
              >
                Create Post
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

export default Home;
