"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { doc, getDoc, updateDoc, serverTimestamp, Timestamp, writeBatch, collection, query, where, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase/client";
import BackButton from "@/components/BackButton";
import AuthGate from "@/components/AuthGate";
import { Pig, Milestone } from "@/lib/types/pig";
import { uploadImage } from "@/lib/firebase/storage";
import toast from "react-hot-toast";
import ImageUploader from "@/components/admin/ImageUploader";
import { milestoneTemplates } from "@/lib/milestoneTemplates";
import { format } from 'date-fns';

const PlusIcon = () => <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" /></svg>;
const TrashIcon = () => <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>;

export default function EditPigPage() {
  const router = useRouter();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const [form, setForm] = useState<Partial<Pig>>({});
  
  const [selectedTemplate, setSelectedTemplate] = useState<string>(milestoneTemplates[1].key);
  const [customDescription, setCustomDescription] = useState('');
  
  useEffect(() => {
    if (!id) return;
    const fetchPig = async () => {
      const snap = await getDoc(doc(db, "pigs", id));
      if (!snap.exists()) {
        toast.error("Este cerdito no fue encontrado.");
        router.push("/admin/pigs");
        return;
      }
      const data = snap.data() as Pig;
      setForm({ 
        ...data,
        birthDate: data.birthDate ? format(data.birthDate.toDate(), 'yyyy-MM-dd') : '' 
      });
      setLoading(false);
    };
    fetchPig();
  }, [id, router]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const isCheckbox = type === 'checkbox';
    const checked = (e.target as HTMLInputElement).checked;

    setForm(prev => ({ ...prev, [name]: isCheckbox ? checked : ((name === 'priceCRC' || name === 'ageMonths') ? Number(value) : value) }));
  };

  const handleImagesChange = (files: File[], imageUrls: string[]) => {
    setImageFiles(files);
    setForm(prev => ({...prev, images: imageUrls.filter(url => url.startsWith('http'))}));
  };

  const handleAddMilestone = () => {
    const template = milestoneTemplates.find(t => t.key === selectedTemplate);
    if (!template) return;
    const milestoneToAdd: Milestone = {
      id: Date.now().toString(),
      date: Timestamp.now(),
      title: template.title,
      description: customDescription || template.defaultDescription,
      icon: template.icon,
    };
    setForm(prev => ({ ...prev, milestones: [...(prev.milestones || []), milestoneToAdd] }));
    setCustomDescription('');
  };

  const handleRemoveMilestone = (milestoneId: string) => {
    setForm(prev => ({ ...prev, milestones: (prev.milestones || []).filter(m => m.id !== milestoneId) }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    const toastId = toast.loading('Guardando expediente...');
    try {
      // Si se marcó como "Cerdito del Mes", primero quitamos la marca a cualquier otro
      if (form.isPigOfTheMonth) {
        toast.loading('Asignando como Cerdito del Mes...', { id: toastId });
        const batch = writeBatch(db);
        const q = query(collection(db, "pigs"), where("isPigOfTheMonth", "==", true));
        const currentFeatured = await getDocs(q);
        currentFeatured.forEach(doc => {
            batch.update(doc.ref, { isPigOfTheMonth: false });
        });
        await batch.commit();
      }

      let finalImageUrls = form.images || [];
      if (imageFiles.length > 0) {
        toast.loading(`Subiendo ${imageFiles.length} imágenes...`, { id: toastId });
        const newImageUrls = await Promise.all(imageFiles.map(file => uploadImage(file, 'pigs')));
        finalImageUrls = [...(form.images || []), ...newImageUrls];
      }
      
      const pigRef = doc(db, "pigs", id);
      const dataToUpdate = {
        ...form,
        name_lowercase: form.name?.toLowerCase(),
        images: finalImageUrls,
        birthDate: form.birthDate ? Timestamp.fromDate(new Date(form.birthDate as string)) : null,
        updatedAt: serverTimestamp(),
      };
      
      await updateDoc(pigRef, dataToUpdate);
      
      toast.success('¡Expediente actualizado!', { id: toastId });
      router.push("/admin/pigs");

    } catch (err: any) {
      console.error(err);
      toast.error(`Error: ${err.message}`, { id: toastId });
      setIsSaving(false);
    }
  };
  
  if (loading) return <AuthGate><p className="p-8 text-center">Cargando expediente...</p></AuthGate>;
  
  return (
    <AuthGate>
      <div className="max-w-4xl mx-auto">
        <div className="mb-4"><BackButton href="/admin/pigs" label="← Volver a Cerditos" /></div>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="card p-6">
            <header className="mb-6 flex justify-between items-start">
              <h1 className="text-2xl font-extrabold tracking-tight text-[#8B5E34]">Editando a {form.name} 🐷</h1>
              {/* --- NUEVO INTERRUPTOR "CERDITO DEL MES" --- */}
              <label htmlFor="isPigOfTheMonth" className="flex items-center cursor-pointer">
                <span className="mr-3 text-sm font-semibold text-yellow-600">¿Cerdito del Mes?</span>
                <div className="relative">
                  <input type="checkbox" id="isPigOfTheMonth" name="isPigOfTheMonth" checked={!!form.isPigOfTheMonth} onChange={handleChange} className="sr-only" />
                  <div className="block bg-gray-200 w-12 h-7 rounded-full"></div>
                  <div className={`dot absolute left-1 top-1 bg-white w-5 h-5 rounded-full transition-transform ${form.isPigOfTheMonth ? 'translate-x-full !bg-yellow-400' : ''}`}></div>
                </div>
              </label>
            </header>
            {/* ... resto del formulario principal ... */}
            <div className="space-y-6">
              <ImageUploader existingImages={form.images || []} onImagesChange={handleImagesChange} />
              <div><label>Nombre</label><input type="text" name="name" value={form.name || ''} onChange={handleChange} className="mt-1 input-style" required /></div>
              <div className="grid grid-cols-2 gap-4">
                  <div><label>Precio (₡)</label><input type="number" name="priceCRC" value={form.priceCRC || 0} onChange={handleChange} className="mt-1 input-style" required /></div>
                  <div><label>Edad (meses)</label><input type="number" name="ageMonths" value={form.ageMonths || 0} onChange={handleChange} className="mt-1 input-style" required /></div>
              </div>
              <div><label>Sexo</label><select name="sex" value={form.sex || ''} onChange={handleChange} className="mt-1 input-style" required><option value="">Seleccionar...</option><option value="hembra">Hembra</option><option value="macho">Macho</option></select></div>
              <div><label>Descripción</label><textarea name="description" value={form.description || ''} onChange={handleChange} className="mt-1 input-style" rows={4} /></div>
            </div>
          </div>
          
          <div className="card p-6">
            <header className="mb-6 border-b pb-4"><h2 className="text-xl font-bold text-[#8B5E34]">Expediente Digital</h2></header>
            {/* ... resto del formulario de hitos ... */}
             <div className="space-y-6">
              <div><label htmlFor="birthDate">Fecha de Nacimiento</label><input id="birthDate" type="date" name="birthDate" value={form.birthDate as string || ''} onChange={handleChange} className="mt-1 input-style"/></div>
              <div>
                <h3 className="text-md font-semibold text-gray-800 mb-2">Línea de Tiempo</h3>
                 <div className="space-y-3">
                  {(form.milestones || []).map(m => (<div key={m.id} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg"><div className="flex-grow"><p className="font-semibold">{m.title}</p><p className="text-sm text-gray-600">{m.description}</p></div><button type="button" onClick={() => handleRemoveMilestone(m.id)} className="text-red-500 hover:text-red-700 p-1"><TrashIcon /></button></div>))}
                  {(form.milestones || []).length === 0 && <p className="text-sm text-gray-400">Aún no hay hitos.</p>}
                </div>
              </div>
              <div className="border-t pt-6 space-y-3">
                 <h3 className="text-md font-semibold text-gray-800">Añadir Hito</h3>
                 <select value={selectedTemplate} onChange={e => setSelectedTemplate(e.target.value)} className="input-style">{milestoneTemplates.map(template => (<option key={template.key} value={template.key}>{template.icon} {template.title}</option>))}</select>
                 <textarea placeholder="Descripción (opcional)" value={customDescription} onChange={e => setCustomDescription(e.target.value)} className="input-style" rows={2} />
                 <button type="button" onClick={handleAddMilestone} className="btn-secondary !text-xs !py-1.5 !px-4"><PlusIcon /> Añadir Hito</button>
              </div>
            </div>
          </div>
          <div className="flex justify-end pt-4">
            <button type="submit" disabled={isSaving} className="btn-primary">{isSaving ? 'Guardando...' : 'Guardar Cambios'}</button>
          </div>
        </form>
      </div>
    </AuthGate>
  );
}