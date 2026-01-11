"use server";

import { prisma } from "@/lib/prisma";

export async function getDashboardStats() {
  try {
 
    const totalMembers = await prisma.officer.count();
    
    const distinctDivisions = await prisma.officer.findMany({
      where: { division: { notIn: ["Executive Board", "Advisory Board"] } },
      distinct: ["division"],
      select: { division: true }
    });
    const totalDivisions = distinctDivisions.length;

    const countEvents = await prisma.event.count();
    const countNews = await prisma.news.count(); 
    const countGallery = await prisma.gallery.count();
    const totalContent = countEvents + countNews + countGallery;

    const recentEvents = await prisma.event.findMany({
      take: 5, orderBy: { createdAt: 'desc' }
    });
    
    const recentNews = await prisma.news.findMany({
      take: 5, orderBy: { date: 'desc' }
    });

    const recentGallery = await prisma.gallery.findMany({
      take: 5, orderBy: { date: 'desc' }
    });

    return {
      success: true,
      stats: { totalMembers, totalDivisions, totalContent },
      data: {
        events: recentEvents.map(e => ({ id: e.id, title: e.title, date: e.date, category: e.category, author: "Admin" })),
        news: recentNews.map(n => ({ id: n.id, title: n.title, date: n.date, category: "News", author: n.author })),
        gallery: recentGallery.map(g => ({ id: g.id, title: g.caption, date: g.date, category: g.tag, author: g.author })),
      }
    };
  } catch (error) {
    console.error("Error fetching stats:", error);
    return { success: false };
  }
}