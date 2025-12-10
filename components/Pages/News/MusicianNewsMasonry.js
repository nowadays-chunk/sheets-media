"use client";

import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  CardActions,
  IconButton,
  Typography,
  Avatar,
  Skeleton,
} from "@mui/material";

import FavoriteIcon from "@mui/icons-material/Favorite";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

import { red } from "@mui/material/colors";
import { styled } from "@mui/material/styles";

// ============================================================================
// CONSTANTS
// ============================================================================
const SIDEBAR_WIDTH = 350;
const SIDEBAR_CLOSED = 40;
const HEADER_HEIGHT = 44;

// ============================================================================
// RSS FEEDS
// ============================================================================
const RSS_FEEDS = [
  "https://pan-african-music.com/en/feed/",
  "https://native-mag.com/feed/",
  "https://guardian.ng/category/life/music/feed/",
  "https://www.musicinafrica.net/rss",
  "https://afropop.org/rss",
  "https://notjustok.com/feed/",
  "https://www.okayafrica.com/rss/",
  "https://yawapress.com/feed/",
  "https://www.yabiladi.com/rss/actualites/musique",
  "https://www.hitradio.ma/feed",
];

// ============================================================================
// RESPONSIVE CONTAINER
// ============================================================================
const ResponsiveContainer = styled("div")({
  width: "100%",
  maxWidth: "100vw",
  overflowX: "hidden",
  padding: "0 80px",
  margin: "0 auto",
  boxSizing: "border-box",

  "@media (max-width:1200px)": {
    padding: "0 20px",
  },
});

// ============================================================================
// MASONRY
// ============================================================================
const MasonryWrapper = styled("div")(({ theme }) => ({
  width: "100%",
  maxWidth: "100%",
  columnGap: "20px",
  columnCount: 1,
  overflowX: "hidden",
  boxSizing: "border-box",

  [theme.breakpoints.up("md")]: { columnCount: 2 },
  [theme.breakpoints.up("lg")]: { columnCount: 3 },
}));

const MasonryItem = styled("div")({
  breakInside: "avoid",
  width: "100%",
  display: "block",
  marginBottom: 20,
});

// ============================================================================
// DESKTOP SIDEBAR (scrollable Y, invisible scrollbar)
// ============================================================================
const Sidebar = styled("div")(({ open }) => ({
  position: "fixed",
  top: HEADER_HEIGHT,
  right: 0,
  width: open ? SIDEBAR_WIDTH : SIDEBAR_CLOSED,
  height: `calc(100vh - ${HEADER_HEIGHT}px)`,
  background: "#f5f5f5",
  borderLeft: "1px solid #ddd",
  transition: "width 0.3s ease",
  zIndex: 3000,
  overflow: "hidden",

  "@media (max-width:1200px)": {
    display: "none",
  },
}));

const SidebarHeader = styled("div")(({ open }) => ({
  height: 45,
  borderBottom: "1px solid #ddd",
  display: "flex",
  alignItems: "center",
  justifyContent: open ? "flex-start" : "center",
  paddingLeft: 12,
  paddingRight: 12,
  boxSizing: "border-box",
}));

const SidebarToggleDesktop = styled(IconButton)({
  width: 24,
  height: 24,
  padding: 4,
  background: "#fff",
  border: "2px solid #463f4b",
  borderRadius: "50%",
  "&:hover": { background: "#eee" },
});

