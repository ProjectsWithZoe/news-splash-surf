import React, { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { onAuthChange } from "@/firebase/authService";
import { cn } from "@/lib/utils";
import { Home, Search, User, Menu, X, Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";
import { useNavigate } from "react-router-dom";

const Header: React.FC = () => {
  const [user, setUser] = useState<any>(null);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem("theme") === "dark" ||
      (!localStorage.getItem("theme") &&
        window.matchMedia("(prefers-color-scheme: dark)").matches)
  );

  const location = useLocation();
  const navigate = useNavigate();

  // Listen for auth state changes
  useEffect(() => {
    const unsubscribe = onAuthChange((user) => {
      setUser(user);
    });
    return unsubscribe;
  }, []);

  // Handle scroll events to add shadow to header
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Close menu when route changes
  useEffect(() => {
    setIsMenuOpen(false);
    setIsSearchOpen(false);
  }, [location.pathname]);

  // Toggle dark mode
  const toggleDarkMode = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    }
    setIsDarkMode(!isDarkMode);
  };

  // Set initial theme
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
  }, []);

  // Handle search submission
  /*const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery)}`);
      setIsSearchOpen(false);
    }
  };*/

  const userInitials = user?.displayName
    ? user.displayName
        .split(" ")
        .map((n: string) => n[0])
        .join("")
        .toUpperCase()
    : "U";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-40 transition-all duration-300 ease-in-out",
        isScrolled ? "glass-effect h-16" : "bg-transparent h-20"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 h-full flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <span className="text-2xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-primary to-primary/70">
            Daily<span className="italic font-bold">News</span>
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          <Link
            to="/"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Home
          </Link>
          <Link
            to="/bookmarks"
            className={cn(
              "text-sm font-medium transition-colors hover:text-primary",
              location.pathname === "/bookmarks"
                ? "text-primary"
                : "text-muted-foreground"
            )}
          >
            Bookmarks
          </Link>
          {/*<button
            onClick={() => setIsSearchOpen(true)}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label="Search"
          >
            <Search size={20} />
          </button>*/}
          <button
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-primary transition-colors"
            aria-label={
              isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/*{user ? (
            <Link to="/profile">
              <Avatar className="h-9 w-9 cursor-pointer hover:ring-2 ring-primary/20 transition-all">
                <AvatarImage
                  src={user.photoURL || undefined}
                  alt={user.displayName || "User"}
                />
                <AvatarFallback className="bg-primary/10 text-primary text-sm">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
            </Link>
          ) : (
            <Link to="/login">
              <Button variant="outline" size="sm" className="rounded-full">
                Sign In
              </Button>
            </Link>
          )}*/}
        </nav>

        {/* Mobile Navigation Toggle */}
        <div className="flex items-center space-x-4 md:hidden">
          {/*<button
            onClick={() => setIsSearchOpen(true)}
            className="text-muted-foreground hover:text-primary transition-colors p-2"
            aria-label="Search"
          >
            <Search size={20} />
          </button>*/}
          <button
            onClick={toggleDarkMode}
            className="text-muted-foreground hover:text-primary transition-colors p-2"
            aria-label={
              isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"
            }
          >
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          {/*<button
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            className="text-foreground p-2"
            aria-label={isMenuOpen ? "Close Menu" : "Open Menu"}
          >
            {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
          </button>*/}
        </div>
      </div>

      {/* Mobile Menu */}
      {/*{isMenuOpen && (
        <div className="fixed inset-0 z-50 pt-20 bg-background/98 backdrop-blur-sm md:hidden animate-fade-in">
          <nav className="flex flex-col items-center justify-center h-full space-y-8 text-center">
            <Link
              to="/"
              className="text-2xl font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Home
            </Link>
            <Link
              to="/bookmarks"
              className="text-2xl font-medium hover:text-primary transition-colors"
              onClick={() => setIsMenuOpen(false)}
            >
              Bookmarks
            </Link>
            {user ? (
              <Link
                to="/profile"
                className="text-2xl font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Profile
              </Link>
            ) : (
              <Link
                to="/login"
                className="text-2xl font-medium hover:text-primary transition-colors"
                onClick={() => setIsMenuOpen(false)}
              >
                Sign In
              </Link>
            )}
          </nav>
        </div>
      )}*/}

      {/* Search Overlay */}
      {/*{isSearchOpen && (
        <div className="fixed inset-0 z-50 bg-background/98 backdrop-blur-sm flex items-start justify-center pt-20 px-4 animate-fade-in">
          <div className="w-full max-w-2xl">
            <form onSubmit={handleSearch} className="relative">
              <Input
                type="search"
                placeholder="Search for news..."
                className="w-full h-12 pl-12 pr-12 text-lg rounded-full shadow-subtle focus:ring-2 ring-primary/20"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                autoFocus
              />
              <Search
                className="absolute left-4 top-3.5 text-muted-foreground"
                size={20}
              />
              <button
                type="button"
                onClick={() => setIsSearchOpen(false)}
                className="absolute right-4 top-3.5 text-muted-foreground hover:text-foreground transition-colors"
                aria-label="Close Search"
              >
                <X size={20} />
              </button>
            </form>
          </div>
        </div>
      )}*/}
    </header>
  );
};

export default Header;
