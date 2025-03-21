
import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { fetchArticleById } from '@/services/newsApi';
import { formatDate } from '@/utils/dateUtils';
import Header from '@/components/Header';
import Loader from '@/components/Loader';
import { ArrowLeft, Clock, Calendar, User, Share2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';

const Article: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [article, setArticle] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [readingProgress, setReadingProgress] = useState(0);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    const fetchArticle = async () => {
      if (!id) {
        navigate('/');
        return;
      }
      
      setLoading(true);
      try {
        const articleData = await fetchArticleById(id);
        
        if (!articleData) {
          toast.error('Article not found');
          navigate('/');
          return;
        }
        
        setArticle(articleData);
        document.title = `${articleData.title} - Daily News`;
      } catch (error) {
        console.error('Error fetching article:', error);
        toast.error('Failed to load article');
        navigate('/');
      } finally {
        setLoading(false);
      }
    };
    
    fetchArticle();
    
    // Scroll to top
    window.scrollTo(0, 0);
  }, [id, navigate]);

  // Reading progress indicator
  useEffect(() => {
    const handleScroll = () => {
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;
      const scrollTop = window.scrollY;
      
      const progress = (scrollTop / (documentHeight - windowHeight)) * 100;
      setReadingProgress(progress);
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
      document.title = 'Daily News';
    };
  }, []);

  const handleShare = () => {
    if (navigator.share) {
      navigator.share({
        title: article.title,
        text: article.description || '',
        url: window.location.href
      })
      .then(() => toast.success('Article shared successfully'))
      .catch((error) => console.error('Error sharing article:', error));
    } else {
      // Fallback for browsers that don't support the Web Share API
      navigator.clipboard.writeText(window.location.href)
        .then(() => toast.success('Article URL copied to clipboard'))
        .catch(() => toast.error('Failed to copy URL'));
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader size="large" text="Loading article..." />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-20">
      <Header />
      
      {/* Reading progress indicator */}
      <div 
        className="reading-progress" 
        style={{ width: `${readingProgress}%` }} 
      />
      
      <main className="max-w-3xl mx-auto px-4 py-6 sm:px-6 lg:px-8">
        <Link 
          to="/" 
          className="inline-flex items-center text-sm text-muted-foreground hover:text-primary transition-colors mb-6"
        >
          <ArrowLeft size={16} className="mr-2" />
          Back to headlines
        </Link>
        
        <article className="prose prose-lg dark:prose-invert max-w-none">
          <h1 className="text-3xl md:text-4xl font-bold mb-4 font-serif">
            {article.title}
          </h1>
          
          <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground mb-6">
            {article.source?.name && (
              <span className="inline-flex items-center rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary">
                {article.source.name}
              </span>
            )}
            
            <div className="flex items-center">
              <Calendar size={14} className="mr-1" />
              <time dateTime={article.publishedAt}>
                {formatDate(article.publishedAt)}
              </time>
            </div>
            
            {article.author && (
              <div className="flex items-center">
                <User size={14} className="mr-1" />
                <span>{article.author}</span>
              </div>
            )}
          </div>
          
          {article.urlToImage && (
            <div className="relative aspect-video w-full mb-8 rounded-lg overflow-hidden shadow-subtle">
              <img
                src={article.urlToImage}
                alt={article.title}
                className={`h-full w-full object-cover transition-all duration-500 ${isImageLoaded ? 'blur-0' : 'blur-sm'}`}
                onLoad={() => setIsImageLoaded(true)}
              />
            </div>
          )}
          
          {article.description && (
            <p className="text-xl leading-relaxed text-balance font-medium mb-6">
              {article.description}
            </p>
          )}
          
          {article.content ? (
            <div className="leading-relaxed whitespace-pre-line">
              {/* Remove the content cutoff and source reference */}
              {article.content.replace(/\[\+\d+ chars\]$/, '')}
              
              <div className="mt-8 text-muted-foreground text-sm">
                <p>
                  This is a preview. Read the full article at:{' '}
                  <a 
                    href={article.url} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-primary underline hover:text-primary/80 transition-colors"
                  >
                    {article.source.name || 'Source'}
                  </a>
                </p>
              </div>
            </div>
          ) : (
            <div className="mt-8 text-muted-foreground">
              <p>
                Full article content is not available in the API preview.
                Please read the complete article at:{' '}
                <a 
                  href={article.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="text-primary underline hover:text-primary/80 transition-colors"
                >
                  {article.source.name || 'Source'}
                </a>
              </p>
            </div>
          )}
        </article>
        
        <div className="mt-10 flex items-center justify-between border-t border-b py-4">
          <Link to="/" className="text-sm font-medium text-primary hover:underline">
            More headlines
          </Link>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleShare}
            className="flex items-center"
          >
            <Share2 size={14} className="mr-2" />
            Share
          </Button>
        </div>
      </main>
      
      <footer className="mt-20 py-8 border-t">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-muted-foreground">
            &copy; {new Date().getFullYear()} Daily News. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Article;
