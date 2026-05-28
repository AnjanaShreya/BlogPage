import React from 'react';
import { 
  FaGavel, 
  FaCheckCircle, 
  FaEdit, 
  FaCalendarAlt, 
  FaCog, 
  FaTimes,
  FaBookOpen
} from 'react-icons/fa';

const HelpModal = ({ showHelp, onClose, activeHelpTab, setActiveHelpTab }) => {
  if (!showHelp) return null;

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl border border-gray-200 w-full max-w-4xl shadow-2xl h-[75vh] flex overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Modal Sidebar */}
        <div className="w-60 min-w-[14rem] max-w-[14rem] flex-shrink-0 bg-gray-50 border-r border-gray-200/80 p-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-8">
              <FaGavel className="text-xl text-[#8C6D23]" />
              <div>
                <h4 className="text-sm font-extrabold text-[#002a32] tracking-tight font-serif">LexScripta Help</h4>
                <span className="text-[9px] font-bold text-gray-400 uppercase tracking-widest block leading-none">Console Guide</span>
              </div>
            </div>
            
            <nav className="space-y-1">
              {[
                { id: 'overview', label: 'Platform Overview', icon: <FaBookOpen /> },
                { id: 'approvals', label: 'Approvals Manager', icon: <FaCheckCircle /> },
                { id: 'reviews', label: 'Peer Reviews Hub', icon: <FaEdit /> },
                { id: 'events', label: 'Academic Programs', icon: <FaCalendarAlt /> },
                { id: 'settings', label: 'Sub-Admins & Roles', icon: <FaCog /> },
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveHelpTab(tab.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-bold transition-all text-left cursor-pointer ${
                    activeHelpTab === tab.id
                      ? 'bg-[#E0F2F1] text-[#004D40] shadow-sm'
                      : 'text-gray-500 hover:bg-gray-50 hover:text-[#002a32]'
                  }`}
                >
                  <span className="text-sm">{tab.icon}</span>
                  <span>{tab.label}</span>
                </button>
              ))}
            </nav>
          </div>

          {/* Version Info */}
          <div className="text-[10px] text-gray-400 font-bold tracking-wider">
            <span>SYSTEM CONSOLE V1.4.0</span>
          </div>
        </div>

        {/* Modal Body */}
        <div className="flex-grow flex flex-col min-w-0">
          {/* Header */}
          <div className="p-6 border-b border-gray-150 flex justify-between items-center bg-gray-50/50">
            <div>
              <h3 className="text-lg font-bold font-serif text-[#002a32]">
                {activeHelpTab === 'overview' && 'LexScripta Platform Overview'}
                {activeHelpTab === 'approvals' && 'Approvals Manager Reference'}
                {activeHelpTab === 'reviews' && 'Peer Reviews Hub Guide'}
                {activeHelpTab === 'events' && 'Academic Programs & Events Hub'}
                {activeHelpTab === 'settings' && 'Sub-Admins Access Control'}
              </h3>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-wider block mt-1">Documentation & FAQs</span>
            </div>
            <button
              onClick={onClose}
              className="w-8 h-8 rounded-lg bg-gray-100 text-gray-500 hover:text-red-500 hover:bg-red-50 transition flex items-center justify-center cursor-pointer"
            >
              <FaTimes />
            </button>
          </div>

          {/* Tab Contents */}
          <div className="p-6 overflow-y-auto space-y-6 text-left flex-grow text-sm text-gray-600 font-medium leading-relaxed">
            {activeHelpTab === 'overview' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  Welcome to the **LexScripta Administrator Board**. This administrative console is built to organize peer-reviewed legal journals, articles, academic programs, and sub-admin controls seamlessly.
                </p>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-[#E0F2F1]/20 border border-[#B2DFDB]/30 rounded-xl p-4">
                    <h4 className="font-bold text-[#004D40] text-xs uppercase tracking-wider mb-1">General Operations</h4>
                    <p className="text-xs text-gray-500">Draft, publish, and review articles directly through clean dashboards with real-time statistics.</p>
                  </div>
                  <div className="bg-[#8C6D23]/5 border border-[#8C6D23]/25 rounded-xl p-4">
                    <h4 className="font-bold text-[#8C6D23] text-xs uppercase tracking-wider mb-1">Academic Initiatives</h4>
                    <p className="text-xs text-gray-500">Coordinate and list summer/winter legal cycles, mock trials, and student internships.</p>
                  </div>
                </div>
              </div>
            )}

            {activeHelpTab === 'approvals' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  The **Approvals Console** manages submitted student and professional journals prior to active publishing.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-gray-500">
                  <li><strong className="text-gray-700">Sorting & Filtering</strong>: Use the dynamic, compact filter dropdowns to segregate by law subject categories or sort by submission dates.</li>
                  <li><strong className="text-gray-700">Approve Submission</strong>: Transitions drafts into public publications instantly.</li>
                  <li><strong className="text-gray-700">Reject/Hold</strong>: Archives or reverts publications requesting improvements.</li>
                </ul>
              </div>
            )}

            {activeHelpTab === 'reviews' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  The **Peer Reviews Hub** serves as a draft checkpoint before articles reach the formal approval workspace.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-gray-500">
                  <li><strong className="text-gray-700">Draft Assessments</strong>: Enables delegated Chief Editors and Reviewers to annotate comments, edit grammar, and rate legal arguments.</li>
                  <li><strong className="text-gray-700">Live Editing</strong>: Open the dynamic inline editor inside the modal to make direct amendments quickly.</li>
                </ul>
              </div>
            )}

            {activeHelpTab === 'events' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  The **Events Hub** organizes and showcases academic cycles and legal opportunities:
                </p>
                <div className="space-y-3 text-xs text-gray-500">
                  <div className="flex gap-2">
                    <span className="font-bold text-[#002a32] min-w-[100px]">Summer/Winter</span>
                    <span>Academic certifications, semester research internships, and specialized study cycles.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#002a32] min-w-[100px]">Moot Courts</span>
                    <span>Compilations of simulated litigation arguments, team size constraints, and prize pools.</span>
                  </div>
                  <div className="flex gap-2">
                    <span className="font-bold text-[#002a32] min-w-[100px]">Live Sessions</span>
                    <span>Webinars, expert workshops, Zoom meeting links, and speaker panels.</span>
                  </div>
                </div>
              </div>
            )}

            {activeHelpTab === 'settings' && (
              <div className="space-y-4">
                <p className="text-gray-700">
                  The **Sub-Admins Console** controls administrative authorization permissions.
                </p>
                <ul className="list-disc pl-5 space-y-2 text-xs text-gray-500">
                  <li><strong className="text-gray-700">Add Sub-Admin</strong>: Enter a candidate email, assign a role, and dispatch the invitation.</li>
                  <li><strong className="text-gray-700">Roles Access</strong>: Chief Editor gets unlimited access; Blog Reviewer is restricted to articles; and Coordinators manage SW Programs/Moots.</li>
                  <li><strong className="text-gray-700">Password Setup</strong>: Invited sub-admins automatically receive an email dispatch containing a private token link to configure their passwords and register.</li>
                </ul>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-4 border-t border-gray-150 flex justify-end bg-gray-50/50">
            <button
              onClick={onClose}
              className="px-5 py-2 bg-[#002a32] hover:bg-[#003d49] text-white rounded-xl text-xs font-bold transition shadow-sm cursor-pointer"
            >
              Got It, Close Guide
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HelpModal;
