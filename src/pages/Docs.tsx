import React from "react";
import DashboardLayout from "@/components/dashboard/DashboardLayout";

const Docs = () => (
  <DashboardLayout>
    <div className="max-w-4xl mx-auto py-10 px-6">
      <h1 className="text-4xl font-extrabold text-indigo-700 mb-6 text-center">
        TINA Assistant Documentation
      </h1>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">What is TINA?</h2>
        <p className="text-gray-600 leading-relaxed">
          <span className="font-semibold">TINA</span> is your AI-powered executive assistant that helps you manage your emails, schedule meetings, create tasks, and automate your daily workflow — all with simple, natural commands.
        </p>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Use TINA</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Type or speak your request in the AI Command box on the dashboard.</li>
          <li>Be clear and specific for the best results. Example: <span className="font-mono bg-gray-100 px-2 py-1 rounded">"Summarize my unread emails."</span></li>
          <li>Use voice input by clicking the microphone icon if available.</li>
          <li>TINA will understand your intent and take action or reply with the information you need.</li>
        </ul>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Available Commands</h2>

        {/* Command Groups */}
        <div className="space-y-8">
          {/* Schedule Meeting */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">1. Schedule a Meeting</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>"Schedule a meeting with John tomorrow at 3PM about the project update."</li>
              <li>"Set up a meeting for Monday, 9AM to 10AM, titled 'Team Standup', invite alice@example.com and bob@example.com."</li>
              <li>"Book a meeting at our office next Friday at noon with the design team."</li>
            </ul>
          </div>

          {/* Create Task */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">2. Create a Task</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>"Create a task to finish the budget report by next Thursday."</li>
              <li>"Add a task called 'Buy groceries' with a note: Milk, Bread, Eggs."</li>
              <li>"Remind me to call the bank on Monday."</li>
            </ul>
          </div>

          {/* Complete Task */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">3. Complete a Task</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>"Mark the task with ID abc123 as complete."</li>
              <li>"Complete the task xyz789."</li>
              <li>"Finish task 5kLmn0."</li>
            </ul>
          </div>

          {/* Summarize Email */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">4. Summarize Emails</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>"Summarize my unread emails."</li>
              <li>"Show me the latest 5 unread emails."</li>
              <li>"Give me a summary of new emails with page size 20."</li>
            </ul>
          </div>

          {/* Draft Email */}
          <div>
            <h3 className="text-xl font-semibold text-indigo-600 mb-2">5. Draft an Email</h3>
            <ul className="list-disc pl-6 text-gray-600 space-y-1">
              <li>"Draft an email to jane@example.com with subject 'Meeting Notes' and body 'Hi Jane, here are the notes from our meeting.'"</li>
              <li>"Create an email draft to send to bob@example.com, subject 'Vacation Request', saying 'I'd like to request time off from June 10 to June 20.'"</li>
              <li>"Prepare an email to support@company.com with subject 'Issue Report' and message 'I am facing a login issue.'"</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">🔍 Tips for Best Results</h2>
        <ul className="list-disc pl-6 text-gray-600 space-y-2">
          <li>Use natural, conversational language when possible.</li>
          <li>Mention specific names, dates, times, or email addresses where needed.</li>
          <li>Example: <span className="font-mono bg-gray-100 px-2 py-1 rounded">"Draft an email to Alex about the Q2 report."</span></li>
          <li>Keep commands short and focused for faster results.</li>
        </ul>
      </section>
    </div>
  </DashboardLayout>
);

export default Docs;
