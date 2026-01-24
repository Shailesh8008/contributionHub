import { useState, useMemo, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import toast from "react-hot-toast";
import {
  Search,
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Filter,
  ChevronDown,
  Bookmark,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import useScreenWidth from "../hooks/useScreenWidth";

interface Issue {
  id: number;
  title: string;
  description: string;
  repo: string;
  difficulty: "beginner" | "intermediate" | "unkown";
  comments: number;
  url: string;
  createdAt: Date;
  updatedAt: Date;
}

export default function FindIssuePage() {
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();
  const [issues, setIssues] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [sortBy, setSortBy] = useState<string>("comments-high");
  const [showSortDropdown, setShowSortDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [bookmarkedIssues, setBookmarkedIssues] = useState<Set<number>>(
    new Set(),
  );
  const [bookmarkLoading, setBookmarkLoading] = useState(false);
  const [user, setUser] = useState<any>(null);

  const ISSUES_PER_PAGE = 10;

  // Fetch issues from backend API
  useEffect(() => {
    const fetchIssues = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/issues`,
        );
        if (!response.ok) {
          throw new Error(`Failed to fetch issues: ${response.statusText}`);
        }
        const data = await response.json();
        setIssues(data.issues);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "An error occurred while fetching issues",
        );
        console.error("Error fetching issues:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchIssues();
  }, []);

  // Fetch user's bookmarks
  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookmarks`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setBookmarkedIssues(
            new Set(data.issues?.map((b: any) => b.id) || []),
          );
        }
      } catch (err) {
        console.error("Error fetching bookmarks:", err);
      }
    };

    fetchBookmarks();
  }, []);

  // Fetch user authentication status
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/auth/user`,
          {
            method: "GET",
            credentials: "include",
          },
        );
        if (response.ok) {
          const data = await response.json();
          setUser(data.user || null);
        }
      } catch (err) {
        console.error("Error fetching user:", err);
      }
    };

    fetchUser();
  }, []);

  const difficulties = ["all", "beginner", "intermediate", "unkown"];

  const filteredIssues = useMemo(() => {
    let filtered = issues.filter((issue) => {
      const matchesSearch =
        issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        issue.repo.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesDifficulty =
        selectedDifficulty === "all" || issue.difficulty === selectedDifficulty;

      return matchesSearch && matchesDifficulty;
    });

    // Apply sorting
    const sorted = [...filtered].sort((a, b) => {
      switch (sortBy) {
        case "comments-high":
          return b.comments - a.comments;
        case "comments-low":
          return a.comments - b.comments;
        case "newest":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "oldest":
          return (
            new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
          );
        default:
          return 0;
      }
    });

    return sorted;
  }, [issues, searchTerm, selectedDifficulty, sortBy]);

  // Reset to first page when filtered issues change
  useEffect(() => {
    setCurrentPage(1);
  }, [filteredIssues]);

  // Calculate pagination with useMemo
  const totalPages = useMemo(() => {
    return Math.ceil(filteredIssues.length / ISSUES_PER_PAGE);
  }, [filteredIssues.length, ISSUES_PER_PAGE]);

  const currentIssues = useMemo(() => {
    const start = (currentPage - 1) * ISSUES_PER_PAGE;
    const end = start + ISSUES_PER_PAGE;
    return filteredIssues.slice(start, end);
  }, [currentPage, filteredIssues, ISSUES_PER_PAGE]);

  // Get smart pagination pages
  const getPaginationPages = () => {
    const pages: (number | "dots")[] = [];

    if (totalPages <= 4) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const start = Math.max(2, currentPage - 1);
    const end = Math.min(totalPages - 1, currentPage + 1);

    pages.push(1);

    if (start > 2) {
      pages.push("dots");
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    if (end < totalPages - 1) {
      pages.push("dots");
    }

    pages.push(totalPages);

    return pages;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "beginner":
        return "bg-green-500/20 text-green-300 border-green-500/30";
      case "intermediate":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "unkown":
        return "bg-purple-500/20 text-purple-300 border-purple-500/30";
      default:
        return "bg-gray-500/20 text-gray-300 border-gray-500/30";
    }
  };

  // Truncate description to max 12 words
  const MAX_DESCRIPTION_WORDS = 12;
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > MAX_DESCRIPTION_WORDS) {
      return words.slice(0, MAX_DESCRIPTION_WORDS).join(" ") + "...";
    }
    return description;
  };

  // Toggle bookmark
  const toggleBookmark = async (issueId: number) => {
    // Check if user is authenticated
    if (!user) {
      toast.error("Please login to save bookmarks");
      return;
    }

    try {
      setBookmarkLoading(true);
      const isBookmarked = bookmarkedIssues.has(issueId);

      if (isBookmarked) {
        // Remove bookmark
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookmarks/${issueId}`,
          {
            method: "DELETE",
            credentials: "include",
          },
        );
        if (!response.ok) {
          toast.error("Failed to remove bookmark");
          return;
        }
        const newBookmarks = new Set(bookmarkedIssues);
        newBookmarks.delete(issueId);
        setBookmarkedIssues(newBookmarks);
      } else {
        // Add bookmark
        const response = await fetch(
          `${import.meta.env.VITE_BACKEND_URL}/api/bookmarks`,
          {
            method: "POST",
            credentials: "include",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ issueId }),
          },
        );
        if (!response.ok) {
          toast.error("Failed to save bookmark");
          return;
        }
        const newBookmarks = new Set(bookmarkedIssues);
        newBookmarks.add(issueId);
        setBookmarkedIssues(newBookmarks);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      toast.error("Something went wrong");
    } finally {
      setBookmarkLoading(false);
    }
  };

  return (
    <div className="flex-grow py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Home
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">
            Find Your First Issue
          </h1>
          <p className="text-gray-400 text-lg">
            Discover open-source issues matched to your skill level and tech
            stack
          </p>
        </div>

        {/* Search and Filters */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
            <input
              type="text"
              placeholder="Search by title, repo, or description..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 rounded-lg bg-gray-800 border border-gray-700 focus:border-blue-500 focus:outline-none text-white placeholder-gray-500 transition-colors"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-4">
            {/* Difficulty Filter */}
            <div className="relative">
              <button
                onClick={() =>
                  setShowDifficultyDropdown(!showDifficultyDropdown)
                }
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 transition-colors w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" />
                Difficulty: {selectedDifficulty}
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              {showDifficultyDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  {difficulties.map((diff) => (
                    <button
                      key={diff}
                      onClick={() => {
                        setSelectedDifficulty(diff);
                        setShowDifficultyDropdown(false);
                      }}
                      className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors capitalize ${
                        selectedDifficulty === diff
                          ? "bg-blue-500/20 text-blue-400"
                          : ""
                      }`}
                    >
                      {diff}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Sort Filter */}
            <div className="relative">
              <button
                onClick={() => setShowSortDropdown(!showSortDropdown)}
                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 transition-colors w-full sm:w-auto"
              >
                <Filter className="w-4 h-4" />
                Sort:{" "}
                {sortBy === "comments-high"
                  ? "Comments (High)"
                  : sortBy === "comments-low"
                    ? "Comments (Low)"
                    : sortBy === "newest"
                      ? "Newest"
                      : "Oldest"}
                <ChevronDown className="w-4 h-4 ml-auto" />
              </button>
              {showSortDropdown && (
                <div className="absolute top-full left-0 mt-2 w-full sm:w-48 bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
                  <button
                    onClick={() => {
                      setSortBy("comments-high");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      sortBy === "comments-high"
                        ? "bg-blue-500/20 text-blue-400"
                        : ""
                    }`}
                  >
                    Comments (High to Low)
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("comments-low");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      sortBy === "comments-low"
                        ? "bg-blue-500/20 text-blue-400"
                        : ""
                    }`}
                  >
                    Comments (Low to High)
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("newest");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      sortBy === "newest" ? "bg-blue-500/20 text-blue-400" : ""
                    }`}
                  >
                    Newest
                  </button>
                  <button
                    onClick={() => {
                      setSortBy("oldest");
                      setShowSortDropdown(false);
                    }}
                    className={`w-full text-left px-4 py-2 hover:bg-gray-700 transition-colors ${
                      sortBy === "oldest" ? "bg-blue-500/20 text-blue-400" : ""
                    }`}
                  >
                    Oldest
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            Showing{" "}
            <span className="text-white font-semibold">
              {filteredIssues.length === 0
                ? 0
                : (currentPage - 1) * ISSUES_PER_PAGE + 1}
            </span>{" "}
            to{" "}
            <span className="text-white font-semibold">
              {Math.min(currentPage * ISSUES_PER_PAGE, filteredIssues.length)}
            </span>{" "}
            of{" "}
            <span className="text-white font-semibold">
              {filteredIssues.length}
            </span>{" "}
            issue{filteredIssues.length !== 1 ? "s" : ""}
          </p>
        </div>

        {/* Issues List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading issues...</p>
            </div>
          ) : error ? (
            <div className="text-center py-12">
              <p className="text-red-400 text-lg">Error: {error}</p>
              <button
                onClick={() => window.location.reload()}
                className="mt-4 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Retry
              </button>
            </div>
          ) : filteredIssues.length > 0 ? (
            currentIssues.map((issue) => (
              <div
                key={issue.id}
                className="group glass-card p-6 hover:bg-gray-800/80 hover:border-gray-600 transition-all duration-300 border border-gray-700/50 overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4">
                  <div className="flex-grow">
                    <div className="flex flex-wrap items-start gap-3 mb-3">
                      <h3 className="text-xl font-bold text-white group-hover:text-blue-400 transition-colors">
                        {issue.title}
                      </h3>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getDifficultyColor(
                          issue.difficulty,
                        )} capitalize whitespace-nowrap`}
                      >
                        {issue.difficulty}
                      </span>
                    </div>

                    <div className="text-gray-400 mb-4 text-sm prose prose-invert max-w-none">
                      <ReactMarkdown>
                        {truncateDescription(issue.description)}
                      </ReactMarkdown>
                    </div>

                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <MessageCircle className="w-4 h-4" />
                        <span>{issue.comments}</span>
                      </div>
                      <span className="px-2 py-1 rounded bg-gray-700/50 text-gray-400">
                        {issue.repo}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 flex-shrink-0">
                    <button
                      onClick={() => toggleBookmark(issue.id)}
                      disabled={bookmarkLoading}
                      className={`flex items-center justify-center gap-2 px-3 py-2 rounded-lg font-medium transition-all ${
                        bookmarkedIssues.has(issue.id)
                          ? "bg-blue-600 hover:bg-blue-500 text-white"
                          : "bg-gray-800 border border-gray-700 text-gray-300 hover:border-blue-500 hover:text-blue-400"
                      } disabled:opacity-50`}
                    >
                      <Bookmark
                        className={`w-4 h-4 ${
                          bookmarkedIssues.has(issue.id) ? "fill-white" : ""
                        }`}
                      />
                      {screenWidth < 640 ? "" : "Save"}
                    </button>
                    <a
                      href={issue.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center justify-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all transform group-hover:scale-105"
                    >
                      View Issue
                      <ExternalLink className="w-4 h-4" />
                    </a>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">
                No issues found. Try adjusting your filters or search term.
              </p>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredIssues.length > 0 && (
          <div
            className={`mt-8 flex items-center justify-center gap-4 flex-wrap`}
          >
            <button
              onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              {screenWidth < 500 ? "Prev" : "Previous"}
            </button>

            <div className="flex items-center gap-2 flex-wrap justify-center">
              {getPaginationPages().map((page) =>
                page === "dots" ? (
                  <span key={`dots-${Math.random()}`} className="text-gray-400">
                    ...
                  </span>
                ) : (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page as number)}
                    className={`px-3 py-2 rounded-lg transition-colors ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-800 border border-gray-700 text-gray-300 hover:bg-gray-700"
                    }`}
                  >
                    {page}
                  </button>
                ),
              )}
            </div>

            <button
              onClick={() =>
                setCurrentPage(Math.min(totalPages, currentPage + 1))
              }
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 transition-colors disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-700"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
