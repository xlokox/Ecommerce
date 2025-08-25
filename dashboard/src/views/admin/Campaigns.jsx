import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { list_campaigns, create_campaign, update_campaign, delete_campaign, messageClear } from '../../store/Reducers/campaignReducer';
import { IoMdImages } from 'react-icons/io';
import toast from 'react-hot-toast';

export default function Campaigns() {
  const dispatch = useDispatch();
  const { items, loader, successMessage, errorMessage } = useSelector(s => s.campaign);

  const [form, setForm] = useState({ title: '', subtitle: '', titleSize: 48, textColor: '#ffffff', ctaText: '', ctaLink: '', order: 0, active: true, image: null });
  const [preview, setPreview] = useState('');
  const [editingId, setEditingId] = useState(null);

  useEffect(()=>{ dispatch(list_campaigns()); }, [dispatch]);
  useEffect(()=>{ if(successMessage){ toast.success(successMessage); dispatch(messageClear()); } if(errorMessage){ toast.error(errorMessage); dispatch(messageClear()); } },[successMessage,errorMessage,dispatch]);

  const onImage = (e)=>{ const f = e.target.files?.[0]; if(!f) return; setForm(prev=>({...prev, image:f})); setPreview(URL.createObjectURL(f)); };
  const onChange = (e)=>{ const {name,value,type,checked} = e.target; setForm(prev=>({...prev, [name]: type==='checkbox'? checked : value })); };

  const onSubmit = (e)=>{
    e.preventDefault();
    const fd = new FormData();
    Object.entries(form).forEach(([k,v])=>{ if(v!==null && v!==undefined) fd.append(k, v); });
    if (editingId) { dispatch(update_campaign({ id: editingId, formData: fd })); } else { dispatch(create_campaign(fd)); }
    setEditingId(null); setPreview(''); setForm({ title: '', subtitle: '', titleSize: 48, textColor: '#ffffff', ctaText: '', ctaLink: '', order: 0, active: true, image: null });
  };

  const startEdit = (c)=>{ setEditingId(c._id); setForm({ title: c.title, subtitle: c.subtitle||'', titleSize: c.titleSize||48, textColor: c.textColor||'#ffffff', ctaText: c.ctaText||'', ctaLink: c.ctaLink||'', order: c.order||0, active: !!c.active, image: null }); setPreview(c.image); };

  return (
    <div className='px-2 lg:px-7 pt-5'>
      <div className='w-full p-4 bg-[#6a5fdf] rounded-md'>
        <div className='flex justify-between items-center pb-4'>
          <h1 className='text-[#d0d2d6] text-xl font-semibold'>Campaigns</h1>
          <button
            type='button'
            onClick={async ()=>{
              const defaults = [
                { title:'Our Latest Deals', image:'https://images.unsplash.com/photo-1512436991641-6745cdb1723f?auto=format&fit=crop&w=2940&q=80', textColor:'#ffffff', titleSize:48, ctaText:'Shop Now', ctaLink:'/products', order:0, active:true },
                { title:'Our Newst Electronics', image:'https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=2940&q=80', textColor:'#ffffff', titleSize:48, ctaText:'Browse Electronics', ctaLink:'/products?category=Electronics', order:1, active:true },
                { title:'Our Newst Toys', image:'https://images.unsplash.com/photo-1596461404969-9ae70f2830c1?auto=format&fit=crop&w=1600&q=80', textColor:'#ffffff', titleSize:48, ctaText:'Browse Toys', ctaLink:'/products?category=Toys', order:2, active:true },
              ];
              for (const d of defaults){
                const fd = new FormData();
                Object.entries(d).forEach(([k,v])=>fd.append(k,v));
                await dispatch(create_campaign(fd));
              }
              dispatch(list_campaigns());
            }}
            className='bg-[#7866ff] hover:bg-[#6757ff] text-white px-4 py-2 rounded-md'
          >
            Add default hero campaigns
          </button>
        </div>
        <form onSubmit={onSubmit} className='grid grid-cols-1 md:grid-cols-2 gap-4 mb-6 text-[#d0d2d6]'>
          <div className='flex flex-col gap-1'>
            <label>Title</label>
            <input name='title' value={form.title} onChange={onChange} className='px-3 py-2 bg-[#6a5fdf] border border-slate-700 rounded-md'/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Subtitle</label>
            <input name='subtitle' value={form.subtitle} onChange={onChange} className='px-3 py-2 bg-[#6a5fdf] border border-slate-700 rounded-md'/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Title Size (px)</label>
            <input type='number' min='8' max='200' name='titleSize' value={form.titleSize} onChange={onChange} className='px-3 py-2 bg-[#6a5fdf] border border-slate-700 rounded-md'/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Text Color</label>
            <input type='color' name='textColor' value={form.textColor} onChange={onChange} className='h-10 w-20 p-0 border border-slate-700 rounded-md'/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>CTA Text</label>
            <input name='ctaText' value={form.ctaText} onChange={onChange} className='px-3 py-2 bg-[#6a5fdf] border border-slate-700 rounded-md'/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>CTA Link</label>
            <input name='ctaLink' value={form.ctaLink} onChange={onChange} className='px-3 py-2 bg-[#6a5fdf] border border-slate-700 rounded-md' placeholder='/products?category=Electronics'/>
          </div>
          <div className='flex flex-col gap-1'>
            <label>Order</label>
            <input type='number' name='order' value={form.order} onChange={onChange} className='px-3 py-2 bg-[#6a5fdf] border border-slate-700 rounded-md'/>
          </div>
          <div className='flex items-center gap-2'>
            <input id='active' type='checkbox' name='active' checked={form.active} onChange={onChange}/>
            <label htmlFor='active'>Active</label>
          </div>
          <div className='flex flex-col gap-1'>
            <label htmlFor='image'>Image</label>
            <label htmlFor='image' className='flex justify-center items-center h-[140px] cursor-pointer border border-dashed hover:border-red-500 w-full'>
              <span><IoMdImages/></span>
            </label>
            <input id='image' type='file' className='hidden' onChange={onImage}/>
            {preview && <img src={preview} alt='preview' className='w-full h-[180px] object-cover rounded-sm'/>}
          </div>
          <div>
            <button disabled={loader} className='bg-red-500 px-6 py-2 rounded-md'>
              {editingId ? 'Update Campaign' : 'Create Campaign'}
            </button>
          </div>
        </form>

        <div className='grid md:grid-cols-3 sm:grid-cols-2 grid-cols-1 gap-4'>
          {items.map(c => (
            <div key={c._id} className='bg-[#5a51d8] rounded-md overflow-hidden'>
              <img src={c.image} alt={c.title} className='w-full h-[180px] object-cover'/>
              <div className='p-3 text-[#d0d2d6]'>
                <div className='flex justify-between items-center'>
                  <h3 className='font-semibold'>{c.title}</h3>
                  <span className='text-xs'>{c.active ? 'Active' : 'Inactive'}</span>
                </div>
                <p className='text-sm opacity-80'>{c.subtitle}</p>
                <div className='flex gap-2 mt-2'>
                  <button className='bg-green-600 px-3 py-1 rounded' onClick={()=>startEdit(c)}>Edit</button>
                  <button className='bg-red-600 px-3 py-1 rounded' onClick={()=>dispatch(delete_campaign(c._id))}>Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

