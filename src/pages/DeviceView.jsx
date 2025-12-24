import React from 'react';
import { useParams, Link } from 'react-router';
import { ArrowLeft, ExternalLink } from 'lucide-react';

const DeviceView = () => {
  const { ip } = useParams();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center justify-between mb-4">
        <Link to="/" className="flex items-center text-gray-400 hover:text-white transition-colors">
          <ArrowLeft size={20} className="mr-2" />
          Back to Dashboard
        </Link>
        <div className="text-white font-mono text-sm bg-gray-800 px-3 py-1 rounded-full">{ip}</div>
        <button
          onClick={() => window.api?.window?.openDevice(`http://${ip}`)}
          className="text-orange-500 hover:text-orange-400 flex items-center text-sm font-medium transition-colors cursor-pointer"
        >
          Open Window
          <ExternalLink size={16} className="ml-1" />
        </button>
      </div>
      {/* The WLED UI is responsive, so we can embed it directly. */}
      <div className="flex-1 bg-black rounded-xl overflow-hidden shadow-2xl border border-gray-800 relative">
        <iframe src={`http://${ip}`} className="w-full h-full border-0 block" title={`WLED Interface ${ip}`} />
      </div>
    </div>
  );
};

export default DeviceView;