const SidebarScroll = styled("div")({
  height: "calc(100% - 45px)",
  overflowY: "auto",
  padding: "20px",
  boxSizing: "border-box",

  /* HIDE SCROLLBAR */
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

// ============================================================================
// MOBILE SIDEBAR
// ============================================================================
const MobileDrawer = styled("div")(({ open }) => ({
  position: "fixed",
  top: HEADER_HEIGHT,
  left: 0,
  right: 0,

  width: "100%",
  maxWidth: "100%",
  background: "#f5f5f5",
  borderBottom: "1px solid #ddd",
  transition: "max-height 0.35s ease",

  maxHeight: open ? "80vh" : 40,
  overflow: "hidden",
  zIndex: 5000,

  "@media (min-width:1200px)": { display: "none" },
}));

const MobileDrawerHeader = styled("div")({
  height: 40,
  display: "flex",
  justifyContent: "flex-end",
  alignItems: "center",
  paddingRight: 20,
});

const MobileDrawerToggle = styled(IconButton)({
  width: 24,
  height: 24,
  borderRadius: "50%",
  border: "2px solid #463f4b",
  background: "#fff",
});

const MobileDrawerScroll = styled("div")({
  height: "calc(80vh - 40px)",
  overflowY: "auto",
  padding: "20px",
  boxSizing: "border-box",

  scrollbarWidth: "none",
  msOverflowStyle: "none",
  "&::-webkit-scrollbar": {
    display: "none",
  },
});

// ============================================================================
// FETCH RSS
// ============================================================================
async function fetchRSS(url) {
  try {
    const res = await fetch(
      `https://api.rss2json.com/v1/api.json?rss_url=${encodeURIComponent(url)}`
    );
    const data = await res.json();
    if (!res.ok || !data.items) return [];

    return data.items.map((i) => ({
      id: i.link,
      title: i.title,
      link: i.link,
      date: new Date(i.pubDate).getTime(),
      content: i.description?.replace(/<[^>]+>/g, "") || "",
      thumbnail: i.thumbnail || i.enclosure?.link || null,
      source: data.feed?.title || url,
    }));
  } catch {
    return [];
  }
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function MusicianNewsMasonry() {
  const [articles, setArticles] = useState([]);
  const [latest10PerFeed, setLatest10PerFeed] = useState([]);
  const [search, setSearch] = useState("");
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);

  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);

  const observer = useRef(null);

  // LOAD BOOKMARKS
  useEffect(() => {
    const stored = localStorage.getItem("bookmarks_music");
    if (stored) setBookmarks(JSON.parse(stored));
  }, []);

  const toggleBookmark = (article) => {
    let updated;
    if (bookmarks.some((b) => b.link === article.link)) {
      updated = bookmarks.filter((b) => b.link !== article.link);
    } else {
      updated = [...bookmarks, article];
    }

    setBookmarks(updated);
    localStorage.setItem("bookmarks_music", JSON.stringify(updated));
  };

  // FETCH RSS PAGES
  const fetchPageData = async () => {
    if (!hasMore) return;

    setLoading(true);

    const batch = RSS_FEEDS.slice((page - 1) * 5, page * 5);
    if (batch.length === 0) {
      setHasMore(false);
      return;
    }

    let results = [];
    let perFeedTop10 = [];

    for (const feed of batch) {
      const items = await fetchRSS(feed);
      results.push(...items);
      perFeedTop10.push(...items.slice(0, 10));
    }

    setLatest10PerFeed((prev) => [...prev, ...perFeedTop10]);

    const merged = [...articles, ...results].sort((a, b) => b.date - a.date);
    setArticles(merged);
    setLoading(false);
  };

  useEffect(() => {
    fetchPageData();
  }, [page]);

  // INFINITE SCROLL OBSERVER
  const lastRef = useCallback(
    (node) => {
      if (loading) return;

      if (observer.current) observer.current.disconnect();

      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasMore) {
          setPage((n) => n + 1);
        }
      });

      if (node) observer.current.observe(node);
    },
    [loading, hasMore]
  );

  // SEARCH ENGINE
  const normalize = (t) =>
    t.toLowerCase().replace(/\s+/g, " ").trim();

  const searchResults = useMemo(() => {
    if (!search) return [];

    const q = normalize(search);

    return latest10PerFeed
      .map((item) => {
        const t = normalize(item.title);
        const c = normalize(item.content);
        let score = 0;

        if (t.includes(q)) score += 5;
        if (c.includes(q)) score += 2;

        return score ? { ...item, score } : null;
      })
      .filter(Boolean)
      .sort((a, b) => b.score - a.score)
      .slice(0, 50);
  }, [search, latest10PerFeed]);

  // ========================================================================
  // RENDER
  // ========================================================================
  return (
    <>
      {/* DESKTOP SIDEBAR */}
      <Sidebar open={sidebarOpen}>
        <SidebarHeader open={sidebarOpen}>
          <SidebarToggleDesktop onClick={() => setSidebarOpen((o) => !o)}>
            {sidebarOpen ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </SidebarToggleDesktop>
        </SidebarHeader>

        {sidebarOpen && (
          <SidebarScroll>
            <Typography variant="h6" sx={{ mb: 2 }}>
              Bookmarked News
            </Typography>

            {bookmarks.length === 0 && (
              <Typography>No bookmarks yet.</Typography>
            )}

            {bookmarks.map((b) => (
              <Typography
                key={b.id}
                sx={{
                  mb: 1,
                  cursor: "pointer",
                  "&:hover": { textDecoration: "underline" },
                }}
                onClick={() => window.open(b.link, "_blank")}
              >
                • {b.title}
              </Typography>
            ))}
          </SidebarScroll>
        )}
      </Sidebar>

      {/* MOBILE SIDEBAR */}
      <MobileDrawer open={mobileSidebarOpen}>
        <MobileDrawerHeader>
          <MobileDrawerToggle
            onClick={() => setMobileSidebarOpen((o) => !o)}
          >
            {mobileSidebarOpen ? (
              <KeyboardArrowUpIcon />
            ) : (
              <KeyboardArrowDownIcon />
            )}
          </MobileDrawerToggle>
        </MobileDrawerHeader>

        <MobileDrawerScroll>
          <Typography variant="h6" sx={{ mb: 2 }}>
            Bookmarked News
          </Typography>

          {bookmarks.map((b) => (
            <Typography
              key={b.id}
              sx={{
                mb: 1,
                cursor: "pointer",
                "&:hover": { textDecoration: "underline" },
              }}
              onClick={() => window.open(b.link, "_blank")}
            >
              • {b.title}
            </Typography>
          ))}
        </MobileDrawerScroll>
      </MobileDrawer>

      {/* MAIN CONTENT */}
      <ResponsiveContainer>
        <input
          placeholder="Search latest 10 news per feed…"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{
            width: "100%",
            padding: "12px",
            borderRadius: "8px",
            border: "1px solid #ccc",
            marginBottom: "20px",
          }}
        />

        {/* SEARCH RESULTS */}
        {search && (
          <MasonryWrapper>
            {searchResults.map((a) => (
              <MasonryItem key={a.id}>
                <Card>
                  <CardHeader
                    avatar={<Avatar sx={{ bgcolor: red[500] }}>M</Avatar>}
                    title={a.title}
                    subheader={new Date(a.date).toLocaleString()}
                  />
                  {a.thumbnail && (
                    <CardMedia component="img" image={a.thumbnail} />
                  )}
                  <CardContent>
                    <Typography>{a.content.slice(0, 200)}...</Typography>
                  </CardContent>
                  <CardActions>
                    <IconButton onClick={() => window.open(a.link, "_blank")}>
                      <OpenInNewIcon />
                    </IconButton>
                  </CardActions>
                </Card>
              </MasonryItem>
            ))}
          </MasonryWrapper>
        )}

        {/* LATEST NEWS */}
        {!search && (
          <MasonryWrapper>
            {articles.map((a, idx) => {
              const isLast = idx === articles.length - 1;
              return (
                <MasonryItem key={a.id} ref={isLast ? lastRef : null}>
                  <Card>
                    <CardHeader
                      avatar={<Avatar sx={{ bgcolor: red[500] }}>M</Avatar>}
                      title={a.title}
                      subheader={new Date(a.date).toLocaleString()}
                    />

                    {a.thumbnail && (
                      <CardMedia component="img" image={a.thumbnail} />
                    )}

                    <CardContent>
                      <Typography>{a.content.slice(0, 200)}...</Typography>
                    </CardContent>

                    <CardActions>
                      <IconButton onClick={() => toggleBookmark(a)}>
                        <FavoriteIcon
                          color={
                            bookmarks.some((b) => b.link === a.link)
                              ? "error"
                              : "inherit"
                          }
                        />
                      </IconButton>

                      <IconButton onClick={() => window.open(a.link, "_blank")}>
                        <OpenInNewIcon />
                      </IconButton>
                    </CardActions>
                  </Card>
                </MasonryItem>
              );
            })}

            {loading && (
              <>
                <Skeleton height={300} sx={{ mb: 3 }} />
                <Skeleton height={300} sx={{ mb: 3 }} />
                <Skeleton height={300} sx={{ mb: 3 }} />
              </>
            )}
          </MasonryWrapper>
        )}
      </ResponsiveContainer>
    </>
  );
}
