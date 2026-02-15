"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import {
  LayoutDashboard,
  Calendar,
  Users,
  FileText,
  LogOut,
  Plus,
  Search,
  FolderPlus,
  Trash2,
  ChevronLeft,
  ChevronRight,
  Image as ImageIcon,
  Newspaper,
  UserPlus,
  Loader2,
  Menu,
  X,
} from "lucide-react";
import { getDashboardStats } from "@/actions/dashboard-stats";
import { logoutAction } from "@/actions/auth-actions";
import { useRouter } from "next/navigation";
import { deleteEvent } from "@/actions/event-actions";
import { deleteNews } from "@/actions/news-actions";
import { deleteGallery } from "@/actions/gallery-actions";

type DataItem = {
  id: number;
  title?: string;
  caption?: string;
  date: string;
  author?: string;
  category?: string;
  tag?: string;
};

export default function AdminDashboard() {
  const router = useRouter();

  const [user, setUser] = useState({ name: "Admin", role: "Loading..." });
  const [stats, setStats] = useState({
    totalMembers: 0,
    totalDivisions: 0,
    totalContent: 0,
  });
  const [loading, setLoading] = useState(true);
  const [isDeleting, setIsDeleting] = useState<number | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const [activeTab, setActiveTab] = useState<"events" | "news" | "gallery">(
    "events",
  );
  const [events, setEvents] = useState<DataItem[]>([]);
  const [news, setNews] = useState<DataItem[]>([]);
  const [gallery, setGallery] = useState<DataItem[]>([]);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    async function initData() {
      const res = await getDashboardStats();
      if (res.success && res.stats && res.data) {
        setStats(res.stats);

        const fmtDate = (d: any) => new Date(d).toLocaleDateString("en-GB");

        setEvents(
          res.data.events.map((e) => ({ ...e, date: fmtDate(e.date) })),
        );
        setNews(res.data.news.map((n) => ({ ...n, date: fmtDate(n.date) })));
        setGallery(
          res.data.gallery.map((g) => ({ ...g, date: fmtDate(g.date) })),
        );
      }
      setLoading(false);
    }

    const storedUser =
      localStorage.getItem("adminUser") || '{"name":"Admin","role":"Staff"}';
    try {
      setUser(JSON.parse(storedUser));
    } catch (e) {}

    initData();
  }, []);

  const handleDelete = async (id: number) => {
    if (
      !confirm(
        "Apakah Anda yakin ingin menghapus item ini? Data yang dihapus tidak bisa dikembalikan.",
      )
    ) {
      return;
    }

    setIsDeleting(id);

    let result;
    try {
      if (activeTab === "events") {
        result = await deleteEvent(id);
        if (result.success)
          setEvents((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "news") {
        result = await deleteNews(id);
        if (result.success)
          setNews((prev) => prev.filter((item) => item.id !== id));
      } else if (activeTab === "gallery") {
        result = await deleteGallery(id);
        if (result.success)
          setGallery((prev) => prev.filter((item) => item.id !== id));
      }

      if (result?.success) {
        setStats((prev) => ({ ...prev, totalContent: prev.totalContent - 1 }));
        router.refresh();
      } else {
        alert("Gagal menghapus: " + result?.error);
      }
    } catch (error) {
      alert("Terjadi kesalahan sistem.");
    } finally {
      setIsDeleting(null);
    }
  };

  let currentData: DataItem[] = [];
  if (activeTab === "events") currentData = events;
  else if (activeTab === "news") currentData = news;
  else currentData = gallery;

  const totalPages = Math.ceil(currentData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const displayedItems = currentData.slice(
    startIndex,
    startIndex + itemsPerPage,
  );

  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage((p) => p + 1);
  };
  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage((p) => p - 1);
  };

  useEffect(() => {
    setCurrentPage(1);
  }, [activeTab]);

  const handleLogout = async () => {
    await logoutAction();
    localStorage.removeItem("adminUser");
    router.push("/login");
  };

  function StatCard({
    title,
    value,
    subtitle,
    icon: Icon,
    color,
    bg,
    href,
  }: any) {
    const CardContent = (
      <div
        className={`bg-[#151b2b] border border-white/5 rounded-3xl p-6 flex items-start justify-between hover:border-[#E7B95A]/50 hover:bg-[#151b2b]/80 transition-all shadow-lg cursor-pointer h-full group`}
      >
        <div>
          <p className="text-gray-400 text-sm font-medium mb-1 group-hover:text-[#E7B95A] transition-colors">
            {title}
          </p>
          <h3 className="text-3xl font-extrabold text-white mb-1">{value}</h3>
          <p className="text-[10px] text-gray-500">{subtitle}</p>
        </div>
        <div
          className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-transform group-hover:scale-110 ${bg} ${color}`}
        >
          <Icon size={24} />
        </div>
      </div>
    );

    if (href) {
      return (
        <Link href={href} className="block h-full">
          {CardContent}
        </Link>
      );
    }

    return CardContent;
  }

  return (
    <div className="min-h-screen bg-[#0C101C] text-white flex selection:bg-[#E7B95A] selection:text-[#0C101C] relative">
      {isSidebarOpen && (
        <div
          className="fixed inset-0 bg-black/80 z-40 md:hidden"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      <aside
        className={`
          fixed inset-y-0 left-0 z-50 w-64 bg-[#151b2b] border-r border-white/5 flex flex-col h-screen overflow-y-auto transition-transform duration-300 ease-in-out
          md:translate-x-0 md:static md:sticky md:top-0
          ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"}
      `}
      >
        <div className="p-8 flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded bg-gradient-to-br from-[#E7B95A] to-[#F4D03F] flex items-center justify-center text-[#0C101C] font-bold">
              I
            </div>
            <div>
              <h1 className="font-bold text-lg leading-none">IEEE Admin</h1>
              <span className="text-[10px] text-gray-500 uppercase tracking-wider">
                Control Panel
              </span>
            </div>
          </div>
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <X size={24} />
          </button>
        </div>

        <nav className="flex-1 px-4 space-y-2">
          <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold bg-[#E7B95A] text-[#0C101C]">
            <LayoutDashboard size={18} /> Overview
          </button>

          <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Personnel Management
          </div>

          <Link
            href="/admin/pengurus"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Users size={18} /> All Personnel
          </Link>
          <Link
            href="/admin/pengurus/add"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <UserPlus size={18} /> Add New
          </Link>

          <div className="mt-6 mb-2 px-4 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
            Content Management
          </div>

          <Link
            href="/admin/events/create"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Calendar size={18} /> New Event
          </Link>
          <Link
            href="/admin/news/create"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <Newspaper size={18} /> New News
          </Link>
          <Link
            href="/admin/gallery/create"
            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-bold text-gray-400 hover:bg-white/5 hover:text-white transition-all"
          >
            <ImageIcon size={18} /> New Gallery
          </Link>
        </nav>

        <div className="p-4 border-t border-white/5 mt-auto">
          <div className="flex items-center gap-3 mb-4 px-4">
            <div className="w-10 h-10 rounded-full bg-gray-700 overflow-hidden relative border border-white/10">
              <div className="w-full h-full flex items-center justify-center bg-[#E7B95A] text-[#0C101C] font-bold">
                {user.name.charAt(0)}
              </div>
            </div>
            <div className="overflow-hidden">
              <p className="text-sm font-bold truncate w-32">{user.name}</p>
              <p className="text-[10px] text-gray-500 truncate">{user.role}</p>
            </div>
          </div>
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-2 text-red-400 hover:bg-red-500/10 px-4 py-3 rounded-xl transition-all text-sm font-bold"
          >
            <LogOut size={18} /> Sign Out
          </button>
        </div>
      </aside>

      <main className="flex-1 p-4 md:p-10 overflow-y-auto w-full">
        <header className="flex justify-between items-center mb-10 gap-4">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="md:hidden p-2 bg-[#151b2b] rounded-lg text-[#E7B95A] border border-white/10 hover:bg-white/5"
            >
              <Menu size={24} />
            </button>
            <div>
              <h2 className="text-2xl md:text-3xl font-bold">Dashboard</h2>
              <p className="text-gray-400 text-xs md:text-sm mt-1">
                Welcome back, <b>{user.name}</b>.
                {loading && (
                  <span className="ml-2 text-xs text-[#E7B95A] animate-pulse">
                    Syncing data...
                  </span>
                )}
              </p>
            </div>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
          <StatCard
            title="Total Personnel"
            value={stats.totalMembers}
            subtitle="Registered Members"
            icon={Users}
            color="text-blue-400"
            bg="bg-blue-500/10"
          />
          <StatCard
            title="Departments"
            value={stats.totalDivisions}
            subtitle="Operational divisions"
            icon={LayoutDashboard}
            color="text-purple-400"
            bg="bg-purple-500/10"
          />
          <StatCard
            title="Daily Absents"
            value="Absents ?? !!"
            subtitle="Absent in a web??"
            icon={FileText}
            color="text-[#0C101C]"
            bg="bg-[#E7B95A]"
            href="/admin/absent/create"
          />
        </div>

        <div className="bg-[#151b2b] border border-white/5 rounded-3xl overflow-hidden flex flex-col min-h-[500px]">
          <div className="flex border-b border-white/5 px-4 md:px-6 pt-6 gap-2 overflow-x-auto">
            <TabButton
              active={activeTab === "events"}
              onClick={() => setActiveTab("events")}
              label="Events"
              icon={Calendar}
              count={events.length}
            />
            <TabButton
              active={activeTab === "news"}
              onClick={() => setActiveTab("news")}
              label="News"
              icon={Newspaper}
              count={news.length}
            />
            <TabButton
              active={activeTab === "gallery"}
              onClick={() => setActiveTab("gallery")}
              label="Gallery"
              icon={ImageIcon}
              count={gallery.length}
            />
          </div>

          <div className="p-4 md:p-6 flex flex-col md:flex-row gap-4 justify-between items-center bg-[#0C101C]/30">
            <div className="relative w-full md:w-64">
              <Search
                size={16}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500"
              />
              <input
                type="text"
                placeholder={`Search ${activeTab}...`}
                className="w-full bg-[#151b2b] border border-white/10 rounded-lg py-2 pl-9 pr-4 text-xs text-white focus:border-[#E7B95A] outline-none"
              />
            </div>
            <Link
              href={`/admin/${activeTab}/create`}
              className="w-full md:w-auto justify-center bg-[#E7B95A] text-[#0C101C] px-4 py-2 rounded-lg text-xs font-bold hover:bg-[#F4D03F] transition-colors flex items-center gap-2"
            >
              <Plus size={14} /> Add New
            </Link>
          </div>

          <div className="flex-1 p-4 md:p-6 overflow-x-auto">
            {loading ? (
              <div className="h-full flex flex-col items-center justify-center py-12">
                <Loader2 className="w-8 h-8 text-[#E7B95A] animate-spin mb-4" />
                <p className="text-gray-500 text-xs">
                  Loading data from database...
                </p>
              </div>
            ) : currentData.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 border-2 border-dashed border-white/5 rounded-xl">
                <FolderPlus size={48} className="text-gray-600 mb-4" />
                <h3 className="text-white font-bold mb-1">No items found</h3>
                <p className="text-gray-500 text-xs">
                  This folder is currently empty.
                </p>
              </div>
            ) : (
              <div className="space-y-2 min-w-[600px] md:min-w-0">
                <div className="grid grid-cols-12 gap-4 px-4 py-2 text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                  <div className="col-span-6 md:col-span-5">
                    Title / Caption
                  </div>
                  <div className="col-span-3">Date</div>
                  <div className="col-span-3">Author / Tag</div>
                  <div className="col-span-1 text-right">Action</div>
                </div>
                {displayedItems.map((item) => (
                  <div
                    key={item.id}
                    className="grid grid-cols-12 gap-4 px-4 py-4 bg-[#0C101C] border border-white/5 rounded-xl items-center hover:border-[#E7B95A]/30 transition-all group"
                  >
                    <div className="col-span-6 md:col-span-5 flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${activeTab === "events" ? "bg-blue-500/10 text-blue-400" : activeTab === "news" ? "bg-purple-500/10 text-purple-400" : "bg-green-500/10 text-green-400"}`}
                      >
                        {activeTab === "events" && <Calendar size={14} />}
                        {activeTab === "news" && <Newspaper size={14} />}
                        {activeTab === "gallery" && <ImageIcon size={14} />}
                      </div>
                      <div>
                        <h4 className="font-bold text-sm text-white line-clamp-1">
                          {item.title || item.caption || "Untitled"}
                        </h4>
                        <span className="text-[10px] text-gray-500 px-1.5 py-0.5 rounded bg-white/5 border border-white/5">
                          {item.category || item.tag || "General"}
                        </span>
                      </div>
                    </div>
                    <div className="col-span-3 text-xs text-gray-400">
                      {item.date}
                    </div>
                    <div className="col-span-3 text-xs text-gray-400">
                      {item.author || "Admin"}
                    </div>

                    <div className="col-span-1 text-right">
                      <button
                        onClick={() => handleDelete(item.id)}
                        disabled={isDeleting === item.id}
                        className="p-2 text-gray-600 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-all disabled:opacity-50"
                        title="Delete Item"
                      >
                        {isDeleting === item.id ? (
                          <Loader2 size={16} className="animate-spin" />
                        ) : (
                          <Trash2 size={16} />
                        )}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {currentData.length > 0 && (
            <div className="p-4 border-t border-white/5 flex justify-between items-center bg-[#0C101C]/30">
              <p className="text-xs text-gray-500">
                Showing <b>{startIndex + 1}</b> -{" "}
                <b>{Math.min(startIndex + itemsPerPage, currentData.length)}</b>{" "}
                of <b>{currentData.length}</b>
              </p>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevPage}
                  disabled={currentPage === 1}
                  className={`p-2 rounded-lg border border-white/10 transition-colors ${currentPage === 1 ? "text-gray-700 cursor-not-allowed" : "text-white hover:bg-white/10"}`}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={handleNextPage}
                  disabled={currentPage >= totalPages}
                  className={`p-2 rounded-lg border border-white/10 transition-colors ${currentPage >= totalPages ? "text-gray-700 cursor-not-allowed" : "text-white hover:bg-white/10"}`}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}

function TabButton({ active, onClick, label, icon: Icon, count }: any) {
  return (
    <button
      onClick={onClick}
      className={`pb-4 px-6 text-sm font-bold border-b-2 transition-all flex items-center gap-2 relative whitespace-nowrap ${active ? "text-[#E7B95A] border-[#E7B95A]" : "text-gray-500 border-transparent hover:text-white"}`}
    >
      <Icon size={16} />
      {label}
      {count > 0 && (
        <span
          className={`ml-2 px-1.5 py-0.5 rounded-full text-[10px] ${active ? "bg-[#E7B95A] text-[#0C101C]" : "bg-white/10 text-gray-400"}`}
        >
          {count}
        </span>
      )}
    </button>
  );
}

function StatCard({ title, value, subtitle, icon: Icon, color, bg }: any) {
  return (
    <div className="bg-[#151b2b] border border-white/5 rounded-3xl p-6 flex items-start justify-between hover:border-white/10 transition-colors shadow-lg">
      <div>
        <p className="text-gray-400 text-sm font-medium mb-1">{title}</p>
        <h3 className="text-3xl font-extrabold text-white mb-1">{value}</h3>
        <p className="text-[10px] text-gray-500">{subtitle}</p>
      </div>
      <div
        className={`w-12 h-12 rounded-2xl flex items-center justify-center ${bg} ${color}`}
      >
        <Icon size={24} />
      </div>
    </div>
  );
}
