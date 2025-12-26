"use client";

import { useState } from "react";
import { ArrowRight, Clock, User, Bookmark, Share2, ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

const posts = [
  {
    id: 1,
    title: "Why Your CTC Doesn't Tell the Whole Story",
    excerpt: "Most professionals focus on their CTC during job negotiations, but what actually matters is the money that hits your bank account each month. Let's break down the hidden components.",
    category: "Salary Insights",
    readTime: "7 min read",
    author: "Career Guide",
    date: "Oct 18, 2025",
    likes: 234,
    featured: true,
  },
  {
    id: 2,
    title: "The Power of Starting Your SIP in Your 20s",
    excerpt: "A simple calculation that might change how you think about investing. See how starting early can mean the difference between retiring comfortably and struggling.",
    category: "Wealth Building",
    readTime: "5 min read",
    author: "Investment Desk",
    date: "Sep 25, 2025",
    likes: 189,
    featured: false,
  },
  {
    id: 3,
    title: "Gratuity: The Benefit Most Employees Don't Understand",
    excerpt: "After five years of service, you're entitled to a lump sum that many overlook during job changes. Here's how to calculate it and what to expect.",
    category: "Employee Benefits",
    readTime: "6 min read",
    author: "HR Insights",
    date: "Aug 30, 2025",
    likes: 156,
    featured: false,
  },
];

const BlogPreview = () => {
  const [savedPosts, setSavedPosts] = useState<number[]>([]);
  const [likedPosts, setLikedPosts] = useState<number[]>([]);

  const toggleSave = (postId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setSavedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  const toggleLike = (postId: number, e: React.MouseEvent) => {
    e.preventDefault();
    setLikedPosts(prev => 
      prev.includes(postId) ? prev.filter(id => id !== postId) : [...prev, postId]
    );
  };

  return (
    <section id="blog" className="py-20 gradient-section">
      <div className="container">
        {/* Section Header */}
        <div className="mb-12 flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <span className="mb-2 inline-block rounded-full bg-primary/10 px-4 py-1.5 text-sm font-medium text-primary">
              Fresh Perspectives
            </span>
            <h2 className="font-heading text-3xl font-bold text-foreground md:text-4xl">
              Latest from Our Blog
            </h2>
          </div>
          <Button variant="outline" className="group">
            Browse All Articles
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Button>
        </div>

        {/* Blog Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {posts.map((post, index) => (
            <article
              key={post.id}
              className="group overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1 animate-fade-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              {/* Gradient Header */}
              <div className="relative h-44 bg-gradient-to-br from-primary/30 via-accent/20 to-primary/10 overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center opacity-20 group-hover:opacity-30 transition-opacity">
                  <span className="text-8xl font-bold text-primary">0{post.id}</span>
                </div>
                
                {/* Category Badge */}
                <div className="absolute top-4 left-4">
                  <span className="rounded-full bg-card/95 px-3 py-1.5 text-xs font-semibold text-foreground backdrop-blur-sm shadow-sm">
                    {post.category}
                  </span>
                </div>

                {/* Interactive Actions */}
                <div className="absolute top-4 right-4 flex gap-2">
                  <button
                    onClick={(e) => toggleSave(post.id, e)}
                    className={`flex h-8 w-8 items-center justify-center rounded-full backdrop-blur-sm transition-all ${
                      savedPosts.includes(post.id)
                        ? "bg-accent text-accent-foreground"
                        : "bg-card/80 text-muted-foreground hover:bg-card"
                    }`}
                    aria-label="Save article"
                  >
                    <Bookmark className="h-4 w-4" fill={savedPosts.includes(post.id) ? "currentColor" : "none"} />
                  </button>
                  <button
                    className="flex h-8 w-8 items-center justify-center rounded-full bg-card/80 text-muted-foreground hover:bg-card backdrop-blur-sm transition-all"
                    aria-label="Share article"
                  >
                    <Share2 className="h-4 w-4" />
                  </button>
                </div>
              </div>

              {/* Content */}
              <div className="p-5">
                <h3 className="mb-3 font-heading text-lg font-bold text-foreground line-clamp-2 group-hover:text-primary transition-colors cursor-pointer">
                  {post.title}
                </h3>
                <p className="mb-4 text-sm text-muted-foreground line-clamp-3">
                  {post.excerpt}
                </p>

                {/* Meta & Actions */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3 text-xs text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Clock className="h-3.5 w-3.5" />
                      {post.readTime}
                    </span>
                    <span>{post.date}</span>
                  </div>
                  
                  <button
                    onClick={(e) => toggleLike(post.id, e)}
                    className={`flex items-center gap-1 text-xs font-medium transition-all ${
                      likedPosts.includes(post.id)
                        ? "text-accent"
                        : "text-muted-foreground hover:text-foreground"
                    }`}
                  >
                    <ThumbsUp className="h-3.5 w-3.5" fill={likedPosts.includes(post.id) ? "currentColor" : "none"} />
                    {post.likes + (likedPosts.includes(post.id) ? 1 : 0)}
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
};

export default BlogPreview;
