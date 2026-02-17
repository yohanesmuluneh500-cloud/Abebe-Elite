import React, { useState, useEffect, useRef } from 'react';
import { ProgressMedia } from '../types';
import { supabase } from '../services/supabase';

const Progress: React.FC = () => {
  const [mediaItems, setMediaItems] = useState<ProgressMedia[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('progress_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (data) {
      setMediaItems(data.map(item => ({
        id: item.id,
        date: new Date(item.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
        dataUrl: item.media_url,
        type: item.media_type as 'image' | 'video'
      })));
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const fileExt = file.name.split('.').pop();
      const fileName = `${user.id}/${Math.random()}.${fileExt}`;
      const filePath = `progress/${fileName}`;

      // 1. Upload to Storage
      const { error: uploadError } = await supabase.storage
        .from('progress-media')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Get Public URL
      const { data: { publicUrl } } = supabase.storage
        .from('progress-media')
        .getPublicUrl(filePath);

      // 3. Save metadata to DB
      const { error: dbError } = await supabase.from('progress_logs').insert({
        user_id: user.id,
        media_url: publicUrl,
        media_type: file.type.startsWith('video/') ? 'video' : 'image',
        storage_path: filePath
      });

      if (dbError) throw dbError;
      
      fetchMedia();
    } catch (err: any) {
      alert("Failed to upload media: " + err.message);
    } finally {
      setIsUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const deleteItem = async (item: ProgressMedia) => {
    if (!confirm("Delete this progress record?")) return;

    try {
      const { data } = await supabase.from('progress_logs').select('storage_path').eq('id', item.id).single();
      
      if (data?.storage_path) {
        await supabase.storage.from('progress-media').remove([data.storage_path]);
      }
      
      await supabase.from('progress_logs').delete().eq('id', item.id);
      fetchMedia();
    } catch (err) {
      alert("Failed to delete record.");
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom duration-500 pb-20">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-oswald font-bold text-white uppercase tracking-tight">PROGRESS TRACKER</h2>
          <p className="text-blue-300/40 text-sm">Aesthetic documentation synced to your profile.</p>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          disabled={isUploading}
          className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-bold font-oswald tracking-widest flex items-center gap-2 transition-all shadow-lg shadow-blue-900/40 disabled:opacity-50"
        >
          {isUploading ? 'UPLOADING...' : 'LOG PROGRESS MEDIA'}
          <input type="file" ref={fileInputRef} onChange={handleFileUpload} accept="image/*,video/*" className="hidden" />
        </button>
      </div>

      {mediaItems.length === 0 ? (
        <div className="glass p-20 rounded-2xl border-dashed border-2 border-zinc-800 flex flex-col items-center justify-center text-center">
          <p className="text-blue-300/20 font-medium">No progress logs found in the cloud.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {mediaItems.map((item) => (
            <div key={item.id} className="glass rounded-xl overflow-hidden group border border-zinc-800/50 hover:border-blue-600/50 transition-all duration-300">
              <div className="aspect-[3/4] overflow-hidden relative bg-black">
                {item.type === 'image' ? (
                  <img src={item.dataUrl} alt={`Progress`} className="w-full h-full object-cover" />
                ) : (
                  <video src={item.dataUrl} controls className="w-full h-full object-cover" />
                )}
                <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity z-10">
                  <button onClick={() => deleteItem(item)} className="p-2 bg-red-600/80 hover:bg-red-600 text-white rounded-lg">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              <div className="p-4 bg-zinc-900/80 backdrop-blur-md">
                <span className="text-[10px] font-bold text-blue-500 tracking-widest uppercase block mb-1">DATE CAPTURED</span>
                <p className="text-white font-oswald text-lg">{item.date}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Progress;