import React, { useState } from 'react';

export default function ResumeInputForm({ onSubmit, isLoading }) {
  const [formData, setFormData] = useState({
    targetRole: '',
    experienceLevel: 'Mid',
    rawResume: ''
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit} className="card-solid flex flex-col gap-4">
      <div>
        <label className="block font-semibold mb-1">Target Role</label>
        <input 
          type="text" 
          required
          placeholder="e.g. Senior Product Manager" 
          className="w-full border-2 border-border rounded-md p-2 outline-none focus:border-primary"
          value={formData.targetRole}
          onChange={(e) => setFormData({...formData, targetRole: e.target.value})}
        />
      </div>

      <div>
        <label className="block font-semibold mb-1">Experience Level</label>
        <select 
          className="w-full border-2 border-border rounded-md p-2 outline-none focus:border-primary"
          value={formData.experienceLevel}
          onChange={(e) => setFormData({...formData, experienceLevel: e.target.value})}
        >
          <option value="Junior">Junior (0-2 years)</option>
          <option value="Mid">Mid (3-5 years)</option>
          <option value="Senior">Senior (5+ years)</option>
        </select>
      </div>

      <div>
        <label className="block font-semibold mb-1">Raw Resume Content</label>
        <textarea 
          required
          rows={8}
          placeholder="Paste your raw resume text here..." 
          className="w-full border-2 border-border rounded-md p-2 outline-none focus:border-primary resize-y"
          value={formData.rawResume}
          onChange={(e) => setFormData({...formData, rawResume: e.target.value})}
        />
      </div>

      <button type="submit" disabled={isLoading} className="btn-primary mt-2">
        {isLoading ? 'Analyzing...' : 'Analyze Resume'}
      </button>
    </form>
  );
}
