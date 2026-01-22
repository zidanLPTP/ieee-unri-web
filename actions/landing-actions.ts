"use server";

import { prisma } from "@/lib/prisma";

export async function getPublicEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    return events;
  } catch (error) {
    console.error("Gagal ambil events:", error);
    return [];
  }
}

export async function getPublicNews() {
  try {
    const news = await prisma.news.findMany({
      take: 3, 
      orderBy: { date: 'desc' },
    });
    return news;
  } catch (error) {
    console.error("Gagal ambil news:", error);
    return [];
  }
}


export async function getWritersCount() {
  try {
  
    const writers = await prisma.news.groupBy({
      by: ['author'],
    });
    return writers.length; 
  } catch (error) {
    return 0;
  }
}

export async function getPublicGallery(page: number = 1, limit: number = 8) {
  try {
    const skip = (page - 1) * limit;
    
    const [data, total] = await prisma.$transaction([
      prisma.gallery.findMany({
        skip: skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.gallery.count(),
    ]);

    return { 
      data, 
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Gagal ambil gallery:", error);
    return { data: [], total: 0, totalPages: 0 };
  }
}

export async function getNewsById(id: number) {
  try {
    const newsItem = await prisma.news.findUnique({
      where: { id: Number(id) }, 
    });

    if (!newsItem) return null;

    return {
      id: newsItem.id,
      title: newsItem.title,
      content: newsItem.content,
      image: newsItem.image,
      date: newsItem.date, 
      category: newsItem.category,
      author: newsItem.author || "IEEE Team", 
    };
  } catch (error) {
    console.error("Error fetching news detail:", error);
    return null;
  }
}

export async function getPublicNewsPaginated(page: number = 1, limit: number = 8) {
  try {
    const skip = (page - 1) * limit;
    
    const [data, total] = await prisma.$transaction([
      prisma.news.findMany({
        skip: skip,
        take: limit,
        orderBy: { date: 'desc' },
      }),
      prisma.news.count(),
    ]);

    return { 
      data, 
      total,
      totalPages: Math.ceil(total / limit)
    };
  } catch (error) {
    console.error("Gagal ambil news page:", error);
    return { data: [], total: 0, totalPages: 0 };
  }
}

export async function getAllEvents() {
  try {
    const events = await prisma.event.findMany({
      orderBy: { date: 'asc' },
    });
    return events;
  } catch (error) {
    console.error("Gagal ambil all events:", error);
    return [];
  }
}

export async function getAllOfficers() {
  try {
    const officers = await prisma.officer.findMany({
      where: { isActive: true },
      orderBy: { order: 'asc' },
    });
    return officers;
  } catch (error) {
    console.error("Gagal ambil officers:", error);
    return [];
  }
}