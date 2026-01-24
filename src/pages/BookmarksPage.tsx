import { useState, useEffect, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import {
  ArrowLeft,
  MessageCircle,
  ExternalLink,
  Filter,
  ChevronDown,
  BookmarkX,
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

export default function BookmarksPage() {
  const screenWidth = useScreenWidth();
  const navigate = useNavigate();
  const [bookmarks, setBookmarks] = useState<Issue[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDifficulty, setSelectedDifficulty] = useState<string>("all");
  const [showDifficultyDropdown, setShowDifficultyDropdown] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const ITEMS_PER_PAGE = 10;

  useEffect(() => {
    const fetchBookmarks = async () => {
      try {
        setLoading(true);
        setError(null);
        const response = await fetch("http://localhost:5000/api/bookmarks", {
          method: "GET",
          credentials: "include",
        });
        if (!response.ok) {
          if (response.status === 401) {
            navigate("/login");
            return;
          }
          throw new Error("Failed to fetch bookmarks");
        }
        const data = await response.json();
        setBookmarks(data.issues);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load bookmarks",
        );
        console.error("Error fetching bookmarks:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchBookmarks();
  }, [navigate]);

  const difficulties = ["all", "beginner", "intermediate", "unkown"];

  const filteredBookmarks = useMemo(() => {
    return bookmarks.filter(
      (issue) =>
        selectedDifficulty === "all" || issue.difficulty === selectedDifficulty,
    );
  }, [bookmarks, selectedDifficulty]);

  useEffect(() => {
    setCurrentPage(1);
  }, [filteredBookmarks]);

  const totalPages = useMemo(() => {
    return Math.ceil(filteredBookmarks.length / ITEMS_PER_PAGE);
  }, [filteredBookmarks.length]);

  const currentBookmarks = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const end = start + ITEMS_PER_PAGE;
    return filteredBookmarks.slice(start, end);
  }, [currentPage, filteredBookmarks]);

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

  const MAX_DESCRIPTION_WORDS = 12;
  const truncateDescription = (description: string) => {
    const words = description.split(" ");
    if (words.length > MAX_DESCRIPTION_WORDS) {
      return words.slice(0, MAX_DESCRIPTION_WORDS).join(" ") + "...";
    }
    return description;
  };

  const removeBookmark = async (issueId: number) => {
    try {
      const response = await fetch(
        `http://localhost:5000/api/bookmarks/${issueId}`,
        {
          method: "DELETE",
          credentials: "include",
        },
      );
      if (response.ok) {
        console.log(response.json());
        setBookmarks(bookmarks.filter((b) => b.id !== issueId));
      }
    } catch (err) {
      console.error("Error removing bookmark:", err);
    }
  };

  return (
    <div className="flex-grow py-20">
      <div className="max-w-6xl mx-auto px-6">
        {/* Header */}
        <div className="mb-12">
          <button
            onClick={() => navigate("/issues")}
            className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 transition-colors mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform" />
            Back to Issues
          </button>
          <h1 className="text-4xl md:text-5xl font-bold mb-4">Saved Issues</h1>
          <p className="text-gray-400 text-lg">
            Your bookmarked open-source issues
          </p>
        </div>

        {/* Filters */}
        <div className="mb-8">
          <div className="relative w-full sm:w-48">
            <button
              onClick={() => setShowDifficultyDropdown(!showDifficultyDropdown)}
              className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-800 border border-gray-700 hover:border-gray-600 text-gray-300 transition-colors w-full"
            >
              <Filter className="w-4 h-4" />
              Difficulty: {selectedDifficulty}
              <ChevronDown className="w-4 h-4 ml-auto" />
            </button>
            {showDifficultyDropdown && (
              <div className="absolute top-full left-0 mt-2 w-full bg-gray-800 border border-gray-700 rounded-lg shadow-xl z-10">
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
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-400">
            {filteredBookmarks.length === 0
              ? "No saved issues"
              : `Showing ${(currentPage - 1) * ITEMS_PER_PAGE + 1} to ${Math.min(
                  currentPage * ITEMS_PER_PAGE,
                  filteredBookmarks.length,
                )} of ${filteredBookmarks.length} saved issue${
                  filteredBookmarks.length !== 1 ? "s" : ""
                }`}
          </p>
        </div>

        {/* Bookmarks List */}
        <div className="space-y-4">
          {loading ? (
            <div className="text-center py-12">
              <p className="text-gray-400 text-lg">Loading bookmarks...</p>
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
          ) : filteredBookmarks.length > 0 ? (
            currentBookmarks.map((issue) => (
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
                      onClick={() => removeBookmark(issue.id)}
                      className="flex items-center justify-center gap-2 px-3 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-all"
                    >
                      <BookmarkX className="w-4 h-4" />
                      {screenWidth < 640 ? "" : "Remove"}
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
              <p className="text-gray-400 text-lg mb-4">
                You haven't saved any issues yet.
              </p>
              <button
                onClick={() => navigate("/issues")}
                className="px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-medium transition-colors"
              >
                Browse Issues
              </button>
            </div>
          )}
        </div>

        {/* Pagination Controls */}
        {filteredBookmarks.length > 0 && (
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
