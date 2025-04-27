
import React from 'react';

// Mock Calendar Events
export const mockEvents = [
  {
    id: '1',
    title: 'Team Standup',
    start: new Date().toISOString(),
    end: new Date(new Date().setHours(new Date().getHours() + 1)).toISOString(),
    location: 'Zoom Meeting',
    attendees: ['Alex', 'Jordan', 'Taylor'],
  },
  {
    id: '2',
    title: 'Product Review',
    start: new Date(new Date().setHours(new Date().getHours() + 3)).toISOString(),
    end: new Date(new Date().setHours(new Date().getHours() + 4)).toISOString(),
    location: 'Conference Room A',
    attendees: ['Morgan', 'Casey'],
  },
  {
    id: '3',
    title: 'Investor Call',
    start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 1);
      date.setHours(date.getHours() + 1);
      return date.toISOString();
    })(),
    attendees: ['Jamie', 'Robin'],
  },
  {
    id: '4',
    title: 'Quarterly Planning',
    start: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 2);
      date.setHours(date.getHours() + 3);
      return date.toISOString();
    })(),
    location: 'Main Conference Room',
    attendees: ['Leadership Team'],
  },
  {
    id: '5',
    title: '1:1 with Director',
    start: new Date(new Date().setDate(new Date().getDate() + 3)).toISOString(),
    end: (() => {
      const date = new Date();
      date.setDate(date.getDate() + 3);
      date.setMinutes(date.getMinutes() + 30);
      return date.toISOString();
    })(),
    location: 'Director\'s Office',
  },
];

// Mock Emails
export const mockEmails = [
  {
    id: '1',
    sender: 'Alex Wong',
    subject: 'Urgent: Meeting with Investors Tomorrow',
    preview: 'We need to prepare for the investor meeting tomorrow. Can we discuss the presentation today?',
    date: new Date().toISOString(),
    read: false,
    priority: 'high',
    starred: true,
  },
  {
    id: '2',
    sender: 'Morgan Lee',
    subject: 'Product Launch Timeline',
    preview: 'Here\'s the updated timeline for our Q2 product launch. Please review and provide feedback.',
    date: new Date(new Date().setHours(new Date().getHours() - 3)).toISOString(),
    read: false,
    priority: 'high',
    starred: false,
  },
  {
    id: '3',
    sender: 'Jordan Rivera',
    subject: 'Weekly Report - Marketing Team',
    preview: 'Attached is the weekly performance report for the marketing campaigns.',
    date: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    read: true,
    priority: 'medium',
    starred: true,
  },
  {
    id: '4',
    sender: 'Taylor Smith',
    subject: 'New Office Space Options',
    preview: 'I\'ve found several promising office spaces for our expansion. Would you like to schedule viewings?',
    date: new Date(new Date().setDate(new Date().getDate() - 2)).toISOString(),
    read: true,
    priority: 'low',
    starred: false,
  },
  {
    id: '5',
    sender: 'Casey Johnson',
    subject: 'Recruiting Update - Engineering Team',
    preview: 'We have 3 strong candidates for the Senior Developer role. Interview schedules attached.',
    date: new Date(new Date().setDate(new Date().getDate() - 3)).toISOString(),
    read: true,
    priority: 'medium',
    starred: false,
  },
];

// Mock Tasks
export const mockTasks = [
  {
    id: '1',
    title: 'Prepare investor presentation',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString(),
    priority: 'high',
    source: 'From email: Urgent: Meeting with Investors Tomorrow',
  },
  {
    id: '2',
    title: 'Review Q2 product launch timeline',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 2)).toISOString(),
    priority: 'high',
    source: 'From email: Product Launch Timeline',
  },
  {
    id: '3',
    title: 'Schedule office space viewings',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 4)).toISOString(),
    priority: 'medium',
    source: 'From email: New Office Space Options',
  },
  {
    id: '4',
    title: 'Submit monthly expense report',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 7)).toISOString(),
    priority: 'medium',
  },
  {
    id: '5',
    title: 'Review engineering candidates',
    completed: true,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)).toISOString(),
    priority: 'low',
    source: 'From email: Recruiting Update - Engineering Team',
  },
  {
    id: '6',
    title: 'Finalize budget for Q3',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 10)).toISOString(),
    priority: 'high',
  },
];

// Mock Morning Brief
export const mockMorningBrief = {
  date: new Date().toLocaleDateString(),
  weatherSummary: 'Sunny, 72°F',
  topPriorityTasks: [
    'Prepare investor presentation',
    'Review Q2 product launch timeline',
  ],
  upcomingMeetings: [
    { title: 'Team Standup', time: '10:00 AM' },
    { title: 'Product Review', time: '2:00 PM' },
  ],
  unreadImportantEmails: 2,
};

// Mock Daily Recap
export const mockDailyRecap = {
  date: new Date().toLocaleDateString(),
  completedTasks: 3,
  pendingTasks: 4,
  meetingsAttended: 2,
  upcomingTomorrow: [
    { type: 'meeting', title: 'Investor Call', time: '11:00 AM' },
    { type: 'task', title: 'Prepare investor presentation', dueTime: 'End of day' },
  ],
};
